'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/lib/sdkConfig';

interface AuthContextType {
  token: string | null;
  login: (token: string, remember: boolean) => void;
  logout: () => void;
  userData: User | null;
}

type JwtPayload = {
  sub: string;
};

interface User {
  id: string;
  role: string;
  isValidated: boolean;
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  lastOrderDate: Date;
  profile: {
    profilePicture: string;
    birthDate: Date;
    gender: string;
  };
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  userData: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  // Restaurar token al iniciar
  useEffect(() => {
    const storedToken =
      sessionStorage.getItem('pharmatechToken') ||
      localStorage.getItem('pharmatechToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Escuchar cambios en el almacenamiento (multi-tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken =
        sessionStorage.getItem('pharmatechToken') ||
        localStorage.getItem('pharmatechToken');
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUserData(null);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.sub;

        if (!userId) {
          console.error('No se encontró userId en el token');
          return;
        }

        const profileResponse = await api.user.getProfile(userId, token);
        setUserData(profileResponse);
        console.log('Perfil obtenido:', profileResponse);
      } catch (error) {
        console.error('Error al obtener perfil o decodificar token:', error);
        setUserData(null);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = (newToken: string, remember: boolean) => {
    sessionStorage.setItem('pharmatechToken', newToken);
    if (remember) {
      localStorage.setItem('pharmatechToken', newToken);
    }
    setToken(newToken);
    router.push('/');
  };

  const logout = () => {
    sessionStorage.removeItem('pharmatechToken');
    localStorage.removeItem('pharmatechToken');
    setToken(null);
    setUserData(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export type { User };
