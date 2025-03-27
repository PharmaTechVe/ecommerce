import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from './Cart';

interface CartOverlayProps {
  isOpen: boolean;
  closeCart: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, closeCart }) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setLocalIsOpen(false);
    setTimeout(() => closeCart(), 400);
  };

  return (
    <AnimatePresence onExitComplete={() => closeCart()}>
      {localIsOpen && (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-30" // Eliminado backdrop-blur-sm
          onClick={handleClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              ease: [0.25, 0.1, 0.25, 1],
              duration: 0.4,
            }}
            className="absolute right-0 h-full max-h-screen w-full overflow-hidden md:w-[551px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full w-full bg-[#FAFAFA] shadow-[0_-8px_32px_rgba(0,0,0,0.1)]">
              <Cart closeCart={handleClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
