'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { registerSchema } from '@/lib/validations/registerSchema';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import Image from 'next/image';
import Calendar from '@/components/Calendar';
import { Colors } from '@/styles/styles';
import RadioButton from '@/components/RadioButton';
import theme from '@/styles/styles';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';

export default function RegisterForm() {
  const { token, login } = useAuth();
  const router = useRouter();

  // Redirigir al home si ya hay sesión activa
  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    documentId: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    documentId: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

  const handleGenderClick = (gender: 'hombre' | 'mujer') => {
    if (formData.gender !== gender) {
      setFormData({ ...formData, gender: gender });
      setErrors({ ...errors, gender: '' });
    }
  };

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, birthDate: date });
    setErrors({ ...errors, birthDate: '' });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setGeneralError(null);

      const result = registerSchema.safeParse(formData);
      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        setErrors({
          firstName: fieldErrors.firstName?.[0] ?? '',
          lastName: fieldErrors.lastName?.[0] ?? '',
          email: fieldErrors.email?.[0] ?? '',
          documentId: fieldErrors.documentId?.[0] ?? '',
          phoneNumber: fieldErrors.phoneNumber?.[0] ?? '',
          birthDate: fieldErrors.birthDate?.[0] ?? '',
          gender: fieldErrors.gender?.[0] ?? '',
          password: fieldErrors.password?.[0] ?? '',
          confirmPassword: fieldErrors.confirmPassword?.[0] ?? '',
        });
        setLoading(false);
        return;
      }

      enum UserGender {
        MALE = 'm',
        FEMALE = 'f',
      }

      let mappedGender: UserGender | null = null;

      if (formData.gender === 'hombre') {
        mappedGender = UserGender.MALE;
      } else if (formData.gender === 'mujer') {
        mappedGender = UserGender.FEMALE;
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        documentId: formData.documentId,
        birthDate: formData.birthDate,
        phoneNumber:
          formData.phoneNumber.trim() !== '' ? formData.phoneNumber : null,
        gender: mappedGender,
      };

      try {
        const response = await api.auth.signUp(payload);
        console.log('SignUp response:', response);
        toast.success('Cuenta creada correctamente');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          documentId: '',
          phoneNumber: '',
          birthDate: '',
          gender: '',
          password: '',
          confirmPassword: '',
        });

        const loginResponse = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });

        login(loginResponse.accessToken, false);
        router.push('/');
      } catch (err) {
        console.error('Error creating account:', err);
        setGeneralError('Error al crear la cuenta. Intenta de nuevo.');
        toast.error('Error al crear la cuenta, intenta nuevamente por favor.');
      } finally {
        setLoading(false);
      }
    },
    [formData, router, login],
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          const activeElement = document.activeElement as HTMLElement;
          if (
            activeElement.tagName === 'BUTTON' &&
            activeElement.closest('.calendar-container')
          ) {
            e.preventDefault();
            return;
          }

          handleSubmit(e);
        }}
        className="w-full space-y-4"
      >
        <h2 className="text-left text-2xl text-gray-800">Crea tu cuenta</h2>
        <p className="text-left text-gray-600">
          Rellena los datos del formulario y comienza a comprar con Pharmatech
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Nombre"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.firstName ? 'visible' : 'invisible'}`}
            >
              {errors.firstName}
            </p>
          </div>
          <div>
            <Input
              label="Apellido"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.lastName ? 'visible' : 'invisible'}`}
            >
              {errors.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Correo electrónico"
              placeholder="user@pharmatech.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.email ? 'visible' : 'invisible'}`}
            >
              {errors.email}
            </p>
          </div>
          <div>
            <Input
              label="Cédula"
              placeholder="12345678"
              value={formData.documentId}
              onChange={handleInputChange('documentId')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.documentId ? 'visible' : 'invisible'}`}
            >
              {errors.documentId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Input
              label="Número de teléfono"
              placeholder="584141234567"
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.phoneNumber ? 'visible' : 'invisible'}`}
            >
              {errors.phoneNumber}
            </p>
          </div>
          <div>
            <label className="mb-1 block font-medium text-[#666666]">
              Fecha de nacimiento
            </label>
            <div
              className="relative"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'BUTTON') {
                  e.preventDefault();
                }
              }}
            >
              <div className="calendar-container relative z-50 rounded-md bg-white md:mb-1">
                <Calendar onDateSelect={handleDateSelect} />
              </div>
            </div>
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.birthDate ? 'visible' : 'invisible'}`}
            >
              {errors.birthDate}
            </p>
          </div>
          <div>
            <label className="mb-3 block font-medium text-[#666666]">
              Género
            </label>
            <div className="flex gap-6">
              <RadioButton
                text="Hombre"
                selected={formData.gender === 'hombre'}
                onSelect={() => handleGenderClick('hombre')}
              />
              <RadioButton
                text="Mujer"
                selected={formData.gender === 'mujer'}
                onSelect={() => handleGenderClick('mujer')}
              />
            </div>
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.gender ? 'visible' : 'invisible'}`}
            >
              {errors.gender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              showPasswordToggle
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.password ? 'visible' : 'invisible'}`}
            >
              {errors.password}
            </p>
          </div>
          <div>
            <Input
              label="Repetir contraseña"
              placeholder="Confirma tu contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              showPasswordToggle
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${errors.confirmPassword ? 'visible' : 'invisible'}`}
            >
              {errors.confirmPassword}
            </p>
          </div>
        </div>

        {generalError && (
          <p className="min-h-[16px] text-xs text-red-500">{generalError}</p>
        )}

        <Button variant="submit" className="w-full py-3" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </Button>
      </form>

      <div className="mt-4">
        <Button
          variant="white"
          className="flex w-full items-center justify-center gap-2 py-3"
        >
          <Image
            src="/images/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Crear cuenta con Google
        </Button>
      </div>

      <p className="mt-4 text-left text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          className="text-blue-500 hover:underline"
          style={{
            fontSize: theme.FontSizes.b3.size,
            color: theme.Colors.secondaryLight,
          }}
        >
          Ingresa aquí
        </a>
      </p>
    </>
  );
}
