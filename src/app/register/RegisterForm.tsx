'use client';
import { api } from '@/lib/sdkConfig';
import React, { useState, useCallback } from 'react';
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

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

  const handleGenderClick = (gender: 'hombre' | 'mujer') => {
    if (formData.genero !== gender) {
      setFormData({ ...formData, genero: gender });
      setErrors({ ...errors, genero: '' });
    }
  };
  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, fechaNacimiento: date });
    setErrors({ ...errors, fechaNacimiento: '' });
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
          nombre: fieldErrors.nombre?.[0] ?? '',
          apellido: fieldErrors.apellido?.[0] ?? '',
          email: fieldErrors.email?.[0] ?? '',
          cedula: fieldErrors.cedula?.[0] ?? '',
          telefono: fieldErrors.telefono?.[0] ?? '',
          fechaNacimiento: fieldErrors.fechaNacimiento?.[0] ?? '',
          genero: fieldErrors.genero?.[0] ?? '',
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

      const mappedGender: UserGender =
        formData.genero === 'hombre'
          ? UserGender.MALE
          : formData.genero === 'mujer'
            ? UserGender.FEMALE
            : (() => {
                throw new Error('Invalid gender');
              })();

      const payload = {
        firstName: formData.nombre,
        lastName: formData.apellido,
        email: formData.email,
        password: formData.password,
        documentId: formData.cedula,
        phoneNumber: formData.telefono,
        birthDate: formData.fechaNacimiento,
        gender: mappedGender,
      };

      try {
        const response = await api.auth.signUp(payload);
        console.log('SignUp response:', response);
        toast.success('Cuenta creada correctamente');
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          cedula: '',
          telefono: '',
          fechaNacimiento: '',
          genero: '',
          password: '',
          confirmPassword: '',
        });
        const loginResponse = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });
        console.log('Access token:', loginResponse.accessToken);
        localStorage.setItem('pharmatechToken', loginResponse.accessToken);
        router.push('/');
      } catch (err) {
        console.error('Error creating account:', err);
        setGeneralError('Error al crear la cuenta. Intenta de nuevo.');
        toast.error('Error al crear la cuenta, intenta nuevamente por favor.');
      } finally {
        setLoading(false);
      }
    },
    [formData, router],
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          const activeElement = document.activeElement as HTMLElement;

          // Verifica si el elemento activo es un botón dentro del Calendar
          if (
            activeElement.tagName === 'BUTTON' &&
            activeElement.closest('.calendar-container')
          ) {
            e.preventDefault(); // Evita el envío del formulario
            return;
          }

          handleSubmit(e); // Llama al manejador original si no es un botón del Calendar
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
              value={formData.nombre}
              onChange={handleInputChange('nombre')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.nombre ? 'visible' : 'invisible'
              }`}
            >
              {errors.nombre}
            </p>
          </div>
          <div>
            <Input
              label="Apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleInputChange('apellido')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.apellido ? 'visible' : 'invisible'
              }`}
            >
              {errors.apellido}
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
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.email ? 'visible' : 'invisible'
              }`}
            >
              {errors.email}
            </p>
          </div>
          <div>
            <Input
              label="Cédula"
              placeholder="12345678"
              value={formData.cedula}
              onChange={handleInputChange('cedula')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.cedula ? 'visible' : 'invisible'
              }`}
            >
              {errors.cedula}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Input
              label="Número de teléfono"
              placeholder="+584141234567"
              value={formData.telefono}
              onChange={handleInputChange('telefono')}
              borderColor={Colors.stroke}
              borderSize="1px"
            />
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.telefono ? 'visible' : 'invisible'
              }`}
            >
              {errors.telefono}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Fecha de nacimiento
            </label>
            <div
              className="relative"
              onClick={(e) => {
                const target = e.target as HTMLElement;

                // Verifica si el clic proviene de un botón dentro del Calendar
                if (target.tagName === 'BUTTON') {
                  e.preventDefault(); // Evita que el formulario se envíe
                }
              }}
            >
              <div className="calendar-container relative z-50 rounded-md bg-white md:mb-1">
                <Calendar onDateSelect={handleDateSelect} />
              </div>
            </div>
            <p
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.fechaNacimiento ? 'visible' : 'invisible'
              }`}
            >
              {errors.fechaNacimiento}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Género
            </label>
            <div className="flex gap-6">
              <RadioButton
                text="Hombre"
                selected={formData.genero === 'hombre'}
                onSelect={() => handleGenderClick('hombre')}
              />
              <RadioButton
                text="Mujer"
                selected={formData.genero === 'mujer'}
                onSelect={() => handleGenderClick('mujer')}
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
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.password ? 'visible' : 'invisible'
              }`}
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
              className={`min-h-[16px] text-xs text-red-500 ${
                errors.confirmPassword ? 'visible' : 'invisible'
              }`}
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
