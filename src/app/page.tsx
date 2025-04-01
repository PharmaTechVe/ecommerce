'use client';
import { useEffect, useRef, useState } from 'react';
import NavBar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ProductCarousel from '@/components/Product/ProductCarousel';
import Footer from '@/components/Footer';
import CartOverlay from '@/components/Cart/CartOverlay';
import { api } from '@/lib/sdkConfig';
import { ImageType } from '@/components/Product/CardBase';
import Banner1 from '@/lib/utils/images/banner-v2.jpg';
import Banner2 from '@/lib/utils/images/banner-v1.jpg';
import Banner3 from '@/lib/utils/images/banner_final.jpg';
import { jwtDecode } from 'jwt-decode';
import { PharmaTech } from '@pharmatech/sdk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnterCodeFormModal from '@/components/EmailValidation';

interface JwtPayload {
  sub: string;
}

export type Product = {
  id: number;
  productPresentationId: string;
  productId: string;
  presentationId: string;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  ribbonText?: string;
  imageSrc: ImageType;
  label?: string;
};

interface ImageResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  url: string;
}

interface ProductApiResponse {
  id: string;
  price: number;
  presentation: {
    id: string;
    name: string;
    quantity: number;
    measurementUnit: string;
  };
  product: {
    id: string;
    name: string;
    genericName: string;
    images: ImageResponse[];
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [jwt, setJwt] = useState('');
  const [userId, setUserId] = useState('');

  const toastDisplayed = useRef(false);
  const toastId = useRef<number | string | null>(null);
  const navBarProps = {
    onCartClick: () => setIsCartOpen(true),
  };

  const slides = [
    { id: 1, imageUrl: Banner1 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner3 },
  ];

  useEffect(() => {
    const token =
      typeof window !== 'undefined' &&
      (localStorage.getItem('pharmatechToken') ||
        sessionStorage.getItem('pharmatechToken'));

    const checkUserValidation = async () => {
      if (!token) return;

      setJwt(token);

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);

        const pharmaTech = PharmaTech.getInstance(true);
        const user = await pharmaTech.user.getProfile(decoded.sub, token);

        if (!user.isValidated && !toastDisplayed.current) {
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
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.product.getProducts({ page: 1, limit: 20 });

        const backendProducts: Product[] = data.results.map(
          (item: ProductApiResponse, index: number) => ({
            id: index,
            productPresentationId: item.id,
            productId: item.product.id,
            presentationId: item.presentation.id,
            productName: ` ${item.product.name} ${item.presentation.name} ${item.presentation.quantity} ${item.presentation.measurementUnit} `,
            stock: item.presentation.quantity,
            currentPrice: item.price,
            imageSrc:
              Array.isArray(item.product.images) &&
              item.product.images.length > 0
                ? item.product.images[0].url
                : '',
          }),
        );
        setProducts(backendProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h1 className="p-4 text-lg">Pharmatech...</h1>;

  return (
    <div>
      {/* Navbar */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-transparent">
        <NavBar {...navBarProps} />
      </div>

      <main className="pt-[124px]">
        <h1 className="text-2xl font-bold text-white">Pharmatech</h1>

        <div className="md:max-w-8xl mx-auto w-full max-w-[75vw] md:p-2">
          <Carousel slides={slides} />

          <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
            Productos en Oferta Exclusiva
          </h3>

          <div className="mt-8">
            <div className="cursor-pointer">
              <ProductCarousel carouselType="regular" products={products} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <EnterCodeFormModal
        show={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        userId={userId}
        jwt={jwt}
      />

      <ToastContainer />

      {isCartOpen && (
        <CartOverlay
          isOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
