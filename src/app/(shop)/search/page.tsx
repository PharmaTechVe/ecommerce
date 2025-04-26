// src/app/search/page.tsx  (o donde tengas tu SearchPage)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarFilter, { Filters } from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/sdkConfig';
import Loading from '@/app/loading';
import Breadcrumb from '@/components/Breadcrumb';

interface UIProduct {
  id: string;
  productPresentationId: string;
  productId: string;
  presentationId: string;
  productName: string;
  stock: number;
  currentPrice: number;
  imageSrc: string;
  brand: string;
  presentation: string;
  activeIngredient: string;
  categories: string[];
}

interface ProductPaginationRequest {
  page: number;
  limit: number;
  q?: string;
  manufacturerId?: string[];
  categoryId?: string[];
  branchId?: string[];
  presentationId?: string[];
  priceRange?: { min: number; max: number };
}

export default function SearchPage() {
  const params = useSearchParams();
  const query = params?.get('query') ?? '';
  const categoryName = params?.get('category') ?? 'Categorías';

  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<UIProduct[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
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

  interface APIProduct {
    id: string;
    product: {
      id: string;
      name: string;
      manufacturer?: { name: string };
      genericName?: string;
      categories?: { name: string }[];
      images?: { url: string }[];
    };
    presentation: { id: string; name: string; quantity: number };
    price: number;
  }

  const mapToUI = useCallback(
    (results: APIProduct[]): UIProduct[] =>
      results.map((item) => ({
        id: item.id,
        productPresentationId: item.id,
        productId: item.product.id,
        presentationId: `${item.presentation.id}`,
        productName: `${item.product.name} ${item.presentation.name}`,
        stock: item.presentation.quantity,
        currentPrice: item.price,
        imageSrc: item.product.images?.[0]?.url || '',
        brand: item.product.manufacturer?.name || '',
        presentation: item.presentation.name,
        activeIngredient: item.product.genericName || '',
        categories: item.product.categories?.map((c) => c.name) || [],
      })),
    [],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const req: ProductPaginationRequest = { page: 1, limit: 50 };
        if (query.trim()) req.q = query.trim();
        const resp = await api.product.getProducts(req);
        let ui = mapToUI(resp.results);
        if (categoryName !== 'Categorías') {
          ui = ui.filter((p) => p.categories.includes(categoryName));
        }
        setAllProducts(ui);
        setDisplayProducts(ui);
        const prices = ui.map((p) => p.currentPrice);
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setCurrentPriceRange([min, max]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, categoryName, mapToUI]);

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
      setDisplayProducts(mapToUI(resp.results));
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
    setCurrentPriceRange(priceRange);
    setShowMobileFilters(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto mt-10 flex-grow px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: categoryName, href: `/search?category=${categoryName}` },
            { label: query, href: `/search?query=${query}` },
          ]}
        />

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
                initialPriceRange={priceRange}
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
              initialPriceRange={priceRange}
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
                  <ProductCard
                    key={p.id}
                    productPresentationId={p.productPresentationId}
                    productId={p.productId}
                    presentationId={p.presentationId}
                    imageSrc={p.imageSrc}
                    productName={p.productName}
                    stock={p.stock}
                    currentPrice={p.currentPrice}
                    variant="regular"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
