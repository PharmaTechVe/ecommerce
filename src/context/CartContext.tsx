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
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const alertShownRef = useRef(false);
  const { token, user } = useAuth();
  console.log('Token in Cart Provider:', token);
  console.log('User in Cart Provider:', user);

  const showStockAlert = () => {
    if (!alertShownRef.current) {
      alertShownRef.current = true;
      toast.error('No hay suficiente stock para este producto.');
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

  // Al detectar cambios en el token:
  // - Si existe y además tenemos el usuario decodificado, se fusiona el carrito local con el del usuario (si no se ha fusionado ya).
  // - Si no hay token, se mantiene el carrito del usuario anónimo.
  useEffect(() => {
    if (token && user) {
      const userId = user.sub;
      // Verificar si ya se fusionó el carrito para este usuario usando un flag en localStorage
      const mergedUser = localStorage.getItem('mergedUser');
      if (mergedUser === userId) {
        // Ya se realizó la fusión para este usuario
        return;
      }

      // Aquí se debería obtener el carrito del usuario desde la API.
      // Descomenta y ajusta el siguiente bloque cuando el endpoint esté listo:
      /*
      api.cart.getUserCart(token)
        .then((serverCart: CartItem[]) => {
          const localCart: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
          const mergedCart = mergeCarts(serverCart, localCart);
          setCartItems(mergedCart);
          localStorage.setItem('cartItems', JSON.stringify(mergedCart));
          // Guardar el userId para evitar fusiones repetidas
          localStorage.setItem('mergedUser', userId);
        })
        .catch((error) => {
          console.error('Error al obtener el carrito del usuario:', error);
        });
      */

      // Simulación: Se fusiona el carrito local con un carrito de servidor vacío
      const localCart: CartItem[] = JSON.parse(
        localStorage.getItem('cartItems') || '[]',
      );
      const mergedCart = mergeCarts([], localCart);
      setCartItems(mergedCart);
      localStorage.setItem('cartItems', JSON.stringify(mergedCart));
      localStorage.setItem('mergedUser', userId);
    }
    // Si no hay token, se mantiene el carrito guardado sin limpiarlo.
  }, [token, user]);

  // Función para fusionar dos carritos sumando las cantidades en caso de que se repita el mismo ítem
  const mergeCarts = (
    serverCart: CartItem[],
    localCart: CartItem[],
  ): CartItem[] => {
    const merged = [...serverCart];
    localCart.forEach((localItem) => {
      const index = merged.findIndex((item) => item.id === localItem.id);
      if (index !== -1) {
        // Si el ítem ya existe, se suman las cantidades
        merged[index].quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    });
    return merged;
  };

  // Función para agregar un ítem al carrito
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

  // Función para actualizar la cantidad de un ítem del carrito
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

  // Función para eliminar un ítem del carrito
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Función para vaciar el carrito (por ejemplo, al hacer logout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('mergedUser');
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
