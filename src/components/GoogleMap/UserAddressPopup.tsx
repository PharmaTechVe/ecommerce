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
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  latitude: number;
  longitude: number;
};

const LocationPopup: React.FC<LocationPopupProps> = ({
  onAdd,
  onBack,
  setLatitude,
  setLongitude,
  latitude,
  longitude,
}) => {
  setLatitude(latitude);
  setLongitude(longitude);
  const [address, setAddress] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  useEffect(() => {
    setSelectedCityId('7ec2b919-b961-458d-8275-4ee957010336');
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

          {showGuide && (
            <div className="relative mb-3 rounded-lg bg-[#34A853] p-3 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span>Mueve el pin hasta tu ubicación exacta</span>
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
              radius={100}
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
