'use client';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';

export default function Home() {
  const avatarProps = {
    name: 'Juan Pérez',
    imageUrl: '/images/profilePic.jpeg',
    size: 52,
    showStatus: true,
    isOnline: true,
    withDropdown: true,
    dropdownOptions: [
      { label: 'Perfil', route: '/profile' },
      { label: 'Cerrar sesión', route: '/login' },
    ],
  };

  const navBarProps: NavBarProps = {
    isLoggedIn: true,
    avatarProps: avatarProps,
  };
  const slides = [
    { id: 1, imageUrl: '/images/banner-oferta.png' },
    { id: 2, imageUrl: '/images/banner-pharma.png' },
    { id: 3, imageUrl: '/images/banner-oferta.png' },
    { id: 4, imageUrl: '/images/banner-prueba.png' },
  ];

  return (
    <div>
      <div className="fixed left-0 right-0 top-0 z-50 bg-white shadow">
        <NavBar {...navBarProps} />
      </div>
      <main className="p-4 pt-[124px]">
        <div className="mx-auto w-full max-w-[95vw] p-2 md:max-w-6xl md:p-4">
          <Carousel slides={slides} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
