// app/search/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/Navbar';
import SidebarFilter from '@/components/SidebarFilter';
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

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('query') ?? '';
  const category = params.get('category') ?? 'Categorías';

  const [products, setProducts] = useState<UIProduct[]>([]);
  const [filtered, setFiltered] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    brands: '',
    presentations: '',
    activeIngredients: '',
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1️⃣ Fetch + prefiltrado por query & categoría de URL
  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setFiltered([]);

    const params: { page: number; limit: number; q?: string } = {
      page: 1,
      limit: 50,
    };
    if (query.trim()) params.q = query.trim();

    api.product
      .getProducts(params)
      .then(({ results }) => {
        const ui: UIProduct[] = results.map((item) => ({
          id: item.id,
          productPresentationId: item.id,
          productId: item.product.id,
          presentationId: item.presentation.id,
          productName: `${item.product.name} ${item.presentation.name}`,
          stock: item.presentation.quantity,
          currentPrice: item.price,
          imageSrc: item.product.images?.[0]?.url || '',
          brand:
            (item.product as { manufacturer?: { name: string } }).manufacturer
              ?.name || '',
          presentation: item.presentation.name,
          activeIngredient:
            (item.product as { genericName?: string }).genericName || '',
          categories: Array.isArray(item.product.categories)
            ? item.product.categories.map((c: { name: string }) => c.name)
            : [],
        }));

        const preFiltered =
          category !== 'Categorías'
            ? ui.filter((p) => p.categories.includes(category))
            : ui;

        setProducts(preFiltered);
        setFiltered(preFiltered);

        const prices = preFiltered.map((x) => x.currentPrice);
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setCurrentPriceRange([min, max]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, category]);

  // 2️⃣ Aplicar filtros adicionales (marca, presentación, principio activo, precio)
  useEffect(() => {
    setFiltered(
      products.filter((p) => {
        if (activeFilters.brands && p.brand !== activeFilters.brands)
          return false;
        if (
          activeFilters.presentations &&
          p.presentation !== activeFilters.presentations
        )
          return false;
        if (
          activeFilters.activeIngredients &&
          p.activeIngredient !== activeFilters.activeIngredients
        )
          return false;
        if (
          p.currentPrice < currentPriceRange[0] ||
          p.currentPrice > currentPriceRange[1]
        )
          return false;
        return true;
      }),
    );
  }, [
    products,
    activeFilters.brands,
    activeFilters.presentations,
    activeFilters.activeIngredients,
    currentPriceRange,
  ]);

  if (loading) {
    return <p className="p-4 text-center">Cargando...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar + Carrito */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        <NavBar onCartClick={() => setIsCartOpen(true)} />
      </div>
      {isCartOpen && (
        <CartOverlay isOpen closeCart={() => setIsCartOpen(false)} />
      )}

      <main className="container mx-auto flex-grow space-y-6 px-4 pt-[124px]">
        <div className="flex gap-6">
          {/* Sidebar de filtros */}
          <SidebarFilter
            initialFilters={{
              category,
              brand: activeFilters.brands,
              presentation: activeFilters.presentations,
              activeIngredient: activeFilters.activeIngredients,
            }}
            initialPriceRange={priceRange}
            initialCurrentPriceRange={currentPriceRange}
            onApplyFilters={(filters, price) => {
              console.log('Filtros recibidos de Sidebar:', filters);
              // Mapeo de singular → plural para el estado
              const mapped = {
                brands: filters.brand ?? '',
                presentations: filters.presentation ?? '',
                activeIngredients: filters.activeIngredient ?? '',
              };
              console.log('Mapeo a activeFilters:', mapped);
              setActiveFilters(mapped);
              setCurrentPriceRange(price);
            }}
            onClearFilters={() => {
              console.log('Limpiando filtros');
              setActiveFilters({
                brands: '',
                presentations: '',
                activeIngredients: '',
              });
              setCurrentPriceRange(priceRange);
            }}
          />

          {/* Grid de productos */}
          <div className="flex-1">
            <p className="mb-4">
              Total API: <strong>{products.length}</strong>, Filtrados:{' '}
              <strong>{filtered.length}</strong>
            </p>

            {filtered.length === 0 ? (
              <p className="text-center text-gray-500">Sin resultados</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
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
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
