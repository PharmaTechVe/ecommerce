import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CartItemComponent from './CartItem';
import CartSummary from './CartSummary';
import { useCart, CartItem } from '@/context/CartContext';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalConfirm from '../ModalConfirm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

interface CartProps {
  closeCart: () => void;
}

const Cart: React.FC<CartProps> = ({ closeCart }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, updateItemQuantity, removeItem, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const total = subtotal - discount;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Por favor, inicia sesión para continuar con la compra.');
      closeCart();
      router.push('/login?redirect=/checkout');
      return;
    }
    closeCart();
    router.push('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-lg bg-white p-4 shadow-lg md:w-[551px]">
        <div className="flex items-center justify-between px-6 py-3">
          <h4 className="mt-2 text-[28px] text-[#393938]">
            Carrito de compras
          </h4>
          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200"
              onClick={() => setIsModalOpen(true)}
              title="Limpiar carrito"
            >
              <TrashIcon className="h-6 w-6 text-gray-800" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200"
              onClick={closeCart}
              title="Cerrar carrito"
            >
              <XMarkIcon className="h-6 w-6 text-gray-800" />
            </button>
          </div>
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

              <hr className="mb-2 border-t border-gray-100" />
              <div className="bg-white p-8">
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  total={total}
                  onCheckout={handleCheckout}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <ModalConfirm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearCart}
        icon={TrashIcon}
        title="Limpiar carrito"
        description="¿Estás seguro de eliminar todos los productos del carrito?"
        cancelText="Cancelar"
        confirmText="Confirmar"
      />
    </>
  );
};

export default Cart;
