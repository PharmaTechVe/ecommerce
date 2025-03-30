'use client';
import { useEffect, useState } from 'react';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ProductCarousel from '@/components/Product/ProductCarousel';
import Footer from '@/components/Footer';
import { api } from '@/lib/sdkConfig';
import { ImageType } from '@/components/Product/CardBase';
import CartOverlay from '@/components/Cart/CartOverlay';

import Banner1 from '@/lib/utils/images/banner-v2.jpg';
import Banner2 from '@/lib/utils/images/banner-v1.jpg';
import Banner3 from '@/lib/utils/images/banner_final.jpg';
import { useAuth } from '@/context/AuthContext';

export type Product = {
  id: number;
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
  price: number;
  presentation: {
    id: string;
    name: string;
    quantity: number;
  };
  product: {
    id: string;
    name: string;
    genericName: string;
    images: ImageResponse[];
  };
}

export default function Home() {
  const { token } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const avatarProps = isLoggedIn
    ? {
        name: 'Juan Pérez',
        imageUrl: '/images/profilePic.jpeg',
        size: 52,
        showStatus: true,
        isOnline: true,
        withDropdown: true,
        dropdownOptions: [{ label: 'Perfil', route: '/profile' }],
      }
    : undefined;

  const navBarProps: NavBarProps = {
    isLoggedIn,
    ...(avatarProps ? { avatarProps } : {}),
    onCartClick: () => setIsCartOpen(true),
  };

  const slides = [
    { id: 1, imageUrl: Banner1 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner3 },
  ];

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.product.getProducts({ page: 1, limit: 20 });

        const backendProducts: Product[] = data.results.map(
          (item: ProductApiResponse, index: number) => ({
            id: index,
            productId: item.product.id,
            presentationId: item.presentation.id,
            productName: `${item.product.genericName} ${item.product.name} ${item.presentation.name}`,
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

  if (loading) {
    return <h1 className="p-4 text-lg">Pharmatech...</h1>;
  }

  return (
    <div>
      {/* Navbar fijado */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-transparent">
        <NavBar {...navBarProps} />
      </div>

      <main className="pt-[124px]">
        <h1 className="text-2xl font-bold text-white">Pharmatech</h1>

        <div className="md:max-w-8xl mx-auto w-full max-w-[75vw] md:p-2">
          <div className="hidden md:block">
            <Carousel slides={slides} />
          </div>

          <div>
            <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
              Productos en Oferta Exclusiva
            </h3>
          </div>

          <div className="mt-8">
            <div className="cursor-pointer">
              <ProductCarousel carouselType="regular" products={products} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {isCartOpen && (
        <CartOverlay
          isOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
