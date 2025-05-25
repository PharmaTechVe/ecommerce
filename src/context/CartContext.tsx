'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';

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
  itemsCount: number;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const alertShownRef = useRef(false);

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

  const showStockAlert = useCallback(() => {
    if (!alertShownRef.current) {
      alertShownRef.current = true;
      toast.error('No hay suficiente stock para este producto.');
      setTimeout(() => {
        alertShownRef.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setItemsCount(totalItems);
  }, [cartItems]);

  const addItem = useCallback((item: CartItem) => {
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
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
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
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('mergedUser');
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
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
