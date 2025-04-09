'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import DatePicker1 from '@/components/Calendar';
import { editProfileSchema } from '@/lib/validations/registerSchema';
import { PharmaTech } from '@pharmatech/sdk';
import { useAuth } from '@/context/AuthContext';

enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

function formatBirthDate(value: unknown): string {
  if (typeof value === 'string') {
    const normalized = value.includes('/') ? value.replace(/\//g, '-') : value;
    const [year, month, day] = normalized.split('-');
    return `${year}-${month}-${day}`;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
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
      setPhoneNumber(userData.phoneNumber ?? '');
      setBirthDate(formatBirthDate(userData.profile?.birthDate));
      setGender(
        userData.profile?.gender === 'f' ? UserGender.FEMALE : UserGender.MALE,
      );
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!userData?.email) {
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

    if (!token || !userData?.id) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    const payload = {
      firstName,
      lastName,
      email: userData.email,
      phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber,
      birthDate,
      gender,
      role: UserRole.CUSTOMER,
      profilePicture: userData.profile?.profilePicture ?? undefined,
    };

    try {
      await pharmaTech.user.update(userData.id, payload, token);
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
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            helperText={errors.firstName}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            helperText={errors.lastName}
            borderColor="#f3f4f6"
            helperTextColor="red-500"
          />
          <Input
            label="Email"
            value={userData?.email ?? ''}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />
          <Input
            label="Document ID"
            value={userData?.documentId ?? ''}
            onChange={() => {}}
            disabled
            borderColor="#f3f4f6"
          />
          <Input
            label="Phone Number"
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
            Gender
          </label>
          <div className="flex gap-4">
            <RadioButton
              text="Male"
              selected={gender === UserGender.MALE}
              onSelect={() => setGender(UserGender.MALE)}
            />
            <RadioButton
              text="Female"
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
