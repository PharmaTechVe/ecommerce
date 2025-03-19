'use client';

import { useEffect, useState, useMemo } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ProductSlider from '@/components/Product/ProductSlider';
import Footer from '@/components/Footer';
import { Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import type { ImageType } from '@/components/Product/CardBase';

import Image1 from '@/lib/utils/images/product_2.webp';
import Image2 from '@/lib/utils/images/product_4.webp';
import Image4 from '@/lib/utils/images/product_5 (1).png';

import Banner1 from '@/lib/utils/images/banner-v2.jpg';
import Banner2 from '@/lib/utils/images/banner-v1.jpg';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    { id: 1, imageUrl: Banner1 },
    { id: 2, imageUrl: Banner2 },
    { id: 3, imageUrl: Banner3 },
  ];

  // Memoriza las imágenes y productos extra para evitar recreación en cada render
  const productImages: ImageType[] = useMemo(
    () => [Image1, Image2, Image4],
    [],
  );
  const extraProducts: Product[] = useMemo(
    () => [
      {
        id: 100,
        productName: 'Ibuprofeno 200mg',
        stock: 50,
        currentPrice: 3.99,
        imageSrc: Image4,
      },
      {
        id: 101,
        productName: 'Acetaminofén 50mg',
        stock: 100,
        currentPrice: 2.49,
        imageSrc: Image2,
      },
      {
        id: 102,
        productName: 'Omeprazol 200mg',
        stock: 75,
        currentPrice: 5.99,
        imageSrc: Image1,
      },
    ],
    [],
  );

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
  }, [productImages, extraProducts]);

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
        <div className="md:max-w-8xl mx-auto w-full max-w-[75vw] md:p-2">
          <div className="hidden md:block">
            <Carousel slides={slides} />
          </div>

          {/* Sección: Productos en Oferta Exclusiva */}
          <div className="mt-8 flex flex-col pt-4 md:flex-row md:items-center md:justify-between">
            <h3 className="pt-4 text-[32px] text-[#1C2143]">
              Productos en Oferta Exclusiva
            </h3>
            <button
              className={`flex items-center text-sm text-[${Colors.disabled}] hover:underline`}
            >
              Ver más productos
              <ChevronRightIcon className="mr-1 h-5 w-5" />
            </button>
          </div>
          <div className="mt-8">
            <ProductSlider
              carouselType="regular"
              products={products}
              itemsPerSection={3}
            />
          </div>

          {/* Sección: Categoría Medicamentos */}
          <div className="mt-8 flex flex-col pt-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-[32px] text-[#1C2143]">
              Categoría Medicamentos
            </h3>
            <button
              className={`flex items-center text-sm text-[${Colors.disabled}] hover:underline`}
            >
              Ver más productos
              <ChevronRightIcon className="mr-1 h-5 w-5" />
            </button>
          </div>
          <ProductSlider
            carouselType="regular"
            products={products}
            itemsPerSection={4}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
