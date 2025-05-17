'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarFilter, { Filters } from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/sdkConfig';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/app/loading';
import { ProductPaginationRequest, ProductPresentation } from '@pharmatech/sdk';
import { ExtendedProduct } from '@/lib/types/ExtendedProduct';

interface CategoryOption {
  id: string;
  name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params?.get('query') || '';
  const categoryId = params?.get('categoryId') || '';

  const [customSearch, setCustomSearch] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<ProductPresentation[]>([]);
  const [displayProducts, setDisplayProducts] = useState<ProductPresentation[]>(
    [],
  );
  const priceRange = useMemo<[number, number]>(() => [0, 1000], []);
  const [currentPriceRange, setCurrentPriceRange] =
    useState<[number, number]>(priceRange);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [categoriesList, setCategoriesList] = useState<CategoryOption[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    category: [],
    brand: [],
    presentation: [],
    activeIngredient: [],
  });

  const [initialCategoryName, setInitialCategoryName] = useState<string>('');

  useEffect(() => {
    api.category
      .findAll({ page: 1, limit: 10 })
      .then((resp) =>
        setCategoriesList(
          resp.results.map((c) => ({ id: c.id, name: c.name })),
        ),
      )
      .catch((err) => console.error('Error cargando categorías:', err));
  }, [params, priceRange, query]);

  useEffect(() => {
    if (categoryId && categoriesList.length && !initialCategoryName) {
      const found = categoriesList.find((c) => c.id === categoryId);
      if (found) setInitialCategoryName(found.name);
    }
  }, [categoryId, categoriesList, initialCategoryName]);

  const selectedCategoryNames =
    currentFilters.category.length > 0
      ? (currentFilters.category
          .map((id) => categoriesList.find((c) => c.id === id)?.name)
          .filter(Boolean) as string[])
      : initialCategoryName
        ? [initialCategoryName]
        : [];

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(initialCategoryName ? [{ label: initialCategoryName }] : []),
    ...(customSearch
      ? [
          {
            label: 'Búsqueda personalizada',
            href: `/search?${lastSearchQuery}`,
          },
        ]
      : query
        ? [{ label: query, href: `/search?query=${query}` }]
        : []),
  ];

  const handleApplyFilters = async (
    filters: Filters,
    price: [number, number],
  ) => {
    setCurrentFilters(filters);
    setCurrentPriceRange(price);
    setCustomSearch(true);
    setLoading(true);

    const newParams = new URLSearchParams();
    if (filters.category.length)
      newParams.set('categoryId', filters.category.join(','));
    if (filters.brand.length) newParams.set('brand', filters.brand.join(','));
    if (filters.presentation.length)
      newParams.set('presentation', filters.presentation.join(','));
    if (filters.activeIngredient.length)
      newParams.set('activeIngredient', filters.activeIngredient.join(','));
    newParams.set('priceMin', String(price[0]));
    newParams.set('priceMax', String(price[1]));

    const paramString = newParams.toString();
    setLastSearchQuery(paramString);
    await router.replace(`/search?${paramString}`);

    const req: ProductPaginationRequest = {
      page: 1,
      limit: 50,
      ...(query.trim() && { q: query.trim() }),
      ...(filters.brand.length > 0 && { manufacturerId: filters.brand }),
      ...(filters.category.length > 0 && { categoryId: filters.category }),
      ...(filters.activeIngredient.length > 0 && {
        genericProductId: filters.activeIngredient,
      }),
      ...(filters.presentation.length > 0 && {
        presentationId: filters.presentation,
      }),
      priceRange: { min: price[0], max: price[1] },
    };

    try {
      const resp = await api.product.getProducts(req);
      setDisplayProducts(resp.results);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
    } finally {
      setLoading(false);
      setShowMobileFilters(false);
    }
  };

  useEffect(() => {
    const rawCat = params?.get('categoryId') || '';
    const cat = rawCat ? rawCat.split(',') : [];
    const brand = params?.get('brand')?.split(',') || [];
    const pres = params?.get('presentation')?.split(',') || [];
    const act = params?.get('activeIngredient')?.split(',') || [];
    const min = parseFloat(params?.get('priceMin') || String(priceRange[0]));
    const max = parseFloat(params?.get('priceMax') || String(priceRange[1]));
    const hasFilters =
      cat.length > 0 ||
      brand.length > 0 ||
      pres.length > 0 ||
      act.length > 0 ||
      params?.get('priceMin') != null;

    if (hasFilters) {
      const filters: Filters = {
        category: cat,
        brand,
        presentation: pres,
        activeIngredient: act,
      };
      setLastSearchQuery(params ? params.toString() : '');

      const req: ProductPaginationRequest = {
        page: 1,
        limit: 50,
        ...(query.trim() && { q: query.trim() }),
        ...(cat.length > 0 && { categoryId: cat }),
        ...(brand.length > 0 && { manufacturerId: brand }),
        ...(act.length > 0 && { genericProductId: act }),
        ...(pres.length > 0 && { presentationId: pres }),
        priceRange: { min, max },
      };
      api.product
        .getProducts(req)
        .then((data) => {
          setDisplayProducts(data.results);
          setCurrentFilters(filters);
          setCurrentPriceRange([min, max]);
          setCustomSearch(true);
        })
        .catch((err) =>
          console.error('Error cargando con filtros al montar:', err),
        )
        .finally(() => setLoading(false));
    }
  }, [params, priceRange, query]);

  useEffect(() => {
    if (!customSearch) {
      setLoading(true);
      const req: ProductPaginationRequest = { page: 1, limit: 50 };
      if (query.trim()) req.q = query.trim();
      if (categoryId) req.categoryId = [categoryId];

      api.product
        .getProducts(req)
        .then((data) => {
          setAllProducts(data.results);
          setDisplayProducts(data.results);
        })
        .catch((err) => console.error('Error cargando productos:', err))
        .finally(() => setLoading(false));
    }
  }, [query, categoryId, customSearch]);

  const handleClearFilters = () => {
    setCurrentFilters({
      category: [],
      brand: [],
      presentation: [],
      activeIngredient: [],
    });
    setDisplayProducts(allProducts);
    setCurrentPriceRange(priceRange);
    setCustomSearch(false);
    setShowMobileFilters(false);
    router.replace('/search');
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
                initialPriceRange={priceRange}
                initialCurrentPriceRange={currentPriceRange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="hidden md:block md:w-64">
            <SidebarFilter
              initialFilters={currentFilters}
              initialPriceRange={priceRange}
              initialCurrentPriceRange={currentPriceRange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
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
                    {selectedCategoryNames.length > 0
                      ? selectedCategoryNames.join(', ')
                      : query || 'Todos los productos'}
                  </span>
                </h2>
                <span className="text-sm text-gray-600">
                  {displayProducts.length} resultado
                  {displayProducts.length !== 1 && 's'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {displayProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p as unknown as ExtendedProduct}
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
