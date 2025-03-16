import React from 'react';
import CardBase from './CardBase';
import { ImageType } from './CardBase';
import { Colors } from '@/styles/styles';

type MinimalProductCardProps = {
  imageSrc: ImageType;
  productName: string;
  stock?: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  variant?: 'responsive';
  ribbonText?: string;
};

const MinimalProductCard: React.FC<MinimalProductCardProps> = ({
  imageSrc,
  productName,
  stock,
  currentPrice,
  lastPrice,
  discountPercentage,
  variant = 'responsive',
  ribbonText,
}) => {
  return (
    <CardBase
      variant={variant}
      imageSrc={imageSrc}
      ribbonText={ribbonText}
      showRibbon={!!ribbonText}
    >
      {/* Badge */}
      <div
        className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs"
        style={{
          backgroundColor: Colors.secondaryLight,
          color: Colors.textHighContrast,
        }}
      >
        Nuevo
      </div>

      {/* Contenido del producto */}
      <div className="mt-4 flex flex-col items-start px-2">
        {/* Nombre del producto */}
        <h2
          className="text-left text-xs font-medium"
          style={{ color: Colors.textMain, whiteSpace: 'normal' }}
        >
          {productName}
        </h2>

        {stock !== undefined && (
          <p className="mt-2 text-xs" style={{ color: Colors.textMain }}>
            Stock: {stock}
          </p>
        )}

        {lastPrice !== undefined && (
          <div className="mt-2 flex items-center text-left">
            <p
              className={`text-xs line-through`}
              style={{ color: `${Colors.textMain}` }}
            >
              ${lastPrice.toFixed(2)}
            </p>
            {discountPercentage !== undefined && (
              <span
                className="ml-2 rounded-md px-2 py-1 text-xs font-medium text-black"
                style={{
                  backgroundColor: Colors.secondaryLight,
                }}
              >
                -{discountPercentage}%
              </span>
            )}
          </div>
        )}
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: Colors.secondaryLight }}
        >
          ${currentPrice.toFixed(2)}
        </p>
      </div>
    </CardBase>
  );
};

export default MinimalProductCard;
