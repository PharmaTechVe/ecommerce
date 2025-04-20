'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/sdkConfig';

interface SuggestionProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface SearchSuggestionsProps {
  query: string;
  category: string;
}

export default function SearchSuggestions({
  query,
  category,
}: SearchSuggestionsProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<SuggestionProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.product.getProducts({
          q: query.trim(),
          page: 1,
          limit: 10,
        });
        const results = resp.results;
        const byCategory =
          category !== 'Categorías'
            ? results.filter((item) =>
                item.product.categories?.some((c) => c.name === category),
              )
            : results;

        const ui = byCategory.map((item) => ({
          id: item.id,
          name: item.product.name,
          description: item.product.description ?? '',
          price: item.price,
          image: item.product.images?.[0]?.url ?? '/default-image.jpg',
        }));
        setProducts(ui);
        setShowDropdown(ui.length > 0);
      } catch {
        setError('Error al cargar los productos');
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!showDropdown) return null;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-full z-10 w-full max-w-md translate-y-4 bg-white shadow-xl md:w-[600px] md:max-w-none lg:w-[800px]"
    >
      <div className="flex divide-x">
        <div className="w-1/3 p-4 text-sm">
          <h4 className="mb-2 border-b pb-2 font-semibold text-gray-500">
            Categoría
          </h4>
          <p className="text-gray-700">{category}</p>
        </div>
        <div className="w-2/3 text-sm">
          <h4 className="px-4 pt-4 font-semibold text-gray-500">
            Productos que coinciden con “{query}”
          </h4>
          {loading && <div className="px-4 py-4 text-gray-500">Cargando…</div>}
          {error && <div className="px-4 py-4 text-red-500">{error}</div>}
          <div className="mt-2 max-h-[calc(500px-64px)] overflow-y-auto px-4 pb-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="mb-3 flex cursor-pointer gap-3 p-2 hover:bg-gray-100"
                onClick={() => router.push(`/product/${prod.id}`)}
              >
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-[#1C2143]">{prod.name}</p>
                  <p className="text-xs text-gray-500">{prod.description}</p>
                  <p className="font-semibold">Bs {prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className="flex w-full items-center justify-between border-t px-4 py-3 hover:bg-gray-100"
        onClick={() => {
          const qEnc = encodeURIComponent(query.trim());
          const cEnc = encodeURIComponent(category.trim());
          router.push(`/search?query=${qEnc}&category=${cEnc}`);
        }}
      >
        <span>
          Buscar “{query}” en “{category}”
        </span>
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
