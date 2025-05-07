'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/sdkConfig';
import CheckButton from '@/components/CheckButton';
import {
  Root as SliderRoot,
  Track as SliderTrack,
  Range as SliderRange,
  Thumb as SliderThumb,
} from '@radix-ui/react-slider';

export interface Filters {
  category: string[];
  brand: string[];
  presentation: string[];
  activeIngredient: string[];
}

interface SidebarFilterProps {
  initialFilters: Filters;
  initialPriceRange?: [number, number];
  initialCurrentPriceRange?: [number, number];
  onApplyFilters: (filters: Filters, priceRange: [number, number]) => void;
  onClearFilters: () => void;
}

interface Option {
  id: string;
  name: string;
}

export default function SidebarFilter({
  initialFilters,
  initialPriceRange = [0, 0],
  initialCurrentPriceRange = [0, 0],
  onApplyFilters,
  onClearFilters,
}: SidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);
  const [localPrice, setLocalPrice] = useState<[number, number]>(
    initialCurrentPriceRange,
  );
  const [categoriesList, setCategoriesList] = useState<Option[]>([]);
  const [brandsList, setBrandsList] = useState<Option[]>([]);
  const [presentationsList, setPresentationsList] = useState<Option[]>([]);

  const initialSyncRef = useRef(true);

  useEffect(() => {
    if (initialSyncRef.current) {
      const params = searchParams;
      const rawCategory =
        params?.get('category') || params?.get('categoryId') || '';
      const category = rawCategory ? rawCategory.split(',') : [];
      const brand = params?.get('brand')?.split(',') || [];
      const presentation = params?.get('presentation')?.split(',') || [];
      const activeIngredient =
        params?.get('activeIngredient')?.split(',') || [];
      const priceMin = parseFloat(
        params?.get('priceMin') || String(initialPriceRange[0]),
      );
      const priceMax = parseFloat(
        params?.get('priceMax') || String(initialPriceRange[1]),
      );

      setLocalFilters({ category, brand, presentation, activeIngredient });
      setLocalPrice([priceMin, priceMax]);
      // Trigger parent to reload results on refresh
      onApplyFilters({ category, brand, presentation, activeIngredient }, [
        priceMin,
        priceMax,
      ]);
      initialSyncRef.current = false;
    }
  }, [searchParams, initialPriceRange, onApplyFilters]);

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
    const params = new URLSearchParams(
      Array.from(searchParams?.entries() || []),
    );

    // Preserve initial category if none selected locally
    const rawCat = params.get('category') || params.get('categoryId') || '';
    const initialCats = rawCat ? rawCat.split(',') : [];
    const selectedCategories =
      localFilters.category.length > 0 ? localFilters.category : initialCats;

    if (localFilters.category.length)
      params.set('categoryId', localFilters.category.join(','));
    else params.delete('categoryId');

    if (localFilters.brand.length > 0)
      params.set('brand', localFilters.brand.join(','));
    else params.delete('brand');

    if (localFilters.presentation.length > 0)
      params.set('presentation', localFilters.presentation.join(','));
    else params.delete('presentation');

    if (localFilters.activeIngredient.length > 0)
      params.set('activeIngredient', localFilters.activeIngredient.join(','));
    else params.delete('activeIngredient');

    params.set('priceMin', String(localPrice[0]));
    params.set('priceMax', String(localPrice[1]));

    router.push(`${pathname}?${params.toString()}`);
    onApplyFilters(
      {
        ...localFilters,
        category: selectedCategories,
      },
      localPrice,
    );
  };

  const toggleSelection = (key: keyof Filters, id: string) => {
    setLocalFilters((prev) => {
      const arr = prev[key];
      const updated = arr.includes(id)
        ? arr.filter((x) => x !== id)
        : [...arr, id];
      return { ...prev, [key]: updated } as Filters;
    });
  };

  const handleClear = () => {
    setLocalFilters({
      category: [],
      brand: [],
      presentation: [],
      activeIngredient: [],
    });
    setLocalPrice(initialPriceRange);
    onClearFilters();
    router.push(pathname);
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
                checked={localFilters.category.includes(opt.id)}
                onChange={() => toggleSelection('category', opt.id)}
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
                checked={localFilters.brand.includes(opt.id)}
                onChange={() => toggleSelection('brand', opt.id)}
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
                checked={localFilters.presentation.includes(opt.id)}
                onChange={() => toggleSelection('presentation', opt.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h4 className="mb-2 font-medium">Precio</h4>
        <SliderRoot
          className="relative flex h-5 w-full touch-none select-none items-center"
          min={initialPriceRange[0]}
          max={initialPriceRange[1]}
          value={localPrice}
          onValueChange={(value) => setLocalPrice([value[0], value[1]])}
        >
          <SliderTrack className="relative h-2 flex-1 rounded bg-gray-200">
            <SliderRange className="absolute h-full rounded bg-[#1C2143]" />
          </SliderTrack>
          <SliderThumb className="block h-5 w-5 rounded-full border-2 border-[#1C2143] bg-[#1C2143]" />
          <SliderThumb className="block h-5 w-5 rounded-full border-2 border-[#1C2143] bg-[#1C2143]" />
        </SliderRoot>
        <div className="mt-1 flex justify-between text-xs">
          <span>Bs {localPrice[0]}</span>
          <span>Bs {localPrice[1]}</span>
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
