'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
  ProductPaginationRequest,
} from '@pharmatech/sdk';
import Loading from '@/app/loading';
import ProductNotFound from '@/components/Product/NotFound';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Detect if we came from a filtered search
  const queryString = searchParams?.toString() || '';
  const isCustomSearch = queryString.length > 0;

  const productId = String(params?.productId || '');
  const presentationId = String(params?.presentationId || '');

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

  // 1) Load presentation detail
  useEffect(() => {
    if (!presentationId) return;
    api.productPresentation
      .getByPresentationId(productId, presentationId)
      .then((data) => setPresentation(data))
      .catch((err) => console.error(err));
  }, [productId, presentationId]);

  // 2) Load generic product info & variants
  useEffect(() => {
    if (!presentation) return;
    api.genericProduct
      .getById(productId)
      .then((data) => {
        setGenericProduct(data);
        return api.productPresentation.getByProductId(productId);
      })
      .then((list) => setPresentationList(list))
      .catch((err) => console.error(err));
  }, [presentation, productId]);

  // 3) Load images
  useEffect(() => {
    if (!genericProduct) return;
    api.productImage
      .getByProductId(genericProduct.id)
      .then((imgs) => {
        if (imgs.length) {
          setSlides(imgs.map((img, i) => ({ id: i, imageUrl: img.url })));
        } else {
          setSlides([
            { id: 1, imageUrl: '/images/product-detail.jpg' },
            { id: 2, imageUrl: '/images/product-detail-2.jpg' },
          ]);
        }
      })
      .catch(() =>
        setSlides([
          { id: 1, imageUrl: '/images/product-detail.jpg' },
          { id: 2, imageUrl: '/images/product-detail-2.jpg' },
        ]),
      );
  }, [genericProduct]);

  // 4) Fetch related products
  useEffect(() => {
    if (!genericProduct) return;
    const req: ProductPaginationRequest = {
      page: 1,
      limit: 20,
      ...(genericProduct.manufacturer.id && {
        manufacturerId: [genericProduct.manufacturer.id],
      }),
    };
    api.product
      .getProducts(req)
      .then((res) => setProducts(res.results))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [genericProduct]);

  if (loading) return <Loading />;
  if (!presentation || !genericProduct) return <ProductNotFound />;

  // Breadcrumb con acción de "volver" si es búsqueda personalizada
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    isCustomSearch
      ? { label: 'Búsqueda personalizada', onClick: () => router.back() }
      : {
          label: genericProduct.categories?.[0]?.name ?? 'Categoría',
          href: `/search?category=${genericProduct.categories?.[0]?.name}`,
        },
    { label: presentation.presentation.name },
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
                productPresentationId: presentation.id,
                name: `${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name}`,
                price: presentation.price,
                stock: presentation.stock || 0,
                image: slides[0]?.imageUrl || '',
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
  );
}
