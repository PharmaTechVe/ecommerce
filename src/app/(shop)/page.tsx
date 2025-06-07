import Carousel from '@/components/Carousel';
import 'react-toastify/dist/ReactToastify.css';
import ProductCarouselSkeleton from '@/components/Product/ProductCarouselSkelete';
import EmailConfirmation from '@/components/Home/EmailConfirmation';
import { Suspense } from 'react';
import ProductsRecommended from '@/components/Home/ProductsRecommended';
import ProductsOffer from '@/components/Home/ProductsOffer';
import Categories from '@/components/Home/Categories';
import NearestBranch from '@/components/Home/NearestBranch';

export default async function Home() {
  const slides = [
    { id: 1, imageUrl: '/images/banner/1.jpg' },
    { id: 2, imageUrl: '/images/banner/2.jpg' },
    { id: 3, imageUrl: '/images/banner/3.jpg' },
  ];

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold text-white">Pharmatech</h1>

      {/* Carrusel principal */}
      <div className="md:max-w-8xl mx-auto mb-12 max-w-[75vw] md:p-2">
        <Carousel slides={slides} />

        {/* Sección ofertas */}
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
          Productos en Oferta Exclusiva
        </h3>
        <Suspense fallback={<ProductCarouselSkeleton />}>
          <ProductsOffer withPromo={true} />
        </Suspense>

        {/* Sección recomendados */}
        <ProductsRecommended />

        {/* Sección ofertas */}
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
          Los mejores productos para ti
        </h3>
        <Suspense fallback={<ProductCarouselSkeleton />}>
          <ProductsOffer />
        </Suspense>

        {/* Sección categorías */}
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">Categorías</h3>
        <Suspense fallback={<ProductCarouselSkeleton />}>
          <Categories />
        </Suspense>

        <NearestBranch />
      </div>

      {/* Modal de verificación de email */}
      <EmailConfirmation />
    </div>
  );
}
