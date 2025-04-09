'use client';

import Button from '@/components/Button';

interface LocationPopupProps {
  onAdd: () => void;
  onBack: () => void;
}

export default function LocationPopup({ onAdd, onBack }: LocationPopupProps) {
  return (
    <div
      className="fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-lg bg-white p-6 shadow-xl"
      style={{ width: '808px', height: '1024px' }}
    >
      {/* Título */}
      <h2 className="text-center text-2xl font-semibold text-gray-800">
        Ubica la dirección exacta
      </h2>

      {/* Placeholder del mapa */}
      <div
        className="mb-8 mt-8 w-full flex-1 rounded-md border border-gray-300 bg-gray-100"
        style={{ minHeight: '700px' }}
      >
        {/* integrará Google Maps más adelante */}
        <div className="flex h-full items-center justify-center text-gray-500">
          Mapa (Google Maps API Placeholder)
        </div>
      </div>

      {/* Botones */}
      <div className="flex w-full justify-between gap-4">
        <Button
          variant="white"
          className="w-full border border-transparent text-gray-700"
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button variant="submit" className="w-full text-white" onClick={onAdd}>
          Agregar
        </Button>
      </div>
    </div>
  );
}
