'use client';
import { useEffect, useState } from 'react';

export function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('No se pudo obtener la ubicación:', err);
        },
      );
    }
  }, []);

  return location;
}
