'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarFilter, { Filters } from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/sdkConfig';
import Loading from '@/app/loading';
import { ProductPaginationRequest, ProductPresentation } from '@pharmatech/sdk';

export default function SearchPage() {
  const params = useSearchParams();
  const query = params?.get('query') ?? '';
  const categoryId = params?.get('categoryId') ?? '';

  const [allProducts, setAllProducts] = useState<ProductPresentation[]>([]);
  const [displayProducts, setDisplayProducts] = useState<ProductPresentation[]>(
    [],
  );
  const priceRange = [0, 1000];
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    category: [],
    brand: [],
    presentation: [],
    activeIngredient: [],
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const req: ProductPaginationRequest = { page: 1, limit: 50 };
        if (query.trim()) req.q = query.trim();
        if (categoryId && categoryId !== '1') req.categoryId = [categoryId];
        const data = await api.product.getProducts(req);
        setAllProducts(data.results);
        setDisplayProducts(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, categoryId]);

  const handleApplyFilters = async (
    filters: Filters,
    price: [number, number],
  ) => {
    setCurrentFilters(filters);
    setLoading(true);
    try {
      const req: ProductPaginationRequest = {
        page: 1,
        limit: 50,
        ...(query.trim() && { q: query.trim() }),
        ...(filters.brand.length > 0 && { manufacturerId: filters.brand }),
        ...(filters.category.length > 0 && { categoryId: filters.category }),
        ...(filters.activeIngredient.length > 0 && {
          branchId: filters.activeIngredient,
        }),
        ...(filters.presentation.length > 0 && {
          presentationId: filters.presentation,
        }),
        priceRange: { min: price[0], max: price[1] },
      };
      const resp = await api.product.getProducts(req);
      setDisplayProducts(resp.results);
      setCurrentPriceRange(price);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
    } finally {
      setLoading(false);
      setShowMobileFilters(false);
    }
  };

  const handleClearFilters = () => {
    setCurrentFilters({
      category: [],
      brand: [],
      presentation: [],
      activeIngredient: [],
    });
    setDisplayProducts(allProducts);
    setCurrentPriceRange([priceRange[0], priceRange[1]]);
    setShowMobileFilters(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto mt-10 flex-grow px-4 sm:px-6 lg:px-8">
        {/* Filtros Móvil */}
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
                initialPriceRange={[priceRange[0], priceRange[1]]}
                initialCurrentPriceRange={currentPriceRange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar Desktop */}
          <aside className="hidden md:block md:w-64">
            <SidebarFilter
              initialFilters={currentFilters}
              initialPriceRange={[priceRange[0], priceRange[1]]}
              initialCurrentPriceRange={currentPriceRange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Resultados */}
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
                  Resultados para: <span className="capitalize">{query}</span>
                </h2>
                <span className="text-sm text-gray-600">
                  {displayProducts.length} resultado
                  {displayProducts.length !== 1 && 's'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {displayProducts.map((p) => (
                  <ProductCard key={p.id} product={p} variant="regular" />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
