'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/Navbar';
import SidebarFilter, { Filters } from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import CartOverlay from '@/components/Cart/CartOverlay';
import Footer from '@/components/Footer';
import { api } from '@/lib/sdkConfig';

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
  const query = params.get('query') ?? '';
  const categoryName = params.get('category') ?? 'Categorías';

  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<UIProduct[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    category: null,
    brand: null,
    presentation: null,
    activeIngredient: null,
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
    presentation: {
      id: string;
      name: string;
      quantity: number;
    };
    price: number;
  }

  const mapToUI = useCallback(
    (results: APIProduct[]): UIProduct[] =>
      results.map((item) => ({
        id: item.id,
        productPresentationId: item.id,
        productId: item.product.id,
        presentationId: String(item.presentation.id),
        productName: `${item.product.name} ${item.presentation.name}`,
        stock: item.presentation.quantity,
        currentPrice: item.price,
        imageSrc: item.product.images?.[0]?.url || '',
        brand: item.product.manufacturer?.name || '',
        presentation: item.presentation.name,
        activeIngredient: item.product.genericName || '',
        categories: Array.isArray(item.product.categories)
          ? item.product.categories.map((c) => c.name)
          : [],
      })),
    [],
  );

  useEffect(() => {
    const fetchInitial = async () => {
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
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
          setCurrentPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
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
        ...(filters.brand && { manufacturerId: [filters.brand] }),
        ...(filters.category && { categoryId: [filters.category] }),
        ...(filters.activeIngredient && {
          branchId: [filters.activeIngredient],
        }),
        ...(filters.presentation && { presentationId: [filters.presentation] }),
        priceRange: { min: price[0], max: price[1] },
      };

      const resp = await api.product.getProducts(req);
      let ui = mapToUI(resp.results);

      if (filters.presentation) {
        ui = ui.filter((p) => p.presentationId === filters.presentation);
      }

      setDisplayProducts(ui);
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
      category: null,
      brand: null,
      presentation: null,
      activeIngredient: null,
    });
    setDisplayProducts(allProducts);
    setCurrentPriceRange(priceRange);
    setShowMobileFilters(false);
  };

  if (loading) {
    return <p className="p-4 text-center">Cargando...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50 bg-white">
        <NavBar onCartClick={() => setIsCartOpen(true)} />
      </header>
      {isCartOpen && (
        <CartOverlay isOpen closeCart={() => setIsCartOpen(false)} />
      )}

      <main className="container mx-auto flex-grow px-4 pt-[124px] sm:px-6 lg:px-8">
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
          <div className="hidden w-full flex-shrink-0 md:block md:w-64">
            <SidebarFilter
              initialFilters={currentFilters}
              initialPriceRange={priceRange}
              initialCurrentPriceRange={currentPriceRange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-1">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="mb-4 mt-6 block rounded bg-[#1C2143] px-4 py-2 text-white md:hidden"
            >
              Filtrar
            </button>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl">
                Resultados de búsqueda:{' '}
                <span className="capitalize">{query}</span>
              </h2>
              <span className="text-sm text-gray-600">
                {displayProducts.length} resultado
                {displayProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
