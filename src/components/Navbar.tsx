'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Avatar from '@/components/Avatar';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import '../styles/globals.css';
import { Colors } from '../styles/styles';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, API_URL } from '@/lib/sdkConfig';
import {
  CategoryResponse,
  Pagination,
  NotificationResponse,
} from '@pharmatech/sdk';
import CartOverlay from './Cart/CartOverlay';
import NotificationBell from '@/components/User/NotificationBell';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  profile: {
    profilePicture: string;
  };
}

type NavBarProps = {
  onCartClick?: () => void;
};

export default function NavBar({ onCartClick }: NavBarProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const lastMsgRef = useRef<string | null>(null);
  const { cartItems } = useCart();
  const { token, user, isLoading } = useAuth();

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );

  const handleNotificationToggle = async () => {
    const willOpen = !isNotificationsOpen;

    if (willOpen && token) {
      try {
        const res = await api.notification.getNotifications(token);
        if (Array.isArray(res)) {
          setNotifications(res);

          const unread = res.filter((n) => !n.isRead);
          setNotificationCount(unread.length);

          if (unread.length > 0) {
            await Promise.all(
              unread.map((notif) =>
                api.notification.markAsRead(notif.order.id, token),
              ),
            );
            setNotifications((prev) =>
              prev.map((n) =>
                unread.some((u) => u.id === n.id) ? { ...n, isRead: true } : n,
              ),
            );
            setNotificationCount(0);
          }
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }

    setIsNotificationsOpen(willOpen);
  };

  useEffect(() => {
    api.category
      .findAll({ page: 1, limit: 20 })
      .then((resp: Pagination<CategoryResponse>) => {
        if (resp?.results) setCategories(resp.results);
      })
      .catch((err) => {
        console.error('Error al cargar categorías:', err);
      });
  }, []);

  useEffect(() => {
    if (token && user?.sub) {
      setIsLoggedIn(true);
      (async () => {
        try {
          const profileResponse = await api.user.getProfile(user.sub, token);
          setUserData(profileResponse);
        } catch (error) {
          console.error('Error al obtener perfil:', error);
          setUserData(null);
        }
      })();
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [token, user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogin(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch notifications stream
  useEffect(() => {
    if (!token) return;

    let aborted = false;
    let retryId: NodeJS.Timeout;

    const connect = () => {
      fetchEventSource(`${API_URL}/notification/stream`, {
        headers: { Authorization: `Bearer ${token}` },
        openWhenHidden: true,
        async onopen(res) {
          if (res.ok) console.log('SSE abierta');
        },
        onmessage(ev) {
          const msg = ev.data?.trim();

          if (!msg || msg === lastMsgRef.current) {
            return;
          }

          lastMsgRef.current = msg;

          setNotificationCount((c) => c + 1);
        },
        onclose() {
          if (!aborted) retryId = setTimeout(connect, 5000);
        },
        onerror() {
          if (!aborted) retryId = setTimeout(connect, 5000);
        },
      });
    };

    connect();

    return () => {
      aborted = true;
      clearTimeout(retryId);
    };
  }, [token]);

  const handleSearch = (query: string, category: string) => {
    console.log('Buscando:', query, 'en', category);
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  if (isLoading) return null;

  return (
    <>
      <CartOverlay isOpen={isCartOpen} closeCart={() => setIsCartOpen(false)} />

      {/* Desktop Nav */}
      <nav className="relative mx-auto my-4 hidden max-w-7xl rounded-2xl bg-white px-6 py-4 shadow sm:block">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link href="/">
            <Image
              src="/images/logo-horizontal.svg"
              alt="Logo Pharmatech"
              width={140}
              height={40}
              priority
            />
          </Link>
          <SearchBar
            categories={categories}
            onSearch={handleSearch}
            width="100%"
            height="40px"
            borderRadius="8px"
            backgroundColor={Colors.secondaryWhite}
            textColorDrop={Colors.textMain}
            textplaceholderColor={Colors.placeholder}
            categoryColor={Colors.primary}
            inputPlaceholder="Buscar producto"
          />
          <div className="flex items-center gap-8">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                {totalCount}
              </span>
            </div>

            <NotificationBell
              isMobile={false}
              notificationCount={notificationCount}
              isOpen={isNotificationsOpen}
              onToggle={handleNotificationToggle}
              notifications={notifications}
            />

            {isLoggedIn && userData ? (
              <Avatar
                name={`${userData.firstName} ${userData.lastName}`}
                size={52}
                imageUrl={userData.profile.profilePicture}
                withDropdown={true}
                onProfileClick={() => router.push('/user')}
              />
            ) : showLogin ? (
              <Button
                onClick={handleLoginClick}
                variant="submit"
                className="rounded-md px-4 py-2 text-sm"
                width="auto"
                height="auto"
              >
                Iniciar sesión
              </Button>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="mx-auto my-4 max-w-7xl rounded-2xl bg-white px-4 py-3 shadow sm:hidden">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {isLoggedIn && userData ? (
            <Avatar
              name={`${userData.firstName} ${userData.lastName}`}
              size={52}
              imageUrl={userData.profile.profilePicture}
              withDropdown={true}
              onProfileClick={() => router.push('/user')}
            />
          ) : showLogin ? (
            <UserCircleIcon
              className="h-8 w-8 text-gray-700"
              onClick={handleLoginClick}
            />
          ) : null}

          <Link href="/" className="justify-self-center">
            <Image
              src="/images/logo-horizontal.svg"
              alt="Logo Pharmatech"
              width={100}
              height={30}
              priority
            />
          </Link>

          <div className="flex items-center gap-4 justify-self-end">
            <NotificationBell
              isMobile
              notificationCount={notificationCount}
              isOpen={isNotificationsOpen}
              onToggle={handleNotificationToggle}
              notifications={notifications}
            />
            <div className="relative cursor-pointer" onClick={onCartClick}>
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <SearchBar
            categories={categories}
            onSearch={handleSearch}
            width="100%"
            height="40px"
            borderRadius="8px"
            backgroundColor={Colors.secondaryWhite}
            textColorDrop={Colors.textMain}
            textplaceholderColor={Colors.placeholder}
            categoryColor={Colors.primary}
            inputPlaceholder="Buscar producto"
            disableDropdown={true}
          />
        </div>
      </nav>
    </>
  );
}
