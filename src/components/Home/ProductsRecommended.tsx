'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { ProductPresentation } from '@pharmatech/sdk';
import { useEffect, useState } from 'react';
import ProductCarousel from '../Product/ProductCarousel';
import ProductCarouselSkeleton from '../Product/ProductCarouselSkelete';

export default function ProductsRecommended() {
  const { token, user } = useAuth();
  const [recommendedProducts, setRecommendedProducts] = useState<
    ProductPresentation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRecommended = async () => {
      if (!token || !user?.sub) {
        setRecommendedProducts([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await api.product.getRecommendations(token);
        setRecommendedProducts(data.results);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, [token, user]);
  return (
    <>
      {token && user && (
        <>
          <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
            Productos Recomendados para ti
          </h3>
          <div className="mt-8 cursor-pointer">
            {isLoading ? (
              <ProductCarouselSkeleton />
            ) : (
              <ProductCarousel products={recommendedProducts} />
            )}
          </div>
        </>
      )}
    </>
  );
}
