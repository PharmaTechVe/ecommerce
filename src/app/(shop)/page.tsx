'use client';
import { useEffect, useRef, useState } from 'react';
import Carousel from '@/components/Carousel';
import ProductCarousel from '@/components/Product/ProductCarousel';
import { api } from '@/lib/sdkConfig';
import Banner1 from '@/lib/utils/images/banner-v2.jpg';
import Banner2 from '@/lib/utils/images/banner-v1.jpg';
import Banner3 from '@/lib/utils/images/banner_final.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailImg from '@/lib/utils/images/Antibioticos.png';
import { ExtendedProduct } from '@/lib/types/ExtendedProduct';

import type {
  Category as SDKCategory,
  ProductPresentation,
} from '@pharmatech/sdk';

import CategoryCarousel from '@/components/CategoryCarousel';
import EnterCodeFormModal from '@/components/EmailValidation';
import { useAuth } from '@/context/AuthContext';

type CategoryForCarousel = SDKCategory & {
  id: string;
  imageUrl?: string;
};

export default function Home() {
  const { token, user } = useAuth();
  const toastDisplayed = useRef(false);
  const toastId = useRef<number | string | null>(null);

  const [products, setProducts] = useState<ProductPresentation[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    ProductPresentation[]
  >([]);
  const [categories, setCategories] = useState<CategoryForCarousel[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const slides = [
    { id: 1, imageUrl: Banner1 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner3 },
  ];

  useEffect(() => {
    const checkUserValidation = async () => {
      if (!token || !user?.sub) return;
      try {
        const profile = await api.user.getProfile(user.sub, token);
        if (!profile.isValidated && !toastDisplayed.current) {
          toastId.current = toast.info(
            <div>
              Verifica tu correo electrónico.{' '}
              <button
                onClick={() => {
                  toast.dismiss(toastId.current!);
                  setShowEmailModal(true);
                }}
                className="text-blue-300 underline hover:text-blue-500"
              >
                Verificar código
              </button>
            </div>,
            {
              autoClose: false,
              closeOnClick: false,
              draggable: true,
              position: 'top-right',
            },
          );
          toastDisplayed.current = true;
        }
      } catch (err) {
        console.error('Error verificando validación del usuario:', err);
      }
    };
    checkUserValidation();
  }, [token, user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.product.getProducts({ page: 1, limit: 20 });
        setProducts(data.results);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await api.category.findAll({ page: 1, limit: 20 });
        const formatted: CategoryForCarousel[] = resp.results.map((c) => ({
          ...c,
          id: String(c.id),
          imageUrl: ProductDetailImg.src,
        }));
        setCategories(formatted);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!token || !user?.sub) return;
      try {
        const data = await api.product.getRecommendations(token);
        setRecommendedProducts(data.results);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
      }
    };
    fetchRecommended();
  }, [token, user]);

  return (
    <div className="px-4">
      <h1 className="mb-12 text-2xl font-bold text-white">Pharmatech</h1>

      {/* Carrusel principal */}
      <div className="md:max-w-8xl mx-auto mb-12 max-w-[75vw] md:p-2">
        <Carousel slides={slides} />

        {/* Sección ofertas */}
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
          Productos en Oferta Exclusiva
        </h3>
        <div className="mt-8 cursor-pointer">
          <ProductCarousel
            products={products as unknown as ExtendedProduct[]}
          />
        </div>

        {/* Sección recomendados */}
        {recommendedProducts.length > 0 && (
          <>
            <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
              Productos Recomendados para ti
            </h3>
            <div className="mt-8 cursor-pointer">
              <ProductCarousel
                products={recommendedProducts as unknown as ExtendedProduct[]}
              />
            </div>
          </>
        )}

        {/* Sección categorías */}
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">Categorías</h3>
        <div className="mt-8 cursor-pointer">
          <CategoryCarousel categories={categories} />
        </div>
      </div>

      {/* Modal de verificación de email */}
      {token && user?.sub && (
        <EnterCodeFormModal
          show={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          userId={user.sub}
          jwt={token}
        />
      )}
    </div>
  );
}
