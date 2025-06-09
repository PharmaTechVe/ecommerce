'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/Avatar';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import '../styles/globals.css';
import { Colors } from '../styles/styles';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import CartOverlay from './Cart/CartOverlay';
import NotificationBell from '@/components/User/NotificationBell';
import { useNotifications } from '@/lib/utils/helpers/useNotificationList';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  profile: {
    profilePicture: string;
  };
}

export default function NavBar() {
  const router = useRouter();

  const { itemsCount } = useCart();
  const { token, user, isLoading } = useAuth();
  const {
    notifications,
    notificationCount,
    isNotificationsOpen,
    toggleNotifications,
    panelRef,
  } = useNotifications(token ?? undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

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
              {itemsCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                  {itemsCount}
                </span>
              )}
            </div>

            {isLoggedIn && userData ? (
              <>
                <NotificationBell
                  isMobile={false}
                  notificationCount={notificationCount}
                  isOpen={isNotificationsOpen}
                  onToggle={toggleNotifications}
                  notifications={notifications}
                  panelRef={panelRef}
                />
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  size={52}
                  imageUrl={userData.profile.profilePicture}
                  withDropdown={true}
                  onProfileClick={() => router.push('/user')}
                />
              </>
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
            {isLoggedIn && (
              <NotificationBell
                isMobile
                notificationCount={notificationCount}
                isOpen={isNotificationsOpen}
                onToggle={toggleNotifications}
                notifications={notifications}
                panelRef={panelRef}
              />
            )}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              {itemsCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                  {itemsCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <SearchBar
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
