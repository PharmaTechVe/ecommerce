'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/sdkConfig';
import type { ProductPresentation } from '@pharmatech/sdk';

export type SuggestionProduct = ProductPresentation;

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
        const { results } = await api.product.getProducts({
          q: query.trim(),
          page: 1,
          limit: 10,
        });
        const filtered: SuggestionProduct[] =
          category !== 'Categorías'
            ? results.filter((item) =>
                item.product.categories.some((c) => c.name === category),
              )
            : results;
        setProducts(filtered);
        setShowDropdown(filtered.length > 0);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            {products.map((item) => (
              <div
                key={item.id}
                className="mb-3 flex cursor-pointer gap-3 p-2 hover:bg-gray-100"
                onClick={() =>
                  router.push(
                    `/product/${item.product.id}/presentation/${item.presentation.id}?productPresentationId=${item.id}`,
                  )
                }
              >
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={item.product.images?.[0]?.url ?? '/default-image.jpg'}
                    alt={item.product.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-[#1C2143]">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.product.description}
                  </p>
                  <p className="font-semibold">$ {item.price}</p>
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
          setShowDropdown(false); // cierra el dropdown al buscar
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
