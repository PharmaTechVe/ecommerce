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
import { Category } from '@pharmatech/sdk'; // Adjust the import path if necessary
import CategoryCarousel from '@/components/CategoryCarousel';
import EnterCodeFormModal from '@/components/EmailValidation';
import { useAuth } from '@/context/AuthContext';
import { ProductPresentation } from '@pharmatech/sdk';

export default function Home() {
  const [products, setProducts] = useState<ProductPresentation[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    ProductPresentation[]
  >([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { token, user } = useAuth();
  const toastDisplayed = useRef(false);
  const toastId = useRef<number | string | null>(null);

  const slides = [
    { id: 1, imageUrl: Banner1 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner3 },
  ];

  useEffect(() => {
    const checkUserValidation = async () => {
      if (!token || !user?.sub) return;

      try {
        const userProfile = await api.user.getProfile(user.sub, token);

        if (!userProfile.isValidated && !toastDisplayed.current) {
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
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = async () => {
    try {
      const categories = await api.category.findAll({ page: 1, limit: 20 });
      setCategories(categories.results);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token || !user?.sub) return;
      try {
        const data = await api.product.getProducts({ page: 1, limit: 10 });
        setRecommendedProducts(data.results);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [token, user]);

  return (
    <div>
      <h1 className="mb-12 text-2xl font-bold text-white">Pharmatech</h1>
      <div className="md:max-w-8xl mx-auto mb-12 w-full max-w-[75vw] md:p-2">
        {' '}
        <Carousel slides={slides} />
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">Categorias</h3>
        <div className="mt-8">
          <div className="cursor-pointer">
            <CategoryCarousel categories={categories} />
          </div>
        </div>
        <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
          Productos en Oferta Exclusiva
        </h3>
        <div className="mt-8">
          <div className="cursor-pointer">
            <ProductCarousel carouselType="regular" products={products} />
          </div>
        </div>
        {recommendedProducts && recommendedProducts.length > 0 && (
          <>
            <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
              Productos Recomendados para ti
            </h3>
            <div className="mt-8">
              <div className="cursor-pointer">
                <ProductCarousel
                  carouselType="regular"
                  products={recommendedProducts}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal para validar email */}
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
