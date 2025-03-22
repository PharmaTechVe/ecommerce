'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

//! Se añade la propiedad stock a la interfaz CartItem.
export interface CartItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  quantity: number;
  image: string;
  stock: number; //! Stock disponible del producto
}

// Interfaz del contexto
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

  // Recuperar el carrito del localStorage (opcional)
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

  // Guardar en localStorage cada vez que cartItems cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        //! Validación del stock: si la cantidad ya es igual al stock, no se incrementa
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
          alert('No hay suficiente stock para este producto.');
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
            alert('No hay suficiente stock para este producto.');
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
