'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Badge from '@/components/Badge';
import Carousel, { Slide } from '@/components/Product/Carousel';
import Dropdown from '@/components/Dropdown';
import CardButton from '@/components/CardButton';
import ProductBranch from '@/components/Product/ProductBranch';
import ProductCarousel from '@/components/Product/ProductCarousel';
import { StarIcon } from '@heroicons/react/24/solid';
import { Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import {
  ProductPresentationDetailResponse,
  GenericProductResponse,
  ProductPresentationResponse,
  ProductPresentation,
} from '@pharmatech/sdk';
import Loading from '@/app/loading';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId =
    typeof params?.productId === 'string' ? params.productId : '';
  const presentationId =
    typeof params?.presentationId === 'string' ? params.presentationId : '';

  const [presentation, setPresentation] =
    useState<ProductPresentationDetailResponse | null>(null);
  const [genericProduct, setGenericProduct] =
    useState<GenericProductResponse | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [products, setProducts] = useState<ProductPresentation[]>([]);
  const [presentationList, setPresentationList] = useState<
    ProductPresentationResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minWaitDone, setMinWaitDone] = useState(false);

  useEffect(() => {
    const fetchPresentationDetail = async () => {
      try {
        const data = await api.productPresentation.getByPresentationId(
          productId,
          presentationId,
        );
        setPresentation(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching presentation details');
      }
    };
    if (presentationId) fetchPresentationDetail();
  }, [productId, presentationId]);

  useEffect(() => {
    const fetchGenericData = async () => {
      if (!presentation) return;
      try {
        const data = await api.genericProduct.getById(productId);
        setGenericProduct(data);
        const list = await api.productPresentation.getByProductId(productId);
        setPresentationList(list);
      } catch (err) {
        console.error(err);
        setError('Error fetching product info');
      }
    };
    fetchGenericData();
  }, [presentation, productId]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!genericProduct) return;
      try {
        const images = await api.productImage.getByProductId(genericProduct.id);
        if (images.length) {
          const mapped = images.map((img, i) => ({ id: i, imageUrl: img.url }));
          setSlides(mapped);
        } else {
          setSlides([
            { id: 1, imageUrl: '/images/product-detail.jpg' },
            { id: 2, imageUrl: '/images/product-detail-2.jpg' },
          ]);
        }
      } catch (err) {
        console.error(err);
        setSlides([
          { id: 1, imageUrl: '/images/product-detail.jpg' },
          { id: 2, imageUrl: '/images/product-detail-2.jpg' },
        ]);
      }
    };
    fetchImages();
  }, [genericProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const manufacturerId = genericProduct?.manufacturer.id;
        const data = await api.product.getProducts({
          page: 1,
          limit: 20,
          manufacturerId: manufacturerId ? [manufacturerId] : undefined,
        });
        setProducts(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (genericProduct) fetchProducts();
  }, [genericProduct]);

  useEffect(() => {
    const timer = setTimeout(() => setMinWaitDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minWaitDone && (!presentation || !genericProduct)) {
      const timer = setTimeout(() => router.push('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [minWaitDone, presentation, genericProduct, router]);

  if (loading) return <Loading />;
  if (!presentation || !genericProduct) {
    return (
      <div className="p-4 text-lg">
        {error || 'Producto no encontrado. Redirigiendo al inicio...'}
      </div>
    );
  }
  const productPresentationId = presentation.id;
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    {
      label: genericProduct.categories?.[0]?.name ?? 'Categoría',
      href: `/category/${genericProduct.categories?.[0]?.name}`,
    },
    {
      label: presentation.presentation.name,
      href: `/product/${productId}/presentation/${presentationId}`,
    },
  ];

  const variantOptions = presentationList.map((item) => ({
    id: item.presentation.id,
    display: `${genericProduct.genericName} ${item.presentation.name} ${item.presentation.quantity} ${item.presentation.measurementUnit}`,
  }));

  const handlePresentationSelect = (display: string) => {
    const found = variantOptions.find((v) => v.display === display);
    if (found) router.push(`/product/${productId}/presentation/${found.id}`);
  };

  return (
    <>
      <main className="mx-auto mb-12 max-w-7xl p-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Carousel slides={slides} />
          <div className="flex flex-col space-y-4">
            <div>
              <Badge variant="filled" color="info" size="medium">
                {genericProduct.manufacturer.name}
              </Badge>
            </div>
            <h1 className="text-3xl" style={{ color: Colors.textMain }}>
              {`${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name} ${presentation.presentation.quantity} ${presentation.presentation.measurementUnit}`}
            </h1>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600">
              {presentation.presentation.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-900">
                ${presentation.price.toFixed(2)}
              </p>
              <CardButton
                product={{
                  productPresentationId,
                  name: `${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name}`,
                  price: presentation.price,
                  stock: presentation.stock || 0,
                  image: slides?.[0]?.imageUrl ?? '',
                }}
              />
            </div>
            <Dropdown
              label="Selecciona una presentación"
              items={variantOptions.map((v) => v.display)}
              onSelect={handlePresentationSelect}
            />
          </div>
        </div>

        <div className="my-10">
          <ProductBranch productPresentationId={presentation.id} />
        </div>

        <div className="mt-3">
          <h3 className="mb-6 text-2xl font-semibold text-[#1C2143]">
            Productos de la marca {genericProduct.manufacturer.name}
          </h3>
          <ProductCarousel carouselType="regular" products={products} />
        </div>
      </main>
    </>
  );
}
