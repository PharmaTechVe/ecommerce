'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Badge from '@/components/Badge';
import Carousel, { Slide } from '@/components/Product/Carousel';
import Dropdown from '@/components/Dropdown';
import CardButton from '@/components/CardButton';
import { StarIcon } from '@heroicons/react/24/solid';
import { Colors, FontSizes } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import BranchAvailability from '@/components/BranchAvailability';
import Footer from '@/components/Footer';
import { ImageType } from '@/components/Product/CardBase';
import CartOverlay from '@/components/Cart/CartOverlay';
import ProductCarousel from '@/components/Product/ProductCarousel';

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

interface ImageResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  url: string;
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

interface PresentationDetailResponse {
  price: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: {
    name: string;
    genericName: string;
    description?: string;
    priority: number;
  };
  presentation: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    description: string;
    quantity: number;
    measurementUnit: string;
  };
}

interface CategoryResponse {
  name: string;
  description: string;
}

interface ResponseGenericProduct {
  id: string;
  name: string;
  genericName: string;
  description?: string;
  manufacturer: {
    name: string;
  };
  categories: CategoryResponse[];
}

interface PresentationItem {
  id: string;
  price: number;
  presentation: {
    id: string;
    name: string;
    description: string;
    quantity: number;
    measurementUnit: string;
  };
}

interface ProductImage {
  id: string;
  url: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const presentationId = params.presentationId as string;
  const [presentation, setPresentation] =
    useState<PresentationDetailResponse | null>(null);
  const [genericProduct, setGenericProduct] =
    useState<ResponseGenericProduct | null>(null);
  const [presentationList, setPresentationList] = useState<PresentationItem[]>(
    [],
  );
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPresentationDetail() {
      try {
        const data: PresentationDetailResponse =
          await api.productPresentation.getByPresentationId(
            productId,
            presentationId,
          );
        setPresentation(data);
      } catch (err) {
        console.error('Error fetching presentation detail:', err);
        setError('Error fetching presentation details.');
      }
    }
    if (presentationId) fetchPresentationDetail();
  }, [presentationId, productId]);

  useEffect(() => {
    async function fetchGenericData() {
      if (presentation) {
        try {
          const productData: ResponseGenericProduct =
            await api.genericProduct.getById(productId);
          setGenericProduct(productData);
          const presList: PresentationItem[] =
            await api.productPresentation.getByProductId(productId);
          setPresentationList(presList);
        } catch (err) {
          console.error('Error fetching generic product data:', err);
          setError('Error fetching product info.');
        }
      }
    }
    fetchGenericData();
  }, [presentation, productId]);

  useEffect(() => {
    async function fetchProductImages() {
      if (genericProduct) {
        try {
          const productImages: ProductImage[] =
            await api.productImage.getByProductId(genericProduct.id);
          if (productImages.length > 0) {
            const slidesMapped: Slide[] = productImages.map((img, index) => ({
              id: index,
              imageUrl: img.url,
            }));
            setSlides(slidesMapped);
          } else {
            setSlides([
              { id: 1, imageUrl: '/images/product-detail.jpg' },
              { id: 2, imageUrl: '/images/product-detail-2.jpg' },
            ]);
          }
        } catch (err) {
          console.error('Error fetching product images:', err);
          setSlides([
            { id: 1, imageUrl: '/images/product-detail.jpg' },
            { id: 2, imageUrl: '/images/product-detail-2.jpg' },
          ]);
        }
      }
    }
    fetchProductImages();
  }, [genericProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const manufacterProductName = genericProduct
          ? genericProduct.manufacturer.name
          : '';

        const data = await api.product.getProducts({
          page: 1,
          limit: 20,
          q: manufacterProductName,
        });

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
  }, [genericProduct]);

  useEffect(() => {
    if (presentation && genericProduct) {
      setLoading(false);
    }
  }, [presentation, genericProduct]);

  if (loading) return <p className="p-4 text-lg">Loading...</p>;
  if (error || !presentation || !genericProduct) {
    return (
      <p className="p-4 text-lg">{error || 'Product detail not found.'}</p>
    );
  }

  const productPresentationId = presentation.id;

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    {
      label: genericProduct.categories[0].name,
      href: `/category/${genericProduct.categories[0]?.name}`,
    },
    {
      label: presentation.presentation.name,
      href: `/product/${productId}/presentation/${presentationId}`,
    },
  ];

  const variantOptionsObjects = presentationList.map((item) => ({
    id: item.presentation.id,
    display: `${genericProduct.genericName} ${item.presentation.name} ${item.presentation.quantity} ${item.presentation.measurementUnit}`,
  }));

  const variantOptions = variantOptionsObjects.map((opt) => opt.display);

  const handlePresentationSelect = (selectedDisplay: string) => {
    const selectedItem = variantOptionsObjects.find(
      (opt) => opt.display === selectedDisplay,
    );
    if (selectedItem) {
      router.push(`/product/${productId}/presentation/${selectedItem.id}`);
    }
  };

  return (
    <div>
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        <NavBar onCartClick={() => setIsCartOpen(true)} />
      </div>
      <main className="mx-auto mt-12 max-w-7xl p-4 pt-[100px] md:mt-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Carousel slides={slides} />
          <div className="flex flex-col space-y-4">
            <div>
              {genericProduct.manufacturer && (
                <Badge variant="filled" color="info" size="medium">
                  {genericProduct.manufacturer.name}
                </Badge>
              )}
            </div>
            <h1
              className="text-3xl"
              style={{
                fontSize: `${FontSizes.h3.size}px`,
                lineHeight: `${FontSizes.h3.lineHeight}px`,
                color: Colors.textMain,
              }}
            >
              {`${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name} ${presentation.presentation.quantity} ${presentation.presentation.measurementUnit} `}
            </h1>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600">
              {presentation.presentation.description}
            </p>
            <div className="flex items-center justify-between">
              <p
                className="text-lg"
                style={{
                  fontSize: `${FontSizes.h5.size}px`,
                  color: Colors.textMain,
                }}
              >
                ${presentation.price.toFixed(2)}
              </p>
              <CardButton
                product={{
                  productId: productId,
                  presentationId: presentationId,
                  name: ` ${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name} ${presentation.presentation.quantity} ${presentation.presentation.measurementUnit} `,
                  price: presentation.price || presentation.price,
                  // discount: discountPercentage,
                  image:
                    slides.length > 0
                      ? slides[0].imageUrl
                      : '/images/product-detail.jpg',
                  stock: presentation.presentation.quantity,
                }}
              />
            </div>
            <Dropdown
              label="Selecciona una presentación"
              items={variantOptions}
              onSelect={handlePresentationSelect}
            />
          </div>
        </div>
        <div className="my-32">
          <BranchAvailability productPresentationId={productPresentationId} />
        </div>
        <div>
          <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
            Productos de la marca {genericProduct.manufacturer.name}
          </h3>
        </div>
        <div className="mt-8">
          <div className="cursor-pointer">
            <ProductCarousel carouselType="regular" products={products} />
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
