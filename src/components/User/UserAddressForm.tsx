'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { Colors } from '@/styles/styles';
import { addressSchema } from '@/lib/validations/userAddressSchema';
import {
  PharmaTech,
  CountryResponse,
  StateResponse,
  CityResponse,
} from '@pharmatech/sdk';

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
}

export default function EditAddressForm({
  initialData,
  onCancel,
  mode = 'edit',
}: EditFormProps) {
  const router = useRouter();
  const pharmaTech = PharmaTech.getInstance(true);

  const [states, setStates] = useState<StateResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(mode === 'create' || !initialData);

  useEffect(() => {
    const loadCountryAndStates = async () => {
      try {
        const countries = await pharmaTech.country.findAll({
          page: 1,
          limit: 100,
        });
        const venezuela = countries.results.find(
          (c: CountryResponse) => c.name.toLowerCase() === 'venezuela',
        );

        if (!venezuela) {
          toast.error('Country Venezuela not found');
          return;
        }

        const statesRes = await pharmaTech.state.findAll({
          page: 1,
          limit: 100,
          countryId: venezuela.id,
        });

        setStates(statesRes.results);
      } catch (err) {
        console.error('Error loading states:', err);
        toast.error('Failed to load states');
      }
    };

    loadCountryAndStates();
  }, [pharmaTech]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const foundState = states.find((s) => s.name === selectedState);
        if (!foundState) return;

        const cityRes = await pharmaTech.city.findAll({
          page: 1,
          limit: 100,
          stateId: foundState.id,
        });

        setCities(cityRes.results);
      } catch (err) {
        console.error('Error loading cities:', err);
      }
    };

    if (selectedState) loadCities();
  }, [selectedState, states, pharmaTech]);

  useEffect(() => {
    if (initialData) {
      setAddress(initialData.address);
      setZipCode(initialData.zipCode);
      setAdditionalInfo(initialData.additionalInformation ?? '');
      setReferencePoint(initialData.referencePoint ?? '');
      setSelectedCity(initialData.nameCity);
      setSelectedState(initialData.nameState);
    }
  }, [initialData]);

  const handleSubmit = async () => {
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

    toast.success('Address saved successfully');
    router.push('/user/address');
  };

  return (
    <div className="mt-14 rounded-lg p-4 md:p-6">
      {!isEditing && mode === 'edit' && (
        <div className="mb-4 flex justify-end">
          <Button
            className="text-sm"
            variant="submit"
            onClick={() => setIsEditing(true)}
          >
            Edit address
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-[48px] gap-y-[16px] md:grid-cols-2">
        <div className="flex flex-col">
          <label
            className="mb-1 font-medium"
            style={{ color: Colors.textMain }}
          >
            State:
          </label>
          <Dropdown
            label="State"
            items={states.map((s) => s.name)}
            onSelect={setSelectedState}
          />
        </div>
        <div className="flex flex-col">
          <label
            className="mb-1 font-medium"
            style={{ color: Colors.textMain }}
          >
            City:
          </label>
          <Dropdown
            label="City"
            items={cities.map((c) => c.name)}
            onSelect={setSelectedCity}
          />
        </div>
      </div>

      <div className="mt-[33px]">
        <Input
          label="Address (Current location)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          helperText={errors.address}
          disabled={!isEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="E.g. Av. Libertador, El Recreo Mall, Local 123"
        />
      </div>

      <div className="mt-[33px] grid grid-cols-1 gap-y-[33px] md:grid-cols-2 md:gap-x-[48px]">
        <Input
          label="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          helperText={errors.zipCode}
          disabled={!isEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="E.g. 1010"
        />
        <Input
          label="Additional Info"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          helperText={errors.additionalInfo}
          disabled={!isEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="E.g. House, Apartment, Office, etc."
        />
      </div>

      <div className="mt-[33px]">
        <Input
          label="Reference Point"
          value={referencePoint}
          onChange={(e) => setReferencePoint(e.target.value)}
          helperText={errors.referencePoint}
          disabled={!isEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          height="134px"
        />
      </div>

      {isEditing && (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
          <Button
            variant="submit"
            className="h-[51px] w-full font-semibold text-white md:w-auto"
            onClick={handleSubmit}
          >
            {mode === 'create' ? 'Next' : 'Save address'}
          </Button>
          {onCancel && (
            <Button
              variant="white"
              className="h-[51px] w-full border border-gray-300 font-semibold text-gray-600 md:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
