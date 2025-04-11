'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
  Circle,
  Libraries,
} from '@react-google-maps/api';
import { parsePlaceFromSearchBox } from '@/lib/utils/helpers/parsePlaceFromSearchBox';

interface GoogleMapsProps {
  radius: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  latitude: number;
  longitude: number;
  style?: string;
}

// ✅ Constante para evitar recarga innecesaria del script
const GOOGLE_MAP_LIBRARIES: Libraries = ['places'];

const GoogleMaps = ({
  radius,
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  address,
  setAddress,
  style,
}: GoogleMapsProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (!window.google?.maps?.Geocoder) {
      console.error('Google Maps API no está completamente cargado');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results?.length) {
        setAddress(results[0]?.formatted_address || 'Dirección no encontrada');
      } else {
        console.error('Error obteniendo dirección:', status);
        setAddress('Dirección no encontrada');
      }
    });
  };

  const changeCoordinate = (coord: google.maps.MapMouseEvent) => {
    const { latLng } = coord;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
      getAddressFromCoordinates(lat, lng);
    }
  };

  useEffect(() => {
    if (map && window.google?.maps?.Geocoder) {
      map.panTo({ lat: latitude, lng: longitude });
      getAddressFromCoordinates(latitude, longitude);
    }
  }, [latitude, longitude, map]);

  const handlePlaceChanged = () => {
    parsePlaceFromSearchBox({
      ref: inputRef.current,
      setLatitude,
      setLongitude,
      setAddress,
    });
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '60%' }}
        center={center}
        zoom={10}
        onLoad={(map) => setMap(map)}
        onClick={changeCoordinate}
      >
        <StandaloneSearchBox
          onLoad={(ref) => (inputRef.current = ref)}
          onPlacesChanged={handlePlaceChanged}
        >
          <div className="relative ml-48 w-[500px]">
            <input
              type="text"
              className={`form-control rounded-full bg-white text-black ${style}`}
              value={address}
              placeholder="Buscar ubicación"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </StandaloneSearchBox>

        <Marker
          draggable
          position={{ lat: latitude, lng: longitude }}
          onDragEnd={changeCoordinate}
        />

        <Circle
          center={{ lat: latitude, lng: longitude }}
          radius={radius}
          options={{
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0.35,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;
