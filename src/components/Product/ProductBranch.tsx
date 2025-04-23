'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/sdkConfig';
import {
  CountryResponse,
  StateResponse,
  BranchResponse,
  ProductPresentation,
} from '@pharmatech/sdk';
import { TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/components/Dropdown';
import GoogleMaps, { BranchMarker } from '@/components/GoogleMap/GoogleMap';
import { FontSizes } from '@/styles/styles';

interface Props {
  productPresentationId: string;
}

export default function ProductBranch({ productPresentationId }: Props) {
  const [states, setStates] = useState<StateResponse[]>([]);
  const [selectedState, setSelectedState] = useState<StateResponse | null>(
    null,
  );
  const [branches, setBranches] = useState<
    (BranchResponse & { stock: number })[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      const countries = await api.country.findAll({ page: 1, limit: 100 });
      const venezuela = countries.results.find(
        (c: CountryResponse) => c.name.toLowerCase() === 'venezuela',
      );
      if (!venezuela) return;

      const statesRes = await api.state.findAll({
        page: 1,
        limit: 100,
        countryId: venezuela.id,
      });

      setStates(statesRes.results);
    };

    loadStates();
  }, []);

  useEffect(() => {
    const loadBranchesWithStock = async () => {
      if (!selectedState || !productPresentationId) return;

      setLoading(true);
      setBranches([]);

      try {
        const branchesRes = await api.branch.findAll({
          page: 1,
          limit: 100,
          stateId: selectedState.id,
        });

        const results: (BranchResponse & { stock: number })[] = [];

        for (const branch of branchesRes.results) {
          const productsRes = await api.product.getProducts({
            page: 1,
            limit: 100,
            branchId: [branch.id],
          });

          const match = productsRes.results.find(
            (p: ProductPresentation) => p.id === productPresentationId,
          );

          if (match && match.presentation.quantity > 0) {
            results.push({ ...branch, stock: match.presentation.quantity });
          }
        }

        setBranches(results);
      } catch (error) {
        console.error('Error cargando sucursales con stock:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBranchesWithStock();
  }, [selectedState, productPresentationId]);

  const mapCenter = useMemo(() => {
    if (branches.length > 0) {
      const { latitude, longitude } = branches[0];
      return { lat: latitude ?? 10.0653, lng: longitude ?? -69.3235 };
    }
    return { lat: 10.0653, lng: -69.3235 };
  }, [branches]);

  const markers: BranchMarker[] = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    latitude: branch.latitude,
    longitude: branch.longitude,
    address: branch.address,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <GoogleMaps
          markers={markers}
          center={mapCenter}
          mapWidth="100%"
          mapHeight="600px"
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <h2
              className="text-gray-700"
              style={{ fontSize: FontSizes.h5.size }}
            >
              Disponibilidad en sucursales
            </h2>
            <p className="text-sm text-gray-500">Seleccione el estado</p>
            <div className="max-w-md">
              <Dropdown
                label="Selecciona un estado"
                items={states.map((s) => s.name)}
                value={selectedState?.name}
                onSelect={(name) => {
                  const state = states.find((s) => s.name === name);
                  if (state) setSelectedState(state);
                }}
              />
            </div>
          </div>

          {/* Listado */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-400">
                Cargando disponibilidad...
              </div>
            ) : branches.length > 0 ? (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-start justify-between rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {branch.name}
                    </h3>
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {branch.stock} unidades
                    </p>
                    <div className="flex items-center justify-end gap-1 text-sm text-green-600">
                      <TruckIcon className="h-4 w-4" />
                      <span>Envío en menos de 3h</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              ))
            ) : selectedState ? (
              <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-500">
                No hay disponibilidad de esta presentación en las sucursales del
                estado seleccionado.
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Seleccione un estado para ver disponibilidad
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
