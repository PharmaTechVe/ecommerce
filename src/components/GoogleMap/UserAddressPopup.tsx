'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import GoogleMaps from '@/components/GoogleMap/GoogleMap';
import { Colors, FontSizes } from '@/styles/styles';

type LocationPopupProps = {
  onAdd: (
    location: { lat: number; lng: number },
    address: string,
    cityId: string,
  ) => void;
  onBack: () => void;
  guideText?: string;
};

const LocationPopup: React.FC<LocationPopupProps> = ({
  onAdd,
  onBack,
  guideText,
}) => {
  const [latitude, setLatitude] = useState(10.3121);
  const [longitude, setLongitude] = useState(-69.3026);
  const [address, setAddress] = useState('');
  const [radius] = useState(5000);
  const [showGuide, setShowGuide] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<string>(''); // ✅ cityId aquí

  // Puedes agregar lógica para determinar el cityId desde la API o a través de selección del usuario
  // Por ahora lo puedes setear manualmente para pruebas
  useEffect(() => {
    setSelectedCityId('7ec2b919-b961-458d-8275-4ee957010336'); // o dinámico si aplicas lógica
  }, []);

  const handleCloseModal = (submit: boolean) => {
    if (submit) {
      onAdd({ lat: latitude, lng: longitude }, address, selectedCityId);
    }
    onBack();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black bg-opacity-40 backdrop-blur-sm" />
      <div className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl">
        <div className="flex max-h-[90vh] flex-col overflow-auto p-4">
          <p
            className="mb-2 text-center font-semibold"
            style={{
              fontSize: FontSizes.h5.size,
              color: Colors.textMain,
            }}
          >
            Ubica la dirección exacta
          </p>

          {showGuide && guideText && (
            <div className="relative mb-3 rounded-lg bg-[#34A853] p-3 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span>{guideText}</span>
                <button
                  onClick={() => setShowGuide(false)}
                  className="ml-4 font-bold text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="mb-3 h-[300px] w-full overflow-hidden rounded-md">
            <GoogleMaps
              radius={radius}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              address={address}
              setAddress={setAddress}
              latitude={latitude}
              longitude={longitude}
            />
          </div>

          <div className="mb-4 flex items-center justify-center px-4 text-center text-gray-600">
            <span className="text-sm">
              Ubicación seleccionada: {address || 'Obteniendo dirección...'}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3 md:flex-row">
            <Button
              variant="white"
              className="w-full border text-gray-700"
              onClick={() => handleCloseModal(false)}
            >
              Atrás
            </Button>
            <Button
              variant="submit"
              className="w-full text-white"
              onClick={() => handleCloseModal(true)}
            >
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPopup;
