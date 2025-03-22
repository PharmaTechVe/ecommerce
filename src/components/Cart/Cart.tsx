import React from 'react';
import { useRouter } from 'next/navigation';
import CartItemComponent from './CartItem';
import CartSummary from './CartSummary';
import { useCart, CartItem } from '@/contexts/CartContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CartProps {
  closeCart: () => void;
}

const Cart: React.FC<CartProps> = ({ closeCart }) => {
  const router = useRouter();
  const { cartItems, updateItemQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discount = cartItems.reduce((acc, item) => {
    if (item.oldPrice) {
      return acc + (item.oldPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="flex h-full w-[551px] flex-col bg-[#FAFAFA]">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-[#DFE4EA] px-6 py-4">
        <h4 className="font-poppins text-[28px] font-normal leading-[42px] text-[#393938]">
          Carrito de compras
        </h4>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-200"
          onClick={closeCart}
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Contenido del carrito */}
      <div className="flex flex-grow flex-col">
        {cartItems.length === 0 ? (
          <div className="flex flex-grow items-center justify-center bg-white p-4">
            <p className="text-xl text-gray-500">
              No hay productos en el carrito.
            </p>
          </div>
        ) : (
          <>
            {/* Listado de productos */}
            <div className="flex-grow overflow-y-scroll bg-white px-4 py-2">
              {cartItems.map((item: CartItem) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onChangeQuantity={(id, increment) =>
                    updateItemQuantity(id, item.quantity + increment)
                  }
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Resumen de compra */}
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
