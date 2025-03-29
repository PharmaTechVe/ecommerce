'use client';
import { useEffect, useState } from 'react';
import Cart from './Cart';

interface CartOverlayProps {
  isOpen: boolean;
  closeCart: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, closeCart }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      <div
        className={`absolute right-0 h-full w-full transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:w-[551px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-[120%]'
        } bg-white shadow-xl`}
      >
        <Cart closeCart={closeCart} />
      </div>
    </div>
  );
};

export default CartOverlay;
