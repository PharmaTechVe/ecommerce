import React from 'react';
import Cart from './Cart';

interface CartOverlayProps {
  isOpen: boolean;
  closeCart: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, closeCart }) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo semitransparente; al hacer clic se cierra el overlay */}
      <div className="w-full bg-black bg-opacity-30" onClick={closeCart} />
      {/* Contenedor del carrito con animación */}
      <div
        className={`relative h-full w-[551px] transform bg-[#FAFAFA] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Cart closeCart={closeCart} />
      </div>
    </div>
  );
};

export default CartOverlay;
