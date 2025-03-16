import React from 'react';
import CardBase from './CardBase';
import { ImageType } from './CardBase';
import { Colors } from '@/styles/styles';
import CartButton from '../CardButton';

type ProductCardProps = {
  imageSrc: ImageType;
  ribbonText?: string;
  label?: string;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  variant?: 'default' | 'large' | 'compact';
};

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  ribbonText,
  label,
  productName,
  stock,
  currentPrice,
  lastPrice,
  discountPercentage,
  variant,
}) => {
  return (
    <CardBase
      variant={variant}
      showRibbon={!!ribbonText}
      ribbonText={ribbonText}
      imageSrc={imageSrc}
    >
      {/* Contenido del producto */}
      <div
        className={`mt-4 flex flex-col items-start px-6 ${variant === 'compact' ? 'text-xs' : 'text-base'}`}
      >
        {/* Nombre del producto */}
        <h2
          className={`w-full text-left font-semibold ${variant === 'large' ? 'text-3xl' : variant === 'compact' ? 'text-xs' : 'text-lg'}`}
          style={{
            maxWidth: variant === 'compact' ? '120px' : 'none',
            whiteSpace: 'wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: Colors.textMain,
          }}
        >
          {productName}
        </h2>

        {/* Información de stock */}
        <p
          className={`mt-2 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}
          style={{
            maxWidth: variant === 'compact' ? '140px' : 'none',
            color: Colors.textMain,
          }}
        >
          Stock: {stock}
        </p>

        {/* Precios con descuento */}
        <div className="mt-2 flex items-center text-left">
          {lastPrice !== undefined && (
            <>
              <p
                className={`line-through ${variant === 'compact' ? 'text-xs' : 'text-lg'}`}
                style={{
                  maxWidth: variant === 'compact' ? '100px' : 'none',
                  color: Colors.textMain,
                }}
              >
                ${lastPrice.toFixed(2)}
              </p>
              {discountPercentage !== undefined && (
                <span
                  className="ml-2 rounded-md px-2 py-1 font-medium text-black"
                  style={{
                    backgroundColor: Colors.secondaryLight,
                    color: Colors.textHighContrast,
                  }}
                >
                  -{discountPercentage}%
                </span>
              )}
            </>
          )}
        </div>

        <div className="mt-4 flex w-full items-center justify-between">
          <p
            className={`font-medium ${variant === 'compact' ? 'text-sm' : variant === 'large' ? 'text-3xl' : 'text-lg'}`}
            style={{
              maxWidth: variant === 'compact' ? '100px' : 'none',
              color: Colors.textHighContrast,
            }}
          >
            ${currentPrice.toFixed(2)}
          </p>

          {variant !== 'compact' && (
            <div className="ml-4">
              <CartButton size="default" />
            </div>
          )}
        </div>

        {label && (
          <div
            className="absolute right-6 top-6 rounded-full px-3 py-1 text-sm"
            style={{
              backgroundColor: Colors.secondaryLight,
              color: Colors.textHighContrast,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </CardBase>
  );
};

export default ProductCard;
