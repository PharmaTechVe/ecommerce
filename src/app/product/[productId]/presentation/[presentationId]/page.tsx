'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Badge from '@/components/Badge';
import Carousel, { Slide } from '@/components/Product/Carousel';
import Dropdown from '@/components/Dropdown';
import CardButton from '@/components/CardButton';
import { StarIcon } from '@heroicons/react/24/solid';
import { Colors, FontSizes } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import BranchAvailability from '@/components/BranchAvailability';
import CartOverlay from '@/components/Cart/CartOverlay';

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
/*
interface InventoryResponse {
  stockQuantity: number;
  productPresentation: {
    price: number;
  };
}
  */
interface ProductImage {
  id: string;
  url: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId =
    (params.productId as string) || 'c40116f4-b6cd-4309-89bb-5d8be78d8775';
  const presentationId =
    (params.presentationId as string) || 'ac680d44-85ae-43c2-934b-3ec2b3f4e646';
  const [presentation, setPresentation] =
    useState<PresentationDetailResponse | null>(null);
  const [genericProduct, setGenericProduct] =
    useState<ResponseGenericProduct | null>(null);
  const [presentationList, setPresentationList] = useState<PresentationItem[]>(
    [],
  );
  //const [inventoryData, setInventoryData] = useState<InventoryResponse | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
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
  /*
  useEffect(() => {
    async function fetchInventory() {
      if (presentation) {
        try {
          const invResults: InventoryResponse = await api.inventory.getById(presentationId);
          setInventoryData(invResults);
        } catch (err) {
          console.error('Error fetching inventory data:', err);
          setError('Error fetching inventory data.');
        }
      }
    }
    fetchInventory();
  }, [presentation]);
  */
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

  const navBarProps: NavBarProps = {
    isLoggedIn: true,
    avatarProps: {
      name: 'Juan Pérez',
      imageUrl: '/images/profilePic.jpeg',
      size: 52,
      withDropdown: true,
      dropdownOptions: [
        { label: 'Perfil', route: '/profile' },
        { label: 'Cerrar sesión', route: '/logout' },
      ],
    },
    onCartClick: () => setIsCartOpen(true),
  };

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
        <NavBar {...navBarProps} />
      </div>
      <main className="mx-auto mt-6 max-w-7xl p-4 pt-[100px]">
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
                  name:
                    genericProduct.genericName +
                    genericProduct.name +
                    presentation.presentation.name,
                  price: presentation.price || presentation.price,
                  // discount: discountPercentage,
                  image:
                    slides.length > 0
                      ? slides[0].imageUrl // Usas la primera imagen del arreglo
                      : '/images/product-detail.jpg', // Fallback si no hay imágenes
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
        <BranchAvailability presentationId={productId} />
      </main>
      {isCartOpen && (
        <CartOverlay
          isOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
