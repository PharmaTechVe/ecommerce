'use client';
import { useEffect, useState } from 'react';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ProductCarousel from '@/components/Product/ProductCarousel';
import Footer from '@/components/Footer';
import { api } from '@/lib/sdkConfig';
import { ImageType } from '@/components/Product/CardBase';

import Image1 from '@/lib/utils/images/product_2.webp';
import Image2 from '@/lib/utils/images/product_4.webp';
import Image3 from '@/lib/utils/images/Rectangle 1 (4).png';
import Image4 from '@/lib/utils/images/product_5 (1).png';

import Banner1 from '@/lib/utils/images/v3.png';
import Banner2 from '@/lib/utils/images/banner_quality_3__figma_.png';
import Banner3 from '@/lib/utils/images/banner_final.jpg';

export type Product = {
  id: number;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  ribbonText?: string;
  imageSrc: ImageType;
  label?: string;
};

interface ProductApiResponse {
  price: number;
  presentation: {
    name: string;
    quantity: number;
  };
  product: {
    name: string;
  };
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const avatarProps = isLoggedIn
    ? {
        name: 'Juan Pérez',
        imageUrl: '/images/profilePic.jpeg',
        size: 52,
        showStatus: true,
        isOnline: true,
        withDropdown: true,
        dropdownOptions: [
          { label: 'Perfil', route: '/profile' },
          { label: 'Cerrar sesión', route: '/login' },
        ],
      }
    : undefined;

  const navBarProps: NavBarProps = {
    isLoggedIn,
    ...(avatarProps ? { avatarProps } : {}),
  };

  const slides = [
    { id: 1, imageUrl: Banner2 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner1 },
    { id: 4, imageUrl: Banner3 },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const productImages: ImageType[] = [Image1, Image2, Image3, Image4];

  const extraProducts: Product[] = [
    {
      id: 100,
      productName: 'Ibuprofeno 200mg',
      stock: 50,
      currentPrice: 3.99,
      imageSrc: Image4,
    },
    {
      id: 101,
      productName: 'Paracetamol 500mg',
      stock: 100,
      currentPrice: 2.49,
      imageSrc: Image4,
    },
    {
      id: 102,
      productName: 'Omeprazol 20mg',
      stock: 75,
      currentPrice: 5.99,
      imageSrc: Image1,
    },
  ];

  useEffect(() => {
    const userSession = sessionStorage.getItem('pharmatechToken');
    setIsLoggedIn(!!userSession);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.product.getProducts({ page: 1, limit: 20 });

        const backendProducts: Product[] = data.results.map(
          (item: ProductApiResponse, index: number) => ({
            id: index,
            productName: `${item.product.name} ${item.presentation.name}`,
            stock: item.presentation.quantity,
            currentPrice: item.price,
            imageSrc: productImages[index % productImages.length],
          }),
        );

        const allProducts =
          backendProducts.length >= 6
            ? backendProducts
            : [
                ...backendProducts,
                ...extraProducts.slice(0, 6 - backendProducts.length),
              ];

        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(extraProducts);
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
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        <NavBar {...navBarProps} />
      </div>

      <main className="p-4 pt-[124px]">
        <h1 className="text-2xl font-bold">Pharmatech</h1>

        <div className="mx-auto w-full max-w-[95vw] p-2 md:max-w-6xl md:p-4">
          <div className="hidden md:block">
            <Carousel slides={slides} />
          </div>

          <div>
            <h3 className="pt-4 text-[32px] text-[#1C2143]">
              Productos en Oferta Exclusiva
            </h3>
          </div>

          <div className="mt-8">
            <ProductCarousel carouselType="regular" products={products} />

            <div>
              <h3 className="text-[32px] text-[#1C2143]">
                Categoría Medicamentos
              </h3>
            </div>

            <ProductCarousel carouselType="large" products={products} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
