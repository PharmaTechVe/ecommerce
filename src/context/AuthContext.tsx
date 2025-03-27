'use client';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Validar el token al inicializar el contexto
  useEffect(() => {
    const storedToken =
      sessionStorage.getItem('pharmatechToken') ||
      localStorage.getItem('pharmatechToken'); // Verificar ambos lugares
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Sincronizar el estado del token entre pestañas
  useEffect(() => {
    const syncLogout = () => {
      const storedToken = localStorage.getItem('pharmatechToken');
      setToken(storedToken);
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('pharmatechToken', newToken);
    sessionStorage.setItem('pharmatechToken', newToken); // Guardar en ambos lugares
    setToken(newToken);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('pharmatechToken');
    sessionStorage.removeItem('pharmatechToken');
    setToken(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
