'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/sdkConfig';
import CheckButton from '@/components/CheckButton';
import {
  Root as SliderRoot,
  Track as SliderTrack,
  Range as SliderRange,
  Thumb as SliderThumb,
} from '@radix-ui/react-slider';

export interface Filters {
  categories: string[];
  brands: string[];
  presentations: string[];
  activeIngredients: string[];
  query?: string;
  priceMin?: number;
  priceMax?: number;
}

interface SidebarFilterProps {
  initialFilters: Filters;
  setFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

interface Option {
  id: string;
  name: string;
}

export default function SidebarFilter({
  initialFilters,
  onClearFilters,
  setFilters,
}: SidebarFilterProps) {
  const priceRange = useMemo<[number, number]>(() => [0, 10000], []);
  const router = useRouter();

  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);
  const [categoriesList, setCategoriesList] = useState<Option[]>([]);
  const [brandsList, setBrandsList] = useState<Option[]>([]);
  const [presentationsList, setPresentationsList] = useState<Option[]>([]);

  const fetchOptions = async (
    serviceFn: (opts: { page: number; limit: number }) => Promise<{
      results: Array<{
        id: string;
        name: string;
        quantity?: number;
        measurementUnit?: string;
      }>;
    }>,
    mapFn: (item: {
      id: string;
      name: string;
      quantity?: number;
      measurementUnit?: string;
    }) => Option,
    setter: React.Dispatch<React.SetStateAction<Option[]>>,
  ) => {
    try {
      const { results } = await serviceFn({ page: 1, limit: 100 });
      const opts = results
        .map(mapFn)
        .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
      setter(opts);
    } catch {
      console.error('Error fetching options');
    }
  };

  useEffect(() => {
    fetchOptions(
      api.category.findAll,
      (c) => ({ id: c.id, name: c.name }),
      setCategoriesList,
    );
    fetchOptions(
      api.manufacturer.findAll,
      (m) => ({ id: m.id, name: m.name }),
      setBrandsList,
    );
    fetchOptions(
      api.presentation.findAll,
      (p) => ({
        id: p.id,
        name: `${p.name} (${p.quantity} ${p.measurementUnit})`,
      }),
      setPresentationsList,
    );
  }, []);

  const handleApply = () => {
    const params = new URLSearchParams();

    if (localFilters.categories.length > 0)
      // remove empty string from categories if length is greater than 1
      params.set(
        'categoryId',
        localFilters.categories.filter((c) => c !== '').join(','),
      );
    else params.delete('categoryId');

    if (localFilters.brands.length > 0)
      params.set('brand', localFilters.brands.join(','));
    else params.delete('brand');

    if (localFilters.presentations.length > 0)
      params.set('presentation', localFilters.presentations.join(','));
    else params.delete('presentation');

    if (localFilters.activeIngredients.length > 0)
      params.set('activeIngredient', localFilters.activeIngredients.join(','));
    else params.delete('activeIngredient');

    params.set('priceMin', String(localFilters.priceMin));
    params.set('priceMax', String(localFilters.priceMax));
    params.set('query', localFilters.query || '');
    setFilters(localFilters);
    router.push(`/search?${params.toString()}`);
  };

  const toggleSelection = (
    key: 'categories' | 'brands' | 'presentations',
    id: string,
  ) => {
    setLocalFilters((prev) => {
      const arr = prev[key];
      const updated = arr.includes(id)
        ? arr.filter((x) => x !== id)
        : [...arr, id];
      return { ...prev, [key]: updated } as Filters;
    });
  };

  const setLocalPrice = (value: [number, number]) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceMin: value[0],
      priceMax: value[1],
    }));
  };

  const handleClear = () => {
    setLocalFilters({
      categories: [],
      brands: [],
      presentations: [],
      activeIngredients: [],
      query: '',
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
    onClearFilters();
  };

  const scrollClass =
    'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-white bg-white';

  return (
    <div className="w-full bg-white p-4 md:w-64">
      <div className="mb-4 flex items-center justify-between rounded bg-[#D4F3EC] p-3">
        <h3 className="font-semibold text-gray-700">Filtros</h3>
        <button
          onClick={handleClear}
          className="text-sm text-gray-600 hover:underline"
        >
          Limpiar
        </button>
      </div>

      <section className="mb-6">
        <h4 className="mb-2 font-medium">Categoría</h4>
        <div className={scrollClass}>
          {categoriesList.map((opt) => (
            <div key={opt.id} className="mb-2">
              <CheckButton
                text={opt.name}
                checked={localFilters.categories.includes(opt.id)}
                onChange={() => toggleSelection('categories', opt.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h4 className="mb-2 font-medium">Marca</h4>
        <div className={scrollClass}>
          {brandsList.map((opt) => (
            <div key={opt.id} className="mb-2">
              <CheckButton
                text={opt.name}
                checked={localFilters.brands.includes(opt.id)}
                onChange={() => toggleSelection('brands', opt.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h4 className="mb-2 font-medium">Presentación</h4>
        <div className={scrollClass}>
          {presentationsList.map((opt) => (
            <div key={opt.id} className="mb-2">
              <CheckButton
                text={opt.name}
                checked={localFilters.presentations.includes(opt.id)}
                onChange={() => toggleSelection('presentations', opt.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h4 className="mb-2 font-medium">Precio</h4>
        <SliderRoot
          className="relative flex h-5 w-full touch-none select-none items-center"
          min={priceRange[0]}
          max={priceRange[1]}
          value={[localFilters.priceMin || 0, localFilters.priceMax || 10000]}
          onValueChange={(value) => setLocalPrice([value[0], value[1]])}
        >
          <SliderTrack className="relative h-2 flex-1 rounded bg-gray-200">
            <SliderRange className="absolute h-full rounded bg-[#1C2143]" />
          </SliderTrack>
          <SliderThumb className="block h-5 w-5 rounded-full border-2 border-[#1C2143] bg-[#1C2143]" />
          <SliderThumb className="block h-5 w-5 rounded-full border-2 border-[#1C2143] bg-[#1C2143]" />
        </SliderRoot>
        <div className="mt-1 flex justify-between text-xs">
          <span>Bs {priceRange[0] / 100}</span>
          <span>Bs {priceRange[1] / 100}</span>
        </div>
      </section>

      <button
        onClick={handleApply}
        className="w-full rounded bg-[#1C2143] py-2 text-sm text-white"
      >
        Aplicar filtros
      </button>
    </div>
  );
}
