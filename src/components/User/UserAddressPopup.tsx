'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import GoogleMaps from '@/components/User/GoogleMap';
import { Colors, FontSizes } from '@/styles/styles';

type LocationPopupProps = {
  onAdd: (location: { lat: number; lng: number }, address: string) => void;
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

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    if (!window.google || !window.google.maps) return;

    let geocoderInstance: google.maps.Geocoder | undefined;

    if (typeof window.google.maps.Geocoder === 'function') {
      geocoderInstance = new window.google.maps.Geocoder();
    } else if (window.google.maps.importLibrary) {
      try {
        const geocodingModule = (await window.google.maps.importLibrary(
          'geocoding',
        )) as {
          Geocoder: new () => google.maps.Geocoder;
        };
        geocoderInstance = new geocodingModule.Geocoder();
      } catch {
        setAddress('Dirección no encontrada');
        return;
      }
    }

    const latLng = new window.google.maps.LatLng(lat, lng);
    geocoderInstance?.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results?.length) {
        setAddress(results[0].formatted_address || 'Dirección no encontrada');
      } else {
        setAddress('Dirección no encontrada');
      }
    });
  };

  useEffect(() => {
    getAddressFromCoordinates(latitude, longitude);
  }, [latitude, longitude]);

  const handleCloseModal = (submit: boolean) => {
    if (submit) {
      onAdd({ lat: latitude, lng: longitude }, address);
    }
    onBack();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black bg-opacity-40 backdrop-blur-sm" />

      {/* Modal */}
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

          {/* Texto de guía */}
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

          {/* Mapa */}
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

          {/* Dirección */}
          <div className="mb-4 flex items-center justify-center px-4 text-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="mr-2 h-5 w-5"
            >
              <path
                d="M12 21.75s-7.5-4.5-7.5-11.25a7.5 7.5 0 1115 0c0 6.75-7.5 11.25-7.5 11.25z"
                fill={Colors.primary}
                stroke={Colors.primary}
              />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
            <span className="text-sm">
              Ubicación seleccionada: {address || 'Obteniendo dirección...'}
            </span>
          </div>

          {/* Botones */}
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
