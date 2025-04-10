'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import DatePicker1 from '@/components/Calendar';
import { editProfileSchema } from '@/lib/validations/registerSchema';
import { api } from '@/lib/sdkConfig';
import { useAuth } from '@/context/AuthContext';

enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  role?: string;
  profile: {
    birthDate: string | Date;
    gender: UserGender;
    profilePicture?: string;
  };
};

interface EditFormProps {
  onCancel?: () => void;
  userData: UserProfile;
}

export default function EditForm({ userData }: EditFormProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<UserGender>(UserGender.MALE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setPhoneNumber(userData.phoneNumber);
      setBirthDate(
        typeof userData.profile.birthDate === 'string'
          ? userData.profile.birthDate
          : userData.profile.birthDate.toISOString().slice(0, 10),
      );
      setGender(userData.profile.gender);
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!user?.email) {
      toast.error('Email is not available.');
      return;
    }

    const genderText = gender === UserGender.FEMALE ? 'mujer' : 'hombre';

    const result = editProfileSchema.safeParse({
      nombre: firstName,
      apellido: lastName,
      telefono: phoneNumber,
      fechaNacimiento: birthDate,
      genero: genderText,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        firstName: fieldErrors.nombre?.[0] ?? '',
        lastName: fieldErrors.apellido?.[0] ?? '',
        phoneNumber: fieldErrors.telefono?.[0] ?? '',
        birthDate: fieldErrors.fechaNacimiento?.[0] ?? '',
        gender: fieldErrors.genero?.[0] ?? '',
      });
      return;
    }

    if (!token || !user?.sub) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    const payload = {
      firstName,
      lastName,
      email: user.email,
      phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber,
      birthDate,
      gender,
      role: userData.role as UserRole,
      profilePicture: userData.profile?.profilePicture ?? undefined,
    };

    try {
      await api.user.update(user.sub, payload, token);
      toast.success('Perfil Actualizado exitosamente');

      setTimeout(() => {
        router.push('/user');
      }, 1000);
    } catch (error: unknown) {
      console.error('[UPDATE PROFILE ERROR]', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar. Intente de nuevo.';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="mt-14 rounded-lg p-4 md:p-6">
      <div className="mx-auto w-full max-w-[956px]">
        <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
          <Input
            label="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            helperText={errors.firstName}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            helperText={errors.lastName}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Correo"
            value={user?.email ?? ''}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />
          <Input
            label="Cédula"
            value={userData.documentId}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />
          <Input
            label="telefono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            helperText={errors.phoneNumber}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Birth Date
            </label>
            <DatePicker1
              value={birthDate}
              onDateSelect={(date) => setBirthDate(date)}
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.birthDate ? 'visible' : 'invisible'
              }`}
            >
              {errors.birthDate}
            </p>
          </div>
        </div>

        <div className="mt-6 pb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Genero
          </label>
          <div className="flex gap-4">
            <RadioButton
              text="Hombre"
              selected={gender === UserGender.MALE}
              onSelect={() => setGender(UserGender.MALE)}
            />
            <RadioButton
              text="género"
              selected={gender === UserGender.FEMALE}
              onSelect={() => setGender(UserGender.FEMALE)}
            />
          </div>
          <p
            className={`min-h-[16px] text-xs text-red-500 ${
              errors.gender ? 'visible' : 'invisible'
            }`}
          >
            {errors.gender}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
          <Button
            variant="submit"
            className="h-[51px] w-full font-semibold text-white md:w-auto"
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
