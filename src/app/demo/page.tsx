'use client';
import React from 'react';
import ProductCard from '@/components/Product/ProductCard';
import Image1 from '@/lib/utils/images/Rectangle 1.png';
import Image2 from '@/lib/utils/images/Rectangle 1 (4).png';
// Datos de un solo producto
const singleProduct = {
  id: 1,
  productName: 'Lansoprazol 30mg x 14 Tabletas AAAAA',
  stock: 10,
  currentPrice: 25.99,
  lastPrice: 30.99,
  discountPercentage: 15,
  ribbonText: 'Nueva Oferta',
  imageSrc: Image1,
  label: 'Popular',
};

const Page = () => {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Demo de Product Cards</h1>

      {/* Producto individual */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Producto Individual</h2>
        <div className="flex flex-wrap gap-4">
          <ProductCard
            imageSrc={Image2}
            productName={singleProduct.productName}
            stock={singleProduct.stock}
            currentPrice={singleProduct.currentPrice}
            ribbonText={singleProduct.ribbonText}
            label={singleProduct.label}
            variant="responsive"
          />

          <ProductCard
            imageSrc={Image2}
            productName={singleProduct.productName}
            stock={singleProduct.stock}
            currentPrice={singleProduct.currentPrice}
            ribbonText={singleProduct.ribbonText}
            label={singleProduct.label}
            variant="minimal"
          />

          <ProductCard
            imageSrc={Image2}
            productName={singleProduct.productName}
            stock={singleProduct.stock}
            currentPrice={singleProduct.currentPrice}
            label={singleProduct.label}
            ribbonText="Nuevo!!"
            variant="regular"
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
