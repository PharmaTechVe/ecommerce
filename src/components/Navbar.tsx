'use client';

import React from 'react';
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

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryFindAllResponse {
  results: Category[];
  count: number;
  next: string | null;
  previous: string | null;
}

type NavBarProps = {
  onCartClick?: () => void;
};

export default function NavBar({ onCartClick }: NavBarProps) {
  const router = useRouter();
  const [categories, setCategories] = React.useState<string[]>([]);
  const { cartItems } = useCart();
  const { token, userData } = useAuth();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isLoggedIn = Boolean(token && userData);

  // Cargar categorías
  React.useEffect(() => {
    api.category
      .findAll({ page: 1, limit: 20 })
      .then((resp: CategoryFindAllResponse) => {
        if (resp && resp.results) {
          const catNames = resp.results.map((cat: Category) => cat.name);
          setCategories(catNames);
        }
      })
      .catch((err: unknown) => {
        console.error('Error al cargar categorías:', err);
      });
  }, []);

  const handleSearch = (query: string, category: string) => {
    console.log('Buscando:', query, 'en', category);
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleProfileClick = () => {
    if (userData) {
      // Redirigir al perfil del usuario
      router.push(`/user`);
    }
  };

  return (
    <>
      {/* Versión Desktop */}
      <nav className="mx-auto my-4 hidden max-w-7xl rounded-2xl bg-white px-6 py-4 shadow sm:block">
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
            <div className="relative cursor-pointer" onClick={onCartClick}>
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                {totalCount}
              </span>
            </div>
            {/* Usuario */}
            {isLoggedIn && userData ? (
              <Avatar
                name={`${userData.firstName} ${userData.lastName}`}
                size={52}
                imageUrl={userData.profile.profilePicture}
                withDropdown={true}
                onProfileClick={handleProfileClick}
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
              onProfileClick={handleProfileClick}
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
