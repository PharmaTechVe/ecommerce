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
    if (item.discount) {
      return acc + item.price * item.quantity * (item.discount / 100);
    }
    return acc;
  }, 0);

  const tax = (subtotal - discount) * 0.16;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-white p-4 shadow-lg md:w-[551px]">
      <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3">
        <h4 className="text-2xl font-semibold text-gray-800">
          Carrito de compras
        </h4>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200"
          onClick={closeCart}
        >
          <XMarkIcon className="h-6 w-6 text-gray-800" />
        </button>
      </div>
      <div className="flex flex-grow flex-col overflow-hidden">
        {cartItems.length === 0 ? (
          <div className="flex flex-grow items-center justify-center">
            <p className="text-lg text-gray-500">
              No hay productos en el carrito.
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex-1 overflow-y-auto px-4 py-2"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
            >
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
            <div className="border-t border-gray-200 bg-white px-4 py-6">
              <CartSummary
                subtotal={subtotal}
                discount={discount}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
