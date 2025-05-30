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
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';

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

// Debounce hook to batch updates
function useDebouncedCallback<T>(callback: (args: T) => void, delay: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  return (args: T) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => callback(args), delay);
  };
}

// Transform local items into SDK payload
function toCreateCartDetails(items: CartItem[]) {
  return items.map((item) => ({
    productPresentationId: item.id,
    quantity: item.quantity,
  }));
}

// Merge DB items with local items (keep stock limits)
function mergeItems(
  dbItems: Array<{ id: string; quantity: number }>,
  localItems: CartItem[],
): CartItem[] {
  const map = new Map<string, CartItem>();
  localItems.forEach((item) => map.set(item.id, { ...item }));
  dbItems.forEach((db) => {
    const local = map.get(db.id);
    if (local) {
      const mergedQty = Math.min(local.stock, local.quantity + db.quantity);
      map.set(db.id, { ...local, quantity: mergedQty });
    }
  });
  return Array.from(map.values()).filter((item) => item.quantity > 0);
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const alertShownRef = useRef(false);

  // Load initial from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing local cart', error);
      }
    }
  }, []);

  // On login: get or create cart, merge and persist
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        let db = await api.cart.get(token);
        if (!db.length) {
          await api.cart.create({ items: [] }, token);
          db = [];
        }
        const merged = mergeItems(
          db.map((i) => ({ id: i.id, quantity: i.quantity })),
          cartItems,
        );
        setCartItems(merged);
        await api.cart.update({ items: toCreateCartDetails(merged) }, token);
      } catch (error) {
        const err = error as { status?: number };
        if (err.status === 404) {
          await api.cart.create({ items: [] }, token);
        } else {
          console.error('Error synchronizing cart on login', error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Debounced sync & localStorage + count
  const syncCart = useDebouncedCallback(async (items: CartItem[]) => {
    if (!token) return;
    try {
      await api.cart.update({ items: toCreateCartDetails(items) }, token);
    } catch (error) {
      console.error('Error updating cart', error);
    }
  }, 1000);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    syncCart(cartItems);
    setItemsCount(cartItems.reduce((acc, i) => acc + i.quantity, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Flush on page unload
  useEffect(() => {
    const handler = () => {
      if (token && cartItems.length) {
        api.cart
          .update({ items: toCreateCartDetails(cartItems) }, token)
          .catch((error) => console.error('Error flushing cart', error));
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [cartItems, token]);

  const showStockAlert = useCallback(() => {
    if (!alertShownRef.current) {
      alertShownRef.current = true;
      toast.error('No hay suficiente stock para este producto.');
      setTimeout(() => (alertShownRef.current = false), 1000);
    }
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setCartItems((prev) => {
        const exists = prev.find((p) => p.id === item.id);
        if (exists) {
          if (exists.quantity < item.stock) {
            return prev.map((p) =>
              p.id === item.id
                ? { ...p, quantity: p.quantity + item.quantity }
                : p,
            );
          }
          showStockAlert();
          return prev;
        }
        return [...prev, item];
      });
    },
    [showStockAlert],
  );

  const updateItemQuantity = useCallback(
    (id: string, quantity: number) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            if (quantity > item.stock) {
              showStockAlert();
              return item;
            }
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        }),
      );
    },
    [showStockAlert],
  );

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    if (token) {
      api.cart
        .update({ items: [] }, token)
        .catch((error) => console.error('Error clearing cart', error));
    }
  }, [token]);

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
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
