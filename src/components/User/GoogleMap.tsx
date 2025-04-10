'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
  Circle,
} from '@react-google-maps/api';

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

const GoogleMaps = ({
  radius,
  setLatitude,
  style,
  address,
  setAddress,
  setLongitude,
  latitude,
  longitude,
}: GoogleMapsProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Cargar la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error('Google Maps API is not fully loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results) {
        setAddress(results[0]?.formatted_address || 'Dirección no encontrada');
      } else {
        console.error('No se pudo obtener la dirección:', status);
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
    if (
      map &&
      window.google &&
      window.google.maps &&
      window.google.maps.Geocoder
    ) {
      map.panTo({ lat: latitude, lng: longitude });
      getAddressFromCoordinates(latitude, longitude);
    }
  }, [latitude, longitude, map]);

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const handlePlaceChanged = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();

      if (places && places.length > 0) {
        const place = places[0];

        // Verificación `geometry` y `geometry.location` cuadrante
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setAddress(place.formatted_address || '');
          setLatitude(lat);
          setLongitude(lng);
        } else {
          console.error('Sin cuadrante o ubicación en el lugar seleccionado');
        }
      }
    }
  };

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '60%',
        }}
        center={center}
        zoom={10}
        onLoad={(map) => setMap(map)}
        onClick={changeCoordinate}
      >
        {/* Buscador de ubicación */}
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
          options={{
            fillColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeColor: '#FF0000',
            strokeWeight: 2,
            fillOpacity: 0.35,
          }}
          center={{ lat: latitude, lng: longitude }}
          radius={radius}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;
