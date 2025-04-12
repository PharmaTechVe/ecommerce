'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { Colors } from '@/styles/styles';
import { addressSchema } from '@/lib/validations/userAddressSchema';
import { CountryResponse, StateResponse, CityResponse } from '@pharmatech/sdk';
import { api } from '@/lib/sdkConfig';
import LocationPopup from '@/components/GoogleMap/UserAddressPopup';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface EditFormProps {
  initialData?: {
    address: string;
    zipCode: string;
    additionalInformation?: string;
    referencePoint?: string;
    nameCity: string;
    nameState: string;
    cityId: string;
    id: string;
  };
  onCancel?: () => void;
  mode?: 'edit' | 'create';
  onSubmit?: (data: {
    id?: string;
    address: string;
    zipCode: string;
    additionalInfo: string;
    referencePoint: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    cityId: string;
  }) => void;
  onAdd?: () => void;
}

export default function EditAddressForm({
  initialData,
  onCancel,
  mode = 'create',
  onSubmit,
}: EditFormProps) {
  const [states, setStates] = useState<StateResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(mode === 'create' || !initialData);

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const loadCountryAndStates = async () => {
      try {
        const countries = await api.country.findAll({ page: 1, limit: 100 });
        const venezuela = countries.results.find(
          (c: CountryResponse) => c.name.toLowerCase() === 'venezuela',
        );
        if (!venezuela) {
          toast.error('País Venezuela no encontrado');
          return;
        }
        const statesRes = await api.state.findAll({
          page: 1,
          limit: 100,
          countryId: venezuela.id,
        });
        setStates(statesRes.results);
      } catch (err) {
        console.error('Error cargando estados:', err);
        toast.error('No se pudieron cargar los estados');
      }
    };
    loadCountryAndStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const foundState = states.find((s) => s.name === selectedState);
        if (!foundState) return;

        const cityRes = await api.city.findAll({
          page: 1,
          limit: 100,
          stateId: foundState.id,
        });

        const cityList = cityRes.results;
        setCities(cityList);

        if (selectedCity) {
          const foundCity = cityList.find((c) => c.name === selectedCity);
          if (foundCity) setSelectedCityId(foundCity.id);
        }
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    };

    if (selectedState) loadCities();
  }, [selectedState, states, selectedCity]);

  useEffect(() => {
    if (initialData) {
      setAddress(initialData.address);
      setZipCode(initialData.zipCode);
      setAdditionalInfo(initialData.additionalInformation ?? '');
      setReferencePoint(initialData.referencePoint ?? '');
      setSelectedCity(initialData.nameCity);
      setSelectedState(initialData.nameState);
      setSelectedCityId(initialData.cityId);
    }
  }, [initialData]);

  const handleLocationAdded = (
    location: { lat: number; lng: number },
    selectedAddress: string,
  ) => {
    setLatitude(location.lat);
    setLongitude(location.lng);
    setAddress(selectedAddress);
    setShowLocationPopup(false);
  };

  const handleNextClick = async () => {
    const result = addressSchema.safeParse({
      state: selectedState,
      city: selectedCity,
      address,
      zipCode,
      additionalInfo,
      referencePoint,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        state: fieldErrors.state?.[0] ?? '',
        city: fieldErrors.city?.[0] ?? '',
        address: fieldErrors.address?.[0] ?? '',
        zipCode: fieldErrors.zipCode?.[0] ?? '',
        additionalInfo: fieldErrors.additionalInfo?.[0] ?? '',
        referencePoint: fieldErrors.referencePoint?.[0] ?? '',
      });
      return;
    }

    if (latitude === null || longitude === null || !selectedCityId) {
      toast.error('Debes seleccionar una ciudad y ubicación en el mapa');
      return;
    }

    if (onSubmit) {
      onSubmit({
        ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
        address,
        zipCode,
        additionalInfo,
        referencePoint,
        state: selectedState,
        city: selectedCity,
        latitude,
        longitude,
        cityId: selectedCityId,
      });
    }
  };

  return (
    <div className="mt-14 rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 gap-x-[48px] gap-y-[16px] md:grid-cols-2">
        <div className="flex flex-col">
          <label
            className="mb-1 font-medium"
            style={{ color: Colors.textMain }}
          >
            Estado:
          </label>
          <Dropdown
            label="Estado"
            items={states.map((s) => s.name)}
            onSelect={setSelectedState}
            value={selectedState}
          />
        </div>
        <div className="flex flex-col">
          <label
            className="mb-1 font-medium"
            style={{ color: Colors.textMain }}
          >
            Ciudad:
          </label>
          <Dropdown
            label="Ciudad"
            items={cities.map((c) => c.name)}
            value={selectedCity}
            onSelect={(cityName) => {
              setSelectedCity(cityName);
              const foundCity = cities.find((c) => c.name === cityName);
              if (foundCity) setSelectedCityId(foundCity.id);
              else setSelectedCityId(null);
            }}
          />
        </div>
      </div>

      <div className="relative mt-[33px]">
        <Input
          label="Dirección: (Ubicación actual)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          helperText={errors.address}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej. Av. Libertador, El Recreo Mall, Local 123"
        />
        <MapPinIcon
          className="absolute right-4 top-1/2 mb-4 -translate-y-1/2 transform cursor-pointer text-gray-600"
          width={24}
          height={24}
          onClick={() => setShowLocationPopup(true)}
        />
      </div>

      <div className="mt-[33px] grid grid-cols-1 gap-y-[33px] md:grid-cols-2 md:gap-x-[48px]">
        <Input
          label="Código postal"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          helperText={errors.zipCode}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej. 1010"
        />
        <Input
          label="Información adicional"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          helperText={errors.additionalInfo}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej. casa, oficina, etc."
        />
      </div>

      <div className="mt-[33px]">
        <Input
          label="Punto de referencia"
          value={referencePoint}
          onChange={(e) => setReferencePoint(e.target.value)}
          helperText={errors.referencePoint}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          height="134px"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
        {isEditing ? (
          <>
            <Button
              variant="submit"
              className="h-[51px] w-full font-semibold text-white md:w-auto"
              onClick={handleNextClick}
            >
              {mode === 'create' ? 'Siguiente' : 'Guardar Cambios'}
            </Button>
            {onCancel && (
              <Button
                variant="white"
                className="h-[51px] w-full border border-gray-300 font-semibold text-gray-600 md:w-auto"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="submit"
            className="h-[51px] w-full font-semibold text-white md:w-auto"
            onClick={() => setIsEditing(true)}
          >
            Actualizar dirección
          </Button>
        )}
      </div>

      {showLocationPopup && (
        <LocationPopup
          onAdd={handleLocationAdded}
          onBack={() => setShowLocationPopup(false)}
          guideText="Mueve el pin hasta tu ubicación exacta"
        />
      )}
    </div>
  );
}
