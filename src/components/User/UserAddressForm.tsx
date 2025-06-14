'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { Colors } from '@/styles/styles';
import { addressSchema } from '@/lib/validations/userAddressSchema';
import {
  CountryResponse,
  StateResponse,
  CityResponse,
  UserAddressResponse,
} from '@pharmatech/sdk';
import { api } from '@/lib/sdkConfig';
import LocationPopup from '@/components/GoogleMap/UserAddressPopup';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface EditFormProps {
  initialData?: UserAddressResponse;
  mode?: 'edit' | 'create';
  onAdd?: () => void;
}

export default function EditAddressForm({
  initialData,
  mode = 'create',
}: EditFormProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const [states, setStates] = useState<StateResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

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
      setAddress(initialData.adress);
      setAdditionalInfo(initialData.additionalInformation ?? '');
      setReferencePoint(initialData.referencePoint ?? '');
      setSelectedCity(initialData.nameCity);
      setSelectedState(initialData.nameState);
      setSelectedCityId(initialData.cityId);
      setLatitude(initialData.latitude ?? 0);
      setLongitude(initialData.longitude ?? 0);
    }
  }, [initialData]);

  const handleLocationAdded = (location: { lat: number; lng: number }) => {
    setLatitude(location.lat);
    setLongitude(location.lng);
    setShowLocationPopup(false);
  };

  const handleSubmit = async () => {
    if (!user?.sub || !token) {
      toast.error('Sesión inválida. Inicia sesión nuevamente.');
      return;
    }
    const result = addressSchema.safeParse({
      state: selectedState,
      city: selectedCity,
      address,
      additionalInfo,
      referencePoint,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        state: fieldErrors.state?.[0] ?? '',
        city: fieldErrors.city?.[0] ?? '',
        address: fieldErrors.address?.[0] ?? '',
        additionalInfo: fieldErrors.additionalInfo?.[0] ?? '',
        referencePoint: fieldErrors.referencePoint?.[0] ?? '',
      });
      return;
    }

    if (!selectedCityId) {
      toast.error('Debes seleccionar una ciudad válida');
      return;
    }

    if (latitude == 0 || longitude == 0) {
      setShowLocationPopup(true);
      return;
    }

    const addressData = {
      adress: address,
      additionalInformation: additionalInfo,
      referencePoint: referencePoint,
      latitude: latitude,
      longitude: longitude,
      cityId: selectedCityId,
    };

    if (mode == 'create') {
      try {
        await api.userAdress.createAddress(user.sub, addressData, token);
        toast.success('Dirección creada exitosamente');
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/user/address');
        }
      } catch (error) {
        console.error('Error creando dirección:', error);
        toast.error('Hubo un error al crear la dirección');
      }
    } else {
      if (!initialData) {
        toast.error('No se pudo encontrar la dirección a actualizar');
        return;
      }
      const updateData = {
        ...addressData,
        id: initialData?.id,
      };
      try {
        await api.userAdress.update(user.sub, updateData, updateData.id, token);
        toast.success('Dirección actualizada');
        router.push('/user/address');
      } catch (err) {
        console.error('Error actualizando dirección:', err);
        toast.error('No se pudo actualizar la dirección.');
      }
    }
  };

  return (
    <div className="rounded-lg p-4 md:p-6">
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
          className="absolute right-4 top-1/2 mt-3 -translate-y-1/2 transform cursor-pointer text-gray-600"
          width={24}
          height={24}
          onClick={() => setShowLocationPopup(true)}
        />
      </div>

      <div className="mt-[33px]">
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
        <Button
          variant="submit"
          className="h-[51px] w-full font-semibold text-white md:w-auto"
          onClick={handleSubmit}
        >
          {mode === 'create' ? 'Crear Dirección' : 'Actualizar Dirección'}
        </Button>
      </div>

      {showLocationPopup && (
        <LocationPopup
          onAdd={handleLocationAdded}
          onBack={() => setShowLocationPopup(false)}
          latitude={latitude ? latitude : 10.066785}
          longitude={longitude ? longitude : -69.362805}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      )}
    </div>
  );
}
