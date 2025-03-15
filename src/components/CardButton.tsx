import React, { useState } from 'react';
import Image from 'next/image';

interface CardButtonProps {
  imageUrl: string;
  title: string;
  stock: number;
  originalPrice: number;
  discount: number;
}

const CardButton: React.FC<CardButtonProps> = ({
  imageUrl,
  title,
  stock,
  originalPrice,
  discount,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const discountedPrice = originalPrice - originalPrice * (discount / 100);

  const handleAdd = () => setQuantity(quantity + 1);
  const handleSubtract = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    alert(`${quantity} ${title} added to cart`);
  };

  return (
    <div className="w-72 rounded-lg border bg-white p-4 shadow-lg">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={title}
          width={288}
          height={160}
          layout="responsive"
          objectFit="cover"
          className="cursor-pointer rounded-md"
          onClick={() => setIsModalOpen(true)}
        />
        <span className="absolute right-2 top-2 rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-600">
          Medicamento
        </span>
      </div>

      <h3 className="text-md mt-2 font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">Stock: {stock}</p>
      <div className="mt-1 flex items-center gap-2">
        {discount > 0 && (
          <>
            <span className="text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="rounded bg-teal-100 px-1 text-sm text-teal-600">
              -{discount}%
            </span>
          </>
        )}
      </div>
      <p className="text-xl font-bold">
        {discount > 0
          ? `$${discountedPrice.toFixed(2)}`
          : `$${originalPrice.toFixed(2)}`}
      </p>

      <div className="mt-3 flex items-center gap-4">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white"
          onClick={handleSubtract}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white"
          onClick={handleAdd}
        >
          +
        </button>
      </div>

      <button
        className="mt-3 w-full rounded-lg bg-blue-900 py-2 text-white"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-2 text-lg font-bold">{title}</h2>
            <Image
              src={imageUrl}
              alt={title}
              width={384}
              height={160}
              layout="responsive"
              objectFit="cover"
              className="mb-3 rounded-md"
            />
            <p>
              <strong>Stock:</strong> {stock}
            </p>
            <p>
              <strong>Price:</strong>{' '}
              {discount > 0
                ? `$${discountedPrice.toFixed(2)}`
                : `$${originalPrice.toFixed(2)}`}
            </p>
            {discount > 0 && (
              <p>
                <strong>Original Price:</strong>{' '}
                <span className="line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              </p>
            )}
            <button
              className="mt-3 w-full rounded-lg bg-blue-900 py-2 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardButton;
