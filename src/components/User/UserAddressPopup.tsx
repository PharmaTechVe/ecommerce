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

  const getAddressFromCoordinates = async (
    lat: number,
    lng: number,
  ): Promise<void> => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API no está cargada');
      return;
    }
    let geocoderInstance: google.maps.Geocoder | undefined;

    if (typeof window.google.maps.Geocoder === 'function') {
      geocoderInstance = new window.google.maps.Geocoder();
    } else if (window.google.maps.importLibrary) {
      try {
        // Se carga la librería de geocodificación dinámicamente sin usar "any"
        const geocodingModule = (await window.google.maps.importLibrary(
          'geocoding',
        )) as {
          Geocoder: new () => google.maps.Geocoder;
        };
        geocoderInstance = new geocodingModule.Geocoder();
      } catch (error) {
        console.error('Error al cargar la librería de geocodificación:', error);
        setAddress('Dirección no encontrada');
        return;
      }
    } else {
      console.error(
        'No se encontró el constructor Geocoder en la API de Google Maps',
      );
      setAddress('Dirección no encontrada');
      return;
    }

    const latLng = new window.google.maps.LatLng(lat, lng);
    geocoderInstance.geocode({ location: latLng }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results &&
        results.length > 0
      ) {
        setAddress(results[0].formatted_address || 'Dirección no encontrada');
      } else {
        console.error('No se pudo obtener la dirección:', status);
        setAddress('Dirección no encontrada');
      }
    });
  };

  //actualizar la dirección cada vez que cambien la latitud o longitud.
  useEffect(() => {
    async function updateAddress() {
      await getAddressFromCoordinates(latitude, longitude);
    }
    updateAddress();
  }, [latitude, longitude]);

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <div
      className="z-100 fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-lg bg-white p-6 shadow-xl"
      style={{
        width: '500px',
        height: '600px',
        maxHeight: '600px',
        overflow: 'hidden',
        marginTop: '-60px',
      }}
    >
      <p
        className="mb-4 text-center font-semibold"
        style={{
          fontSize: FontSizes.h3.size,
          color: Colors.textMain,
          marginTop: '20px',
        }}
      >
        Ubica la dirección exacta
      </p>

      {/* Mensaje emergente de guía */}
      {showGuide && guideText && (
        <div className="absolute left-1/2 top-8 flex w-80 -translate-x-1/2 transform items-center justify-between rounded-lg bg-[#34A853] p-4 text-white">
          <span>{guideText}</span>
          <button
            onClick={handleCloseGuide}
            className="ml-2 font-bold text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Componente del mapa */}
      <div className="h-[70%] w-full">
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

      {/* Mostrar coordenadas y dirección */}
      {(latitude || latitude === 0) && (longitude || longitude === 0) && (
        <p className="mt-2 text-center text-gray-600">
          Ubicación seleccionada: Lat: {latitude}, Lng: {longitude}
          <br />
          Dirección: {address || 'Obteniendo dirección...'}
        </p>
      )}

      {/* Botones de acción */}
      <div className="mt-4 flex w-full justify-between gap-4">
        <Button
          variant="white"
          className="w-full border border-transparent text-gray-700"
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          variant="submit"
          className="w-full text-white"
          onClick={() => {
            onAdd({ lat: latitude, lng: longitude }, address);
          }}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
};

export default LocationPopup;
