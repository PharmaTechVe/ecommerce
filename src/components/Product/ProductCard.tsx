'use client';
import React from 'react';
import CardBase from './CardBase';
import { ImageType } from './CardBase';
import { Colors, FontSizes } from '@/styles/styles';
import CardButton from '../CardButton';
import Link from 'next/link';

export type ProductCardProps = {
  productPresentationId: string;
  productId: string;
  presentationId: string;
  imageSrc: ImageType;
  ribbonText?: string;
  label?: string;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  variant?: 'regular' | 'minimal' | 'responsive';
};

const ProductCard: React.FC<ProductCardProps> = ({
  productPresentationId,
  productId,
  presentationId,
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
  // Definimos el objeto de la ruta para el detalle del producto
  const detailLink = {
    pathname: `/product/${productId}/presentation/${presentationId}`,
    query: { productPresentationId },
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <CardBase
        variant={variant}
        showRibbon={!!ribbonText}
        ribbonText={ribbonText}
        imageSrc={imageSrc}
        label={label}
        imageLink={detailLink} // PASAMOS LA RUTA: la imagen ahora es clickeable
      >
        <div
          className={`flex flex-col px-[24px] ${
            variant === 'responsive' ? 'pt-[10px]' : 'pt-[18px]'
          }`}
        >
          {variant === 'responsive' && (
            <div className="mb-[5px] flex justify-end">
              <CardButton
                product={{
                  productId: productId, // del API
                  presentationId: presentationId, // del API
                  name: productName,
                  price: lastPrice || currentPrice,
                  discount: discountPercentage,
                  image: typeof imageSrc === 'string' ? imageSrc : imageSrc.src,
                  stock: stock,
                }}
              />
            </div>
          )}
          <Link href={detailLink}>
            <p
              className="w-full text-left"
              style={{
                fontSize: `${
                  variant === 'minimal'
                    ? FontSizes.s1.size
                    : variant === 'responsive'
                      ? FontSizes.b1.size
                      : FontSizes.h5.size
                }px`,
                lineHeight: `${
                  variant === 'minimal'
                    ? FontSizes.s1.lineHeight
                    : variant === 'responsive'
                      ? FontSizes.b1.lineHeight
                      : FontSizes.h5.lineHeight
                }px`,
                color: Colors.textMain,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {productName}
            </p>
            <p
              className={`${
                variant === 'minimal'
                  ? 'mb-[5px] mt-[20px]'
                  : variant === 'responsive'
                    ? 'mb-[2px] mt-[10px]'
                    : 'mb-[20px] mt-[38px]'
              }`}
              style={{
                fontSize: `${
                  variant === 'minimal'
                    ? FontSizes.b3.size
                    : variant === 'responsive'
                      ? FontSizes.b3.size
                      : FontSizes.b1.size
                }px`,
                lineHeight: `${
                  variant === 'minimal'
                    ? FontSizes.b3.lineHeight
                    : variant === 'responsive'
                      ? FontSizes.b3.lineHeight
                      : FontSizes.b1.lineHeight
                }px`,
                color: Colors.textMain,
              }}
            >
              Stock: {stock}
            </p>
          </Link>

          <div
            className={`mt-4 flex w-full items-end justify-between ${
              variant === 'minimal'
                ? 'pb-[16px]'
                : variant === 'responsive'
                  ? 'pb-[6px]'
                  : 'pb-[30px]'
            }`}
          >
            <div className="flex flex-col">
              {lastPrice !== undefined && (
                <div
                  className={`${
                    variant === 'responsive' ? 'mt-[5px]' : 'mt-[10px]'
                  } flex items-center`}
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <p
                    className="line-through"
                    style={{
                      fontSize: `${FontSizes.s1.size}px`,
                      lineHeight: `${FontSizes.s1.lineHeight}px`,
                      color: Colors.textMain,
                    }}
                  >
                    ${lastPrice.toFixed(2)}
                  </p>
                  {discountPercentage !== undefined && (
                    <div
                      className="ml-[10px] flex items-center justify-center"
                      style={{
                        width: '50px',
                        height: '28px',
                        backgroundColor: Colors.secondaryLight,
                        color: Colors.textHighContrast,
                        borderRadius: '3px',
                        fontSize: FontSizes.b1.size,
                        flexShrink: 0,
                      }}
                    >
                      -{discountPercentage}%
                    </div>
                  )}
                </div>
              )}

              <p
                className={`font-medium ${
                  variant === 'minimal'
                    ? 'mt-[10px] pr-[6px]'
                    : variant === 'responsive'
                      ? 'mt-[5px]'
                      : 'mt-[16px]'
                }`}
                style={{
                  fontSize: `${
                    variant === 'minimal'
                      ? FontSizes.h5.size
                      : variant === 'responsive'
                        ? FontSizes.b1.size
                        : FontSizes.h5.size
                  }px`,
                  lineHeight: `${
                    variant === 'minimal'
                      ? FontSizes.s1.lineHeight
                      : variant === 'responsive'
                        ? FontSizes.s1.lineHeight
                        : FontSizes.h5.lineHeight
                  }px`,
                  color: Colors.textHighContrast,
                }}
              >
                ${currentPrice.toFixed(2)}
              </p>
            </div>

            {variant !== 'responsive' && (
              <CardButton
                product={{
                  productId: productId, // del API
                  presentationId: presentationId, // del API
                  name: productName,
                  price: lastPrice || currentPrice,
                  discount: discountPercentage,
                  image: typeof imageSrc === 'string' ? imageSrc : imageSrc.src,
                  stock: stock,
                }}
              />
            )}
          </div>
        </div>
      </CardBase>
    </div>
  );
};

export default ProductCard;
