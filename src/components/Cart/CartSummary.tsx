import React from 'react';
import Button from '@/components/Button';

interface Props {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<Props> = ({
  subtotal,
  discount,
  tax,
  total,
  onCheckout,
}) => {
  return (
    <div className="bg-white px-4 pb-6">
      <hr className="mb-4 border-t border-[#DFE4EA]" />
      {/* Subtotal */}
      <div className="mb-2 flex justify-between">
        <span className="text-[18px] font-normal leading-[27px] text-[#393938]">
          Subtotal
        </span>
        <span className="text-[18px] font-normal leading-[27px] text-[#393938]">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      {/* Descuento */}
      <div className="mb-2 flex justify-between">
        <span className="text-[18px] font-normal leading-[27px] text-[#393938]">
          Descuento
        </span>
        <span className="text-[18px] font-normal leading-[27px] text-[#2ECC71]">
          - ${discount.toFixed(2)}
        </span>
      </div>
      {/* Impuestos */}
      <div className="mb-2 flex justify-between">
        <span className="text-[16px] leading-[24px] text-[#666666]">
          IVA (8%)
        </span>
        <span className="text-[16px] leading-[24px] text-[#666666]">
          ${tax.toFixed(2)}
        </span>
      </div>
      {/* Total */}
      <div className="mb-6 flex justify-between">
        <span className="text-[20px] font-normal leading-[30px] text-[#393938]">
          Total
        </span>
        <span className="text-[20px] font-normal leading-[30px] text-[#393938]">
          ${total.toFixed(2)}
        </span>
      </div>
      {/* Botón de pago */}
      <Button
        onClick={onCheckout}
        variant="submit"
        width="100%"
        height="50px"
        className="rounded-md text-lg font-medium"
      >
        Ir a pagar
      </Button>
    </div>
  );
};

export default CartSummary;
