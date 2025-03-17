'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import Button from './Button';
import Avatar from './Avatar';

interface NavBarProps {
  cartItemCount: number;
  isLoggedIn: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ cartItemCount, isLoggedIn }) => {
  const categories = ['Categorias', 'Medicamentos', 'Suplementos'];

  const handleSearch = (query: string, category: string) => {
    console.log('Buscando:', query, 'en categoría:', category);
  };

  // Estado para controlar el buscador en móvil
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const toggleMobileSearch = () => setMobileSearchVisible((prev) => !prev);
  const closeMobileSearch = () => setMobileSearchVisible(false);

  return (
    <>
      <nav className="mx-auto my-4 hidden max-w-7xl rounded-2xl bg-white px-6 py-4 shadow-md sm:block">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo-horizontal.svg"
                alt="Pharmatech Logo"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-full sm:w-4/5">
              <SearchBar
                categories={categories}
                onSearch={handleSearch}
                width="100%"
                height="40px"
                borderRadius="8px"
                backgroundColor="#FFFFFF"
                textColorDrop="#000000"
                textplaceholderColor="#999999"
                categoryColor="#1C64F2"
                inputPlaceholder="Buscar producto"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div onClick={closeMobileSearch} className="cursor-pointer">
                <Avatar />
              </div>
            ) : (
              <Button
                width="auto"
                onClick={() => {
                  closeMobileSearch();
                  console.log('Iniciando sesión...');
                }}
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </nav>

      <nav className="mx-auto my-4 max-w-7xl rounded-2xl bg-white px-4 py-3 shadow-md sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo-horizontal.svg"
                alt="Pharmatech Logo"
                width={100}
                height={30}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileSearch}
              className="p-2 text-gray-700 hover:text-black"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div onClick={closeMobileSearch} className="cursor-pointer">
                <Avatar />
              </div>
            ) : (
              <Button
                width="auto"
                onClick={() => {
                  closeMobileSearch();
                  console.log('Iniciando sesión...');
                }}
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>

        {mobileSearchVisible && (
          <div className="mt-2">
            <SearchBar
              categories={categories}
              onSearch={handleSearch}
              width="100%"
              height="60px"
              borderRadius="8px"
              backgroundColor="#FFFFFF"
              textColorDrop="#000000"
              textplaceholderColor="#999999"
              categoryColor="#1C64F2"
              inputPlaceholder="Buscar producto"
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
