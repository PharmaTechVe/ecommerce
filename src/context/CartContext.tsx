'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const alertShownRef = useRef(false);
  const { token } = useAuth();
  console.log('Token in Cart Provider:', token);

  const showStockAlert = () => {
    if (!alertShownRef.current) {
      alertShownRef.current = true;
      alert('No hay suficiente stock para este producto.');
      setTimeout(() => {
        alertShownRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart items from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!token) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, [token]);

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        if (exists.quantity < item.stock) {
          return prev.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p,
          );
        } else {
          console.log(
            'Intento de agregar item ya con cantidad máxima:',
            exists.quantity,
            '>=',
            item.stock,
          );
          showStockAlert();
          return prev;
        }
      }
      return [...prev, item];
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (quantity > item.stock) {
            console.log(
              'Intento de incrementar más allá del stock:',
              quantity,
              '>',
              item.stock,
            );
            showStockAlert();
            return item;
          }
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, updateItemQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
