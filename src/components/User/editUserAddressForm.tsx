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
    adress: string;
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

export default function EditForm({
  initialData,
  onCancel,
  mode = 'edit',
}: EditFormProps) {
  const router = useRouter();
  const pharmaTech = PharmaTech.getInstance(true);

  const [estados, setEstados] = useState<StateResponse[]>([]);
  const [ciudades, setCiudades] = useState<CityResponse[]>([]);

  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [informacionAdicional, setInformacionAdicional] = useState('');
  const [puntoReferencia, setPuntoReferencia] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [onEditing, setOnEditing] = useState(mode === 'create' || !initialData);

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
          toast.error('No se encontró el país Venezuela');
          return;
        }

        const statesRes = await pharmaTech.state.findAll({
          page: 1,
          limit: 100,
          countryId: venezuela.id,
        });

        setEstados(statesRes.results);
      } catch (err) {
        console.error('Error cargando países/estados:', err);
        toast.error('No se pudieron cargar los estados');
      }
    };

    loadCountryAndStates();
  }, [pharmaTech.country, pharmaTech.state]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const selectedState = estados.find((s) => s.name === estado);
        if (!selectedState) return;

        const cityRes = await pharmaTech.city.findAll({
          page: 1,
          limit: 100,
          stateId: selectedState.id,
        });

        setCiudades(cityRes.results);
      } catch (err) {
        console.error('Error cargando ciudades', err);
      }
    };

    if (estado) loadCities();
  }, [estado, estados, pharmaTech.city]);

  useEffect(() => {
    if (initialData) {
      setDireccion(initialData.adress);
      setCodigoPostal(initialData.zipCode);
      setInformacionAdicional(initialData.additionalInformation ?? '');
      setPuntoReferencia(initialData.referencePoint ?? '');
      setCiudad(initialData.nameCity);
      setEstado(initialData.nameState);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const result = addressSchema.safeParse({
      estado,
      ciudad,
      direccion,
      codigoPostal,
      informacionAdicional,
      puntoReferencia,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        estado: fieldErrors.estado?.[0] ?? '',
        ciudad: fieldErrors.ciudad?.[0] ?? '',
        direccion: fieldErrors.direccion?.[0] ?? '',
        codigoPostal: fieldErrors.codigoPostal?.[0] ?? '',
        informacionAdicional: fieldErrors.informacionAdicional?.[0] ?? '',
        puntoReferencia: fieldErrors.puntoReferencia?.[0] ?? '',
      });
      return;
    }

    toast.success('Dirección guardada correctamente');
    router.push('/user/address');
  };

  return (
    <div className="mt-14 rounded-lg p-4 md:p-6">
      {!onEditing && mode === 'edit' && (
        <div className="mb-4 flex justify-end">
          <Button
            className="text-sm"
            variant="submit"
            onClick={() => setOnEditing(true)}
          >
            Editar dirección
          </Button>
        </div>
      )}

      {/* Estado y Ciudad */}
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
            items={estados.map((s) => s.name)}
            onSelect={setEstado}
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
            items={ciudades.map((c) => c.name)}
            onSelect={setCiudad}
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="mt-[33px]">
        <Input
          label="Dirección*:(Ubicación actual)"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          helperText={errors.direccion}
          disabled={!onEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej: Av. Libertador, Centro Comercial El Recreo, Local 123"
        />
      </div>

      {/* Código Postal e Información Adicional */}
      <div className="mt-[33px] grid grid-cols-1 gap-y-[33px] md:grid-cols-2 md:gap-x-[48px]">
        <Input
          label="Código Postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          helperText={errors.codigoPostal}
          disabled={!onEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej: 1010"
        />
        <Input
          label="Información Adicional"
          value={informacionAdicional}
          onChange={(e) => setInformacionAdicional(e.target.value)}
          helperText={errors.informacionAdicional}
          disabled={!onEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          placeholder="Ej: Casa, Apartamento, Oficina, etc."
        />
      </div>

      {/* Punto de Referencia */}
      <div className="mt-[33px]">
        <Input
          label="Punto de Referencia"
          value={puntoReferencia}
          onChange={(e) => setPuntoReferencia(e.target.value)}
          helperText={errors.puntoReferencia}
          disabled={!onEditing}
          borderColor="#f3f4f6"
          helperTextColor="red-500"
          height="134px"
        />
      </div>

      {/* Botón */}
      {onEditing && (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
          <Button
            variant="submit"
            className="h-[51px] w-full font-semibold text-white md:w-auto"
            onClick={handleSubmit}
          >
            {mode === 'create' ? 'Siguiente' : 'Guardar dirección'}
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
        </div>
      )}
    </div>
  );
}
