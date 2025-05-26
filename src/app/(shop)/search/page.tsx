'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarFilter, { Filters } from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/sdkConfig';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/app/loading';
import {
  isAPIError,
  ProductPaginationRequest,
  ProductPresentation,
} from '@pharmatech/sdk';

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();

  const query = params?.get('query') || '';
  const categories = params?.get('categoryId')?.split(',') || [''];
  const brands = params?.get('brand')?.split(',') || [];
  const presentations = params?.get('presentation')?.split(',') || [];
  const activeIngredients = params?.get('activeIngredient')?.split(',') || [];
  const min = parseFloat(params?.get('priceMin') || String(0));
  const max = parseFloat(params?.get('priceMax') || String(10000));
  const [displayProducts, setDisplayProducts] = useState<ProductPresentation[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    categories,
    brands,
    presentations,
    activeIngredients,
    query,
    priceMin: min,
    priceMax: max,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const req: ProductPaginationRequest = {
        page: 1,
        limit: 50,
        ...(query.trim() && { q: currentFilters.query?.trim() }),
        ...(categories.length > 0 && {
          categoryId: currentFilters.categories.filter((c) => c != ''),
        }),
        ...(brands.length > 0 && { manufacturerId: currentFilters.brands }),
        ...(activeIngredients.length > 0 && {
          genericProductId: currentFilters.activeIngredients,
        }),
        ...(presentations.length > 0 && {
          presentationId: currentFilters.presentations,
        }),
        ...(currentFilters.priceMin &&
          currentFilters.priceMax && {
            priceRange: {
              min: currentFilters.priceMin,
              max: currentFilters.priceMax,
            },
          }),
      };
      setLoading(true);
      try {
        const products = await api.product.getProducts(req);
        setDisplayProducts(products.results);
      } catch (error) {
        setDisplayProducts([]);
        if (isAPIError(error)) {
          console.error('Error fetching products:', error.message);
        } else {
          console.error('Unexpected error fetching products:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params, currentFilters]);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(query ? [{ label: 'Búsqueda', href: `/search?query=${query}` }] : []),
  ];

  const handleClearFilters = () => {
    setCurrentFilters({
      categories: [],
      brands: [],
      presentations: [],
      activeIngredients: [],
      query: '',
      priceMin: 0,
      priceMax: 10000,
    });
    setShowMobileFilters(false);
    router.push('/search');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto mt-10 flex-grow px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex bg-black/50">
            <div className="w-full max-w-xs overflow-auto bg-white p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="mb-4 w-full text-right font-semibold"
              >
                Cerrar ✕
              </button>
              <SidebarFilter
                initialFilters={currentFilters}
                onClearFilters={handleClearFilters}
                setFilters={setCurrentFilters}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="hidden md:block md:w-64">
            <SidebarFilter
              initialFilters={currentFilters}
              onClearFilters={handleClearFilters}
              setFilters={setCurrentFilters}
            />
          </aside>

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loading />
            </div>
          ) : (
            <section className="mb-12 flex-1">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="mb-4 mt-6 block rounded bg-[#1C2143] px-4 py-2 text-white md:hidden"
              >
                Filtrar
              </button>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl">
                  Resultados para:{' '}
                  <span className="capitalize">
                    {query ? query : 'Todos los productos'}
                  </span>
                </h2>
                <span className="text-sm text-gray-600">
                  {displayProducts.length} resultado
                  {displayProducts.length !== 1 && 's'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {displayProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
