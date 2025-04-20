'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/sdkConfig';
import CheckButton from '@/components/CheckButton';
import {
  Root as SliderRoot,
  Track as SliderTrack,
  Range as SliderRange,
  Thumb as SliderThumb,
} from '@radix-ui/react-slider';

export interface Filters {
  category: string | null;
  brand: string | null;
  presentation: string | null;
  activeIngredient: string | null;
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
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);
  const [localPrice, setLocalPrice] = useState<[number, number]>(
    initialCurrentPriceRange,
  );

  const [categoriesList, setCategoriesList] = useState<Option[]>([]);
  const [brandsList, setBrandsList] = useState<Option[]>([]);
  const [presentationsList, setPresentationsList] = useState<Option[]>([]);

  useEffect(() => {
    setLocalFilters(initialFilters);
    setLocalPrice(initialCurrentPriceRange);
  }, [initialFilters, initialCurrentPriceRange]);

  const fetchOptions = async (
    serviceFn: (req: { page: number; limit: number }) => Promise<{
      results: {
        id: string;
        name?: string;
        quantity?: number;
        measurementUnit?: string;
      }[];
    }>,
    mapFn: (item: {
      id: string;
      name?: string;
      quantity?: number;
      measurementUnit?: string;
    }) => Option,
    setter: React.Dispatch<React.SetStateAction<Option[]>>,
  ) => {
    try {
      const { results } = await serviceFn({ page: 1, limit: 100 });
      const opts = results
        .map(mapFn)
        .filter((opt, i, arr) => arr.findIndex((x) => x.id === opt.id) === i);
      setter(opts);
    } catch {
      console.error('Error fetching options');
    }
  };

  useEffect(() => {
    fetchOptions(
      api.category.findAll,
      (p) => ({ id: p.id, name: p.name || 'Unknown' }),
      setCategoriesList,
    );
    fetchOptions(
      api.manufacturer.findAll,
      (p) => ({ id: p.id, name: p.name || 'Unknown' }),
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

  const handleClear = () => {
    setLocalFilters({
      category: null,
      brand: null,
      presentation: null,
      activeIngredient: null,
    });
    setLocalPrice(initialPriceRange);
    onClearFilters();
  };

  const handleApply = () => {
    onApplyFilters(localFilters, localPrice);
  };

  const scrollClass =
    'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-white bg-white';

  return (
    <div className="w-full flex-shrink-0 md:w-64">
      <div className="bg-white p-4">
        <div className="mb-4 flex items-center justify-between rounded bg-[#D4F3EC] p-3">
          <h3 className="font-semibold text-gray-700">Filtros</h3>
          <button
            onClick={handleClear}
            className="text-sm text-gray-600 hover:underline"
          >
            Limpiar
          </button>
        </div>

        {/* Categoría */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Categoría</h4>
          <div className={scrollClass}>
            {categoriesList.map((opt) => (
              <div key={opt.id} className="mb-2">
                <CheckButton
                  text={opt.name}
                  checked={localFilters.category === opt.id}
                  onChange={(checked) =>
                    setLocalFilters((f) => ({
                      ...f,
                      category: checked ? opt.id : null,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Marca */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Marca</h4>
          <div className={scrollClass}>
            {brandsList.map((opt) => (
              <div key={opt.id} className="mb-2">
                <CheckButton
                  text={opt.name}
                  checked={localFilters.brand === opt.id}
                  onChange={(checked) =>
                    setLocalFilters((f) => ({
                      ...f,
                      brand: checked ? opt.id : null,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Presentación */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Presentación</h4>
          <div className={scrollClass}>
            {presentationsList.map((opt) => (
              <div key={opt.id} className="mb-2">
                <CheckButton
                  text={opt.name}
                  checked={localFilters.presentation === opt.id}
                  onChange={(checked) =>
                    setLocalFilters((f) => ({
                      ...f,
                      presentation: checked ? opt.id : null,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Precio */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Precio</h4>
          <SliderRoot
            className="relative flex h-5 w-full touch-none select-none items-center"
            min={initialPriceRange![0]}
            max={initialPriceRange![1]}
            value={localPrice}
            onValueChange={(vals) => setLocalPrice(vals as [number, number])}
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
    </div>
  );
}
