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

interface Filters {
  category: string | null;
  brand: string | null;
  presentation: string | null;
  activeIngredient: string | null;
}

interface SidebarFilterProps {
  initialFilters: Filters;
  initialPriceRange: [number, number];
  initialCurrentPriceRange: [number, number];
  onApplyFilters: (filters: Filters, priceRange: [number, number]) => void;
  onClearFilters: () => void;
}

interface Option {
  id: number;
  name: string;
}

export default function SidebarFilter({
  initialFilters,
  initialPriceRange,
  initialCurrentPriceRange,
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
  const [activeList, setActiveList] = useState<Option[]>([]);

  // Sync internal state when props change
  useEffect(() => {
    setLocalFilters(initialFilters);
    setLocalPrice(initialCurrentPriceRange);
  }, [initialFilters, initialCurrentPriceRange]);

  // Generic fetcher for options
  const fetchOptions = async (
    serviceFn: (req: {
      page: number;
      limit: number;
    }) => Promise<{
      results: {
        id: string;
        name?: string;
        description?: string;
        genericName?: string;
      }[];
    }>,
    mapFn: (
      item: {
        id: string;
        name?: string;
        description?: string;
        genericName?: string;
      },
      idx: number,
    ) => Option,
    setter: React.Dispatch<React.SetStateAction<Option[]>>,
  ) => {
    try {
      const { results } = await serviceFn({ page: 1, limit: 100 });
      const opts = results
        .map((item, idx) => mapFn(item, idx))
        .filter((opt, i, arr) => arr.findIndex((x) => x.id === opt.id) === i);
      setter(opts);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  // Load lists on mount
  useEffect(() => {
    fetchOptions(
      api.category.findAll,
      (p, idx) => ({
        id: parseInt(p.id, 10) || idx,
        name: p.name || 'Unknown',
      }),
      setCategoriesList,
    );
    fetchOptions(
      api.manufacturer.findAll,
      (p, idx) => ({
        id: parseInt(p.id, 10) || idx,
        name: p.name || 'Unknown',
      }),
      setBrandsList,
    );
    fetchOptions(
      api.presentation.findAll,
      (p, idx) => ({
        id: parseInt(p.id, 10) || idx,
        name: p.name || p.description || '',
      }),
      setPresentationsList,
    );
    fetchOptions(
      api.genericProduct.findAll,
      (p, idx) => ({
        id: parseInt(p.id, 10) || idx,
        name: p.genericName || p.name || 'Unknown',
      }),
      setActiveList,
    );
  }, []);

  const handleClear = () => {
    onClearFilters();
    setLocalFilters({
      category: null,
      brand: null,
      presentation: null,
      activeIngredient: null,
    });
    setLocalPrice(initialPriceRange);
  };

  const handleApply = () => onApplyFilters(localFilters, localPrice);

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
          {categoriesList.length === 0 ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <div className="max-h-32 overflow-y-auto pr-2">
              {categoriesList.map((opt) => (
                <div key={opt.id} className="mb-2">
                  <CheckButton
                    text={opt.name}
                    checked={localFilters.category === opt.id.toString()}
                    onChange={(checked) =>
                      setLocalFilters((f) => ({
                        ...f,
                        category: checked ? opt.id.toString() : null,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Marca */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Marca</h4>
          {brandsList.length === 0 ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <div className="max-h-32 overflow-y-auto pr-2">
              {brandsList.map((opt) => (
                <div key={opt.id} className="mb-2">
                  <CheckButton
                    text={opt.name}
                    checked={localFilters.brand === opt.id.toString()}
                    onChange={(checked) =>
                      setLocalFilters((f) => ({
                        ...f,
                        brand: checked ? opt.id.toString() : null,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Presentación */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Presentación</h4>
          {presentationsList.length === 0 ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <div className="max-h-32 overflow-y-auto pr-2">
              {presentationsList.map((opt) => (
                <div key={opt.id} className="mb-2">
                  <CheckButton
                    text={opt.name}
                    checked={localFilters.presentation === opt.id.toString()}
                    onChange={(checked) =>
                      setLocalFilters((f) => ({
                        ...f,
                        presentation: checked ? opt.id.toString() : null,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Principio Activo */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Principio Activo</h4>
          {activeList.length === 0 ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <div className="max-h-32 overflow-y-auto pr-2">
              {activeList.map((opt) => (
                <div key={opt.id} className="mb-2">
                  <CheckButton
                    text={opt.name}
                    checked={
                      localFilters.activeIngredient === opt.id.toString()
                    }
                    onChange={(checked) =>
                      setLocalFilters((f) => ({
                        ...f,
                        activeIngredient: checked ? opt.id.toString() : null,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Precio */}
        <section className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Precio</h4>
          <div className="px-2">
            <SliderRoot
              className="relative flex h-5 w-full touch-none select-none items-center"
              min={initialPriceRange[0]}
              max={initialPriceRange[1]}
              value={localPrice}
              onValueChange={(values) =>
                setLocalPrice(values as [number, number])
              }
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
