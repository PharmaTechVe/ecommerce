'use client';
import React, { useState } from 'react';
import { Colors } from '@/styles/styles';

type CartButtonProps = {
  size?: 'default' | 'compact'; // Nueva propiedad para manejar el tamaño del botón
};

const CartButton: React.FC<CartButtonProps> = ({ size = 'default' }) => {
  const [quantity, setQuantity] = useState<number>(0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const handleSubtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1)
      setQuantity(quantity - 1); // Permite solo restar si la cantidad es mayor que 1
    else setQuantity(0); // Si la cantidad es 1, se debe mostrar solo el botón "+"
  };

  // Estilos condicionales según el tamaño
  const buttonStyles = {
    default: 'w-32 h-10', // Para el tamaño default
    compact: 'w-20 h-6', // Para el tamaño compacto
  };

  // Estilo condicional para el borde
  const containerStyles =
    quantity === 0
      ? 'w-10 h-10 rounded-full' // Redondo cuando la cantidad es 0
      : `w-32 h-10 ${buttonStyles[size]} rounded-full`; // Borde de elipse cuando la cantidad es 1 o más

  return (
    <div
      className={`${containerStyles} flex items-center overflow-hidden bg-[${Colors.primary}]`}
    >
      {/* Si la cantidad es 0, solo mostramos el botón "+" */}
      {quantity === 0 ? (
        <div
          onClick={handleAdd}
          className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
        >
          +
        </div>
      ) : (
        <>
          <div
            onClick={handleSubtract}
            className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
          >
            -
          </div>
          <div className="flex flex-1 select-none items-center justify-center text-white">
            {quantity}
          </div>
          <div
            onClick={handleAdd}
            className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
          >
            +
          </div>
        </>
      )}
    </div>
  );
};

export default CartButton;
