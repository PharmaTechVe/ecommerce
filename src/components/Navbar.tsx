'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Avatar, { AvatarProps } from '@/components/Avatar';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import '../styles/globals.css';
import { Colors } from '../styles/styles';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export type NavBarProps = {
  isLoggedIn: boolean;
  avatarProps?: AvatarProps;
};

export default function NavBar({ isLoggedIn, avatarProps }: NavBarProps) {
  const router = useRouter();
  const categories = ['Categorías', 'Tecnología', 'Salud', 'Otros'];
  const { token } = useAuth();
  const handleSearch = (query: string, category: string) => {
    console.log('Buscando:', query, 'en', category);
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLoginClick = () => {
    localStorage.removeItem('pharmatechToken');
    sessionStorage.removeItem('pharmatechToken');

    isLoggedIn = false;
    router.push('/login');
  };

  return (
    <>
      {/* Desktop Version */}
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
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
                3
              </span>
            </div>
            {token ? (
              avatarProps ? (
                <Avatar {...avatarProps} />
              ) : (
                <Avatar
                  name="Usuario"
                  size={52}
                  imageUrl="/images/profilePic.jpeg"
                />
              )
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

      {/* Mobile Version */}
      <nav className="mx-auto my-4 max-w-7xl rounded-2xl bg-white px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          {isLoggedIn ? (
            avatarProps ? (
              <Avatar {...avatarProps} />
            ) : (
              <Avatar
                name="Usuario"
                size={52}
                imageUrl="/images/profilePic.jpeg"
              />
            )
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
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-black" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C2143] text-xs font-semibold text-white">
              3
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
