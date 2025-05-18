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
import { CategoryResponse, Pagination } from '@pharmatech/sdk';
import CartOverlay from './Cart/CartOverlay';
import NotificationBell from '@/components/User/NotificationBell';

interface UserProfile {
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
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { cartItems } = useCart();
  const { token, user, isLoading } = useAuth();

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    api.category
      .findAll({ page: 1, limit: 20 })
      .then((resp: Pagination<CategoryResponse>) => {
        if (resp?.results) setCategories(resp.results);
      })
      .catch((err: unknown) => {
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
        } finally {
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

  // Cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      await fetchEventSource(`${API_URL}/notification/stream`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        async onopen(res) {
          if (res.ok && res.status === 200) {
            console.log('Connection made ', res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log('Client side error ', res);
          }
        },
        onmessage(event) {
          console.log('New message from server', event);
          setNotificationCount((prev) => prev + 1);
        },

        onerror(err) {
          console.log('There was an error from server', err);
        },
      });
    };
    if (token) {
      fetchData();
    }
    return () => {
      controller.abort();
      console.log('Connection aborted');
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
      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} closeCart={() => setIsCartOpen(false)} />

      {/* Versión Desktop */}
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
            {/* Carrito */}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                {totalCount}
              </span>
            </div>

            {/* Notificaciones */}
            <NotificationBell
              isMobile={false}
              notificationCount={notificationCount}
              isOpen={isNotificationsOpen}
              onToggle={() => {
                setNotificationCount(0);
                setIsNotificationsOpen((prev) => !prev);
              }}
              refProp={notificationsRef}
            />

            {/* Usuario */}
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

      {/* Versión Mobile */}
      <nav className="mx-auto my-4 max-w-7xl rounded-2xl bg-white px-4 py-3 shadow sm:hidden">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Columna izquierda: avatar */}
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

          {/* Columna centro: logo */}
          <Link href="/" className="justify-self-center">
            <Image
              src="/images/logo-horizontal.svg"
              alt="Logo Pharmatech"
              width={100}
              height={30}
              priority
            />
          </Link>

          {/* Columna derecha: campanita + carrito */}
          <div className="flex items-center gap-4 justify-self-end">
            <NotificationBell
              isMobile
              notificationCount={notificationCount}
              isOpen={isNotificationsOpen}
              onToggle={() => {
                setNotificationCount(0);
                setIsNotificationsOpen((prev) => !prev);
              }}
              refProp={notificationsRef}
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
