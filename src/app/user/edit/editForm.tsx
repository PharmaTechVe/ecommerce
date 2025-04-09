'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import DatePicker1 from '@/components/Calendar';
import { editProfileSchema } from '@/lib/validations/registerSchema';
import { PharmaTech } from '@pharmatech/sdk';

enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  // agrega más roles si el backend los maneja
}

function formatBirthDate(rawDate: unknown): string {
  if (typeof rawDate === 'string') {
    const normalized = rawDate.includes('/')
      ? rawDate.replace(/\//g, '-')
      : rawDate;
    const parts = normalized.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${year}-${month}-${day}`;
    }
    return normalized;
  }

  if (rawDate instanceof Date) {
    return rawDate.toISOString().slice(0, 10);
  }

  return '';
}

interface EditFormProps {
  onCancel?: () => void;
}

export default function EditForm({}: EditFormProps) {
  const { userData, token } = useAuth();
  const router = useRouter();
  const pharmaTech = PharmaTech.getInstance(true);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState<UserGender>(UserGender.MALE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData) {
      setNombre(userData.firstName);
      setApellido(userData.lastName);
      setTelefono(userData.phoneNumber ?? '');
      setFechaNacimiento(formatBirthDate(userData.profile?.birthDate));
      setGenero(
        userData.profile?.gender === 'f' ? UserGender.FEMALE : UserGender.MALE,
      );
    }
  }, [userData]);

  const handleSubmit = async () => {
    console.log('[EDIT USER] Intentando enviar formulario...');

    if (!userData?.email) {
      toast.error('El correo del usuario no está disponible.');
      return;
    }

    const generoTexto = genero === UserGender.FEMALE ? 'mujer' : 'hombre';

    const result = editProfileSchema.safeParse({
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      genero: generoTexto,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      console.warn('[ERRORES DE VALIDACIÓN]', fieldErrors);

      setErrors({
        nombre: fieldErrors.nombre?.[0] ?? '',
        apellido: fieldErrors.apellido?.[0] ?? '',
        telefono: fieldErrors.telefono?.[0] ?? '',
        fechaNacimiento: fieldErrors.fechaNacimiento?.[0] ?? '',
        genero: fieldErrors.genero?.[0] ?? '',
      });
      return;
    }

    if (!token || !userData?.id) {
      console.error('[ERROR] Token o userData.id está vacío:', {
        token,
        userId: userData?.id,
      });
      toast.error(
        'Error de autenticación. Intenta cerrar sesión y volver a entrar.',
      );
      return;
    }

    const payload = {
      firstName: nombre,
      lastName: apellido,
      email: userData.email,
      phoneNumber: telefono?.trim() === '' ? undefined : telefono,
      birthDate: fechaNacimiento,
      gender: genero,
      role: UserRole.CUSTOMER,
      profilePicture: userData.profile?.profilePicture ?? undefined,
    };

    try {
      await pharmaTech.user.update(userData.id, payload, token);
      toast.success('Perfil actualizado correctamente');

      setTimeout(() => {
        router.push('/user');
      }, 1000);
    } catch (error: unknown) {
      console.error('[ERROR AL ACTUALIZAR PERFIL]', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="mt-14 rounded-lg p-4 md:p-6">
      <div className="mx-auto w-full max-w-[956px]">
        <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            helperText={errors.nombre}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            helperText={errors.apellido}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Correo Electrónico"
            value={userData?.email ?? ''}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />
          <Input
            label="Cédula"
            value={userData?.documentId ?? ''}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />

          {/* Teléfono y Fecha de nacimiento en la misma fila */}
          <Input
            label="Número de teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            helperText={errors.telefono}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Fecha de nacimiento
            </label>
            <DatePicker1
              value={fechaNacimiento}
              onDateSelect={(date) => setFechaNacimiento(date)}
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.fechaNacimiento ? 'visible' : 'invisible'
              }`}
            >
              {errors.fechaNacimiento}
            </p>
          </div>
        </div>

        <div className="mt-6 pb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Género
          </label>
          <div className="flex gap-4">
            <RadioButton
              text="Hombre"
              selected={genero === UserGender.MALE}
              onSelect={() => setGenero(UserGender.MALE)}
            />
            <RadioButton
              text="Mujer"
              selected={genero === UserGender.FEMALE}
              onSelect={() => setGenero(UserGender.FEMALE)}
            />
          </div>
          <p
            className={`min-h-[16px] text-xs text-red-500 ${
              errors.genero ? 'visible' : 'invisible'
            }`}
          >
            {errors.genero}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
          <Button
            variant="submit"
            className="h-[51px] w-full font-semibold text-white md:w-auto"
            onClick={handleSubmit}
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
