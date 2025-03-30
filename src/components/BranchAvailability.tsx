'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import { api } from '@/lib/sdkConfig';
import { Colors, FontSizes } from '@/styles/styles';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { TruckIcon } from '@heroicons/react/24/outline';

interface BranchAvailabilityProps {
  productPresentationId: string;
}

interface InventoryResult {
  id: string;
  stockQuantity: number;
  branch: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city: {
      id: string;
      name: string;
      state: {
        id: string;
        name: string;
        country: {
          id: string;
          name: string;
        };
      };
    };
  };
}

const BranchAvailability: React.FC<BranchAvailabilityProps> = ({
  productPresentationId,
}) => {
  const [inventoryList, setInventoryList] = useState<InventoryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    if (!productPresentationId) {
      setInventoryList([]);
      setLoading(false);
      return;
    }

    async function fetchBranches() {
      try {
        const data = await api.inventory.findAll({
          page: 1,
          limit: 20,
          productPresentationId: productPresentationId,
        });

        if (!data.results || data.results.length === 0) {
          setInventoryList([]);
        } else {
          setInventoryList(data.results);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching branch availability:', err);
        setError('Error al obtener disponibilidad en sucursales');
        setLoading(false);
      }
    }

    fetchBranches();
  }, [productPresentationId]);

  const uniqueStates = Array.from(
    new Set(inventoryList.map((inv) => inv.branch.city.state.name)),
  );

  useEffect(() => {
    if (uniqueStates.length > 0 && !selectedState) {
      setSelectedState(uniqueStates[0]);
    }
  }, [uniqueStates, selectedState]);

  if (loading) {
    return <p>Cargando disponibilidad...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredBranches = inventoryList.filter(
    (item) => item.branch.city.state.name === selectedState,
  );

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row">
      {/* Sección de mapa */}
      <div className="h-[400px] w-full bg-gray-100 md:w-1/2">
        <p>Mapa de sucursales (placeholder)</p>
      </div>

      {/* Sección de filtrado + lista */}
      <div className="mt-4 w-full p-4 md:mt-0 md:w-1/2">
        <h2
          className="mb-4 text-3xl"
          style={{
            fontSize: `${FontSizes.h3.size}px`,
            lineHeight: `${FontSizes.h3.lineHeight}px`,
            color: Colors.textMain,
          }}
        >
          Disponibilidad en sucursales
        </h2>

        <div className="mb-6">
          <p className="mb-2">Selecciona el estado</p>
          <Dropdown
            label="Selecciona un estado"
            items={uniqueStates}
            onSelect={handleSelectState}
          />
        </div>

        <div className="space-y-4">
          {filteredBranches.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            filteredBranches.map((inv) => (
              <div
                key={inv.id}
                className="w-full rounded-md border p-4 shadow-md"
              >
                <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                  {/* Columna izquierda */}
                  <div className="flex flex-col space-y-2 md:w-1/2">
                    <h3
                      style={{
                        fontSize: `${FontSizes.h5.size}px`,
                        lineHeight: `${FontSizes.h5.lineHeight}px`,
                        color: Colors.textMain,
                        fontWeight: 500,
                      }}
                    >
                      {inv.branch.name}
                    </h3>
                    <p
                      style={{
                        fontSize: `${FontSizes.b3.size}px`,
                        lineHeight: `${FontSizes.b3.lineHeight}px`,
                        color: Colors.textLowContrast,
                      }}
                    >
                      {inv.branch.address} - {inv.branch.city.name},{' '}
                      {inv.branch.city.state.name}
                    </p>
                  </div>
                  {/* Columna derecha */}
                  <div className="flex flex-col items-start space-y-2 md:w-1/2 md:items-end">
                    <div className="flex items-center space-x-2">
                      <span
                        style={{
                          fontSize: `${FontSizes.b1.size}px`,
                          lineHeight: `${FontSizes.b1.lineHeight}px`,
                          color: Colors.textMain,
                        }}
                      >
                        {inv.stockQuantity} unidades
                      </span>
                      <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TruckIcon className="h-5 w-5 text-gray-600" />
                      <span
                        style={{
                          fontSize: `${FontSizes.b3.size}px`,
                          lineHeight: `${FontSizes.b3.lineHeight}px`,
                          color: Colors.textLowContrast,
                        }}
                      >
                        Envío en menos de 3h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchAvailability;
