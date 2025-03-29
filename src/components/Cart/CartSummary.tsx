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
    <div className="">
      <div className="mb-2 flex justify-between">
        <span className="text-[18px] font-normal leading-[27px] text-[#393938]">
          Subtotal
        </span>
        <span className="text-[18px] font-normal leading-[27px] text-[#393938]">
          ${Number.isInteger(subtotal) ? subtotal : subtotal.toFixed(2)}
        </span>
      </div>
      <div className="mb-2 flex justify-between">
        <span className="text-[18px] font-normal leading-[27px] text-[#2ECC71]">
          Descuento
        </span>
        <span className="text-[18px] font-normal leading-[27px] text-[#2ECC71]">
          - ${Number.isInteger(discount) ? discount : discount.toFixed(2)}
        </span>
      </div>
      <div className="mb-2 flex justify-between">
        <span className="text-[16px] leading-[24px] text-[#6E6D6C]">
          IVA (16%)
        </span>
        <span className="text-[16px] leading-[24px] text-[#6E6D6C]">
          ${Number.isInteger(tax) ? tax : tax.toFixed(2)}
        </span>
      </div>
      <div className="mb-6 mt-6 flex justify-between">
        <span className="text-[28px] font-normal leading-[30px] text-[#393938]">
          Total
        </span>
        <span className="text-[20px] font-normal leading-[30px] text-[#393938]">
          ${Number.isInteger(total) ? total : total.toFixed(2)}
        </span>
      </div>
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
