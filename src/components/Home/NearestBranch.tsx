'use client';
import useBranches from '@/hooks/useBranch';
import { useUserLocation } from '@/hooks/useLocation';
import getNearestBranch from '@/lib/utils/helpers/nearest-branch';
import GoogleMaps from '../GoogleMap/GoogleMap';

export default function NearestBranch() {
  const location = useUserLocation();
  const { branches, loading, error } = useBranches();

  if (loading) return <p>Cargando sucursales...</p>;
  if (error) return;

  if (!location) return;

  const nearest = getNearestBranch(location, branches);

  return (
    <div>
      <h3 className="my-8 pt-4 text-[32px] text-[#1C2143]">
        Pharmatech más cerca de ti
      </h3>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Info de la sucursal */}
        <div className="w-full flex-shrink-0 md:w-1/3">
          <div className="rounded-lg bg-white p-4 shadow">
            <h4 className="mb-2 text-xl font-semibold text-[#1C2143]">
              {nearest?.name}
            </h4>
            <p className="text-gray-700">{nearest?.address}</p>
          </div>
        </div>
        {/* Mapa */}
        <div className="w-full md:w-2/3">
          <GoogleMaps
            markers={branches}
            center={{
              lat: nearest!.latitude,
              lng: nearest!.longitude,
            }}
            zoom={18}
            draggable={false}
            onCoordinateChange={() => {}}
            mapHeight="350px"
          />
        </div>
      </div>
    </div>
  );
}
