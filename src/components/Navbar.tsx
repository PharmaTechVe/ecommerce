'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
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
import NotificationList from '@/components/User/NotificationList';

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
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { cartItems } = useCart();
  const { token, user } = useAuth();

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState(0);

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
    if (!token || !user?.sub) {
      setIsLoggedIn(false);
      setUserData(null);
      return;
    }

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
  }, [token, user]);

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
          if (event.event == 'notification') {
            setNotificationCount((prev) => prev + 1);
          }
        },
        onclose() {
          console.log('Connection closed by the server');
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
            <div className="relative" ref={notificationsRef}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setNotificationCount(0);
                  setIsNotificationsOpen((prev) => !prev);
                }}
              >
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                  {notificationCount}
                </div>
                <BellIcon className="h-7 w-7 text-gray-700 hover:text-black" />
              </div>
              {isNotificationsOpen && (
                <div className="absolute right-0 z-50 mt-3 max-h-[600px] w-[400px] overflow-y-auto rounded-xl bg-white shadow-lg">
                  <NotificationList />
                </div>
              )}
            </div>

            {/* Usuario */}
            {isLoggedIn && userData ? (
              <Avatar
                name={`${userData.firstName} ${userData.lastName}`}
                size={52}
                imageUrl={userData.profile.profilePicture}
                withDropdown={true}
                onProfileClick={() => router.push('/user')}
              />
            ) : (
              <Button
                onClick={handleLoginClick}
                variant="submit"
                className="rounded-md px-4 py-2 text-sm"
                width="auto"
                height="auto"
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Versión Mobile */}
      <nav className="mx-auto my-4 max-w-7xl rounded-2xl bg-white px-4 py-3 shadow sm:hidden">
        <div className="flex items-center justify-between">
          {isLoggedIn && userData ? (
            <Avatar
              name={`${userData.firstName} ${userData.lastName}`}
              size={52}
              imageUrl={userData.profile.profilePicture}
              withDropdown={true}
              onProfileClick={() => router.push('/user')}
            />
          ) : (
            <UserCircleIcon
              className="h-8 w-8 text-gray-700"
              onClick={handleLoginClick}
            />
          )}
          <Link href="/">
            <Image
              src="/images/logo-horizontal.svg"
              alt="Logo Pharmatech"
              width={100}
              height={30}
              priority
            />
          </Link>
          <div className="relative cursor-pointer" onClick={onCartClick}>
            <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
              {totalCount}
            </span>
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
