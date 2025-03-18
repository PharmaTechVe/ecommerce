'use client';
import NavBar, { NavBarProps } from '@/components/Navbar';

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

  return (
    <div>
      <NavBar {...navBarProps} />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Pharmatech</h1>
        <p>
          This page only incorporates the NavBar with props passed from the
          page.
        </p>
      </main>
    </div>
  );
}
