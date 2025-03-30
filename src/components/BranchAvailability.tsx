'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import { api } from '@/lib/sdkConfig';
import { Colors, FontSizes } from '@/styles/styles';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { TruckIcon } from '@heroicons/react/24/outline';
interface BranchAvailabilityProps {
  presentationId: string;
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

const DUMMY_INVENTORY: InventoryResult[] = [
  {
    id: 'dummy-1',
    stockQuantity: 5,
    branch: {
      id: 'branch-dummy-1',
      name: 'Farmacia Dummy',
      address: 'Calle Falsa 123',
      latitude: 10.061226,
      longitude: -69.340529,
      city: {
        id: 'city-dummy-1',
        name: 'DummyCity',
        state: {
          id: 'state-dummy-1',
          name: 'DummyState',
          country: {
            id: 'country-dummy-1',
            name: 'DummyLand',
          },
        },
      },
    },
  },
  {
    id: 'dummy-2',
    stockQuantity: 10,
    branch: {
      id: 'branch-dummy-2',
      name: 'Farmacia Dummy 2',
      address: 'Calle Falsa 123',
      latitude: 10.061226,
      longitude: -69.340529,
      city: {
        id: 'city-dummy-1',
        name: 'DummyCity',
        state: {
          id: 'state-dummy-1',
          name: 'DummyState',
          country: {
            id: 'country-dummy-1',
            name: 'DummyLand',
          },
        },
      },
    },
  },
  {
    id: 'dummy-2',
    stockQuantity: 8,
    branch: {
      id: 'branch-dummy-2',
      name: 'Farmacia Falsa',
      address: 'Avenida Lorem 456',
      latitude: 10.061226,
      longitude: -69.340529,
      city: {
        id: 'city-dummy-2',
        name: 'FalsoCity',
        state: {
          id: 'state-dummy-2',
          name: 'Lara',
          country: {
            id: 'country-dummy-2',
            name: 'Venezuela',
          },
        },
      },
    },
  },
];

const BranchAvailability: React.FC<BranchAvailabilityProps> = ({
  presentationId,
}) => {
  const [inventoryList, setInventoryList] = useState<InventoryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await api.inventory.findAll({
          page: 1,
          limit: 20,
          productPresentationId: presentationId,
        });

        if (!data.results || data.results.length === 0) {
          setInventoryList(DUMMY_INVENTORY);
        } else {
          setInventoryList(data.results);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching branch availability:', err);
        setError('Error al obtener disponibilidad en sucursales');
        setLoading(false);
      }
    };

    if (presentationId) {
      fetchBranches();
    }
  }, [presentationId]);

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
      <div className="h-[400px] w-full bg-gray-100 md:w-[50%]">
        <p>Mapa de sucursales (placeholder)</p>
      </div>

      {/* Sección de filtrado + lista */}
      <div className="mt-4 flex w-full flex-col space-y-4 p-4 md:mt-0 md:w-[50%]">
        <h2
          className="text-3xl"
          style={{
            fontSize: `${FontSizes.h3.size}px`,
            lineHeight: `${FontSizes.h3.lineHeight}px`,
            color: Colors.textMain,
          }}
        >
          Disponibilidad en sucursales
        </h2>

        <div className="mb-4">
          <p className="mb-2">Selecciona el estado</p>
          <Dropdown
            label="Selecciona un estado"
            items={uniqueStates}
            onSelect={handleSelectState}
          />
        </div>

        <div className="space-y-2">
          {filteredBranches.length === 0 ? (
            <p>No hay sucursales disponibles en {selectedState}</p>
          ) : (
            filteredBranches.map((inv) => (
              <div key={inv.id} className="w-full gap-2 p-4 shadow-md">
                <div className="flex flex-col gap-2 md:flex-row">
                  {/* Columna izquierda */}
                  <div className="flex flex-col space-y-2 md:w-1/2">
                    {/* Nombre del branch */}
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

                    {/* Dirección */}
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
                  <div className="flex flex-col items-end space-y-2 md:w-1/2">
                    {/* Stock + Check */}
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

                    {/* Info de envío */}
                    <div className="flex items-center space-x-1 text-gray-600">
                      <TruckIcon className="h-5 w-5" />
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
