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
      // Espera el tiempo de duración de la animación (500ms) para que finalice la transición
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo oscuro con animación de opacidad */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      {/* Contenedor del carrito con animación personalizada */}
      <div
        className={`absolute right-0 h-full w-full transform bg-white shadow-xl md:w-[551px] ${
          isOpen ? 'animate-slideIn' : 'animate-slideOut'
        }`}
      >
        <Cart closeCart={closeCart} />
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-in-out forwards;
        }
        .animate-slideOut {
          animation: slideOut 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartOverlay;
