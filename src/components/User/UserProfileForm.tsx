'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import DatePicker1 from '@/components/Calendar';
import Avatar from '@/components/Avatar';
import { Colors } from '@/styles/styles';
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
  userData: UserProfile;
  isEditing?: boolean;
  setIsEditing?: (val: boolean) => void;
}

export default function EditForm({
  userData,
  isEditing = false,
  setIsEditing,
}: EditFormProps) {
  const { user, token } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [editing, setEditing] = useState(isEditing);
  const [gender, setGender] = useState<UserGender>(UserGender.MALE);
  const [profilePicture, setProfilePicture] = useState(
    userData.profile.profilePicture || '',
  );
  const [uploading, setUploading] = useState(false);
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
  const handleImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const res = await fetch('/api/sign-cloudinary');
      const { signature, timestamp, apiKey, cloudName, folder } =
        await res.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await uploadRes.json();

      if (data.secure_url) {
        setProfilePicture(data.secure_url);
        toast.success('Imagen actualizada con éxito');
      } else {
        toast.error('No se pudo obtener la URL de la imagen');
      }
    } catch (error) {
      toast.error('Error al subir la imagen');
      console.error('[UPLOAD ERROR]', error);
    } finally {
      setUploading(false);
    }
  };
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
      phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber,
      birthDate,
      gender,
      role: userData.role as UserRole,
      profilePicture: profilePicture || undefined,
    };

    try {
      await api.user.update(user.sub, payload, token);
      toast.success('Perfil Actualizado exitosamente');
      setEditing(false);
      setIsEditing?.(false);
      setEditing(false);
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
    <>
      <div
        className="relative mx-auto flex w-full flex-col items-center justify-center rounded-[10px] px-6 pb-20 pt-10 shadow md:flex-row md:justify-between md:py-4"
        style={{ maxWidth: '956px', background: Colors.topBar }}
      >
        {/* mobile */}
        {!editing && (
          <div className="absolute left-4 top-4 block md:hidden">
            <button
              onClick={() => {
                setEditing(true);
                setIsEditing?.(true);
              }}
              className="text-sm font-medium underline"
              style={{ color: Colors.primary }}
            >
              EDITAR
            </button>
          </div>
        )}

        <div className="relative z-10 -mb-[120px] md:static md:mb-0 md:flex md:items-center md:gap-4">
          <div className="relative w-fit">
            {/* Solo visible en mobile */}

            <div className="relative flex w-full justify-center md:hidden">
              {/*wrapper con avatar dentro */}
              <div
                className="flex items-start justify-center overflow-hidden"
                style={{
                  width: 100,
                  height: 90,
                  borderTopLeftRadius: 9999,
                  borderTopRightRadius: 9999,
                  backgroundColor: 'white',
                }}
              >
                {/* Avatar */}
                <div className="mt-[10%]">
                  <Avatar
                    name={`${userData.firstName} ${userData.lastName}`}
                    imageUrl={profilePicture}
                    size={80}
                    withDropdown={false}
                  />
                </div>
              </div>
            </div>

            {/* Desktop*/}
            <div className="hidden md:block">
              <Avatar
                name={`${userData.firstName} ${userData.lastName}`}
                imageUrl={profilePicture}
                size={80}
                withDropdown={false}
              />
            </div>
            {editing && (
              <>
                <div
                  className="absolute bottom-0 right-0 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#2D397B]"
                  onClick={() =>
                    document.getElementById('profile-image-upload')?.click()
                  }
                >
                  <svg
                    width="15"
                    height="19"
                    viewBox="0 0 15 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.40974 16.5121L13.8218 13.529M5.44435 5.18871L11.3094 14.9138M7.88488 3.45702C7.97384 3.60685 7.91605 3.80123 7.75579 3.8912L2.89534 6.6196C2.73508 6.70956 2.53304 6.66103 2.44407 6.5112C0.438238 3.13329 1.74333 1.84064 2.90922 1.18617C4.07511 0.531702 5.87569 0.0734776 7.88488 3.45702ZM8.04596 3.72831L13.739 13.3157C13.8083 13.4324 13.842 13.5661 13.8346 13.7008C13.7407 15.3999 13.5009 16.8887 13.3418 17.7344C13.2662 18.1358 12.8503 18.3715 12.454 18.2369C11.6172 17.9527 10.1627 17.416 8.59372 16.6428C8.46993 16.5818 8.3675 16.4865 8.29812 16.3697L2.60516 6.78248L8.04596 3.72831Z"
                      stroke="white"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {uploading && (
                  <p className="mt-2 text-center text-sm text-gray-600">
                    Subiendo imagen...
                  </p>
                )}
              </>
            )}
          </div>

          <h2 className="hidden text-xl font-semibold text-black md:block">
            {userData.firstName} {userData.lastName}
          </h2>
        </div>

        {!editing && (
          <div className="hidden md:block">
            <Button
              variant="submit"
              width="189px"
              height="51px"
              className="font-semibold text-white"
              onClick={() => {
                setEditing(true);
                setIsEditing?.(true);
              }}
            >
              Editar
            </Button>
          </div>
        )}
      </div>
      <div className="mt-14 rounded-lg p-4 md:p-6">
        <div className="mx-auto w-full max-w-[956px]">
          <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
            <Input
              label="Nombre"
              value={firstName}
              disabled={!editing}
              onChange={(e) => setFirstName(e.target.value)}
              helperText={errors.firstName}
              borderColor="#f3f4f6"
              helperTextColor="red-500"
            />
            <Input
              label="Apellido"
              value={lastName}
              disabled={!editing}
              onChange={(e) => setLastName(e.target.value)}
              helperText={errors.lastName}
              borderColor="#f3f4f6"
              helperTextColor="red-500"
            />
            <Input
              label="Correo Electrónico"
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
              label="Número de telefono"
              value={phoneNumber}
              disabled={!editing}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText={errors.phoneNumber}
              borderColor="#f3f4f6"
              helperTextColor="red-500"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Fecha de nacimiento
              </label>
              <DatePicker1
                value={birthDate}
                disabled={!editing}
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
                disabled={!editing}
                selected={gender === UserGender.MALE}
                onSelect={() => setGender(UserGender.MALE)}
              />
              <RadioButton
                text="Mujer"
                disabled={!editing}
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
          {editing && (
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-between">
              <Button
                variant="submit"
                className="h-[51px] w-full font-semibold text-white md:w-auto"
                onClick={handleSubmit}
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
