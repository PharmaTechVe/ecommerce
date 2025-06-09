'use client';

import Loading from '@/app/loading';
import GoogleMaps from '@/components/GoogleMap/GoogleMap';
import useBranches from '@/hooks/useBranch';
import { useState } from 'react';

export default function Branches() {
  const defaultLat = 10.0653;
  const defaultLng = -69.3235;
  const [mapCenter, setMapCenter] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });
  const { branches, loading } = useBranches();
  if (loading) return <Loading />;

  return (
    <main className="mb-12 ml-10 max-w-7xl p-4">
      <h3 className="my-4 text-[32px] text-[#1C2143]">Sucursales Pharmatech</h3>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Info de la sucursal */}
        <div className="w-full flex-shrink-0 md:w-1/3">
          <div className="flex max-h-[500px] flex-col gap-6 overflow-y-auto px-2">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="cursor-pointer rounded-lg bg-white p-4 shadow transition hover:ring-2 hover:ring-[#1C2143]"
                onClick={() =>
                  setMapCenter({
                    lat: branch.latitude,
                    lng: branch.longitude,
                  })
                }
              >
                <h4 className="mb-2 text-xl font-semibold text-[#1C2143]">
                  {branch.name}
                </h4>
                <p className="text-gray-700">{branch.address}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="w-full md:w-2/3">
          <GoogleMaps
            markers={branches}
            center={mapCenter}
            zoom={18}
            draggable={false}
            onCoordinateChange={() => {}}
            mapHeight="350px"
          />
        </div>
      </div>
    </main>
  );
}
