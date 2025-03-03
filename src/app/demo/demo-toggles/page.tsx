'use client';
import Toggle from '@/components/Toggle';
import {
  CheckIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  BellSlashIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

export default function TogglePage() {
  // function que se ejecuta cuando se cambia el estado del Toggle
  const test = (state: boolean): void => {
    console.log('Toggle isSelected:', state);
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-white p-10">
      <h1>Demo Toggle component</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 1ra fila */}

        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-14 h-7"
          backgroundColorOn="bg-gray-300"
          backgroundColorOff="bg-gray-200"
          thumbSize="w-6 h-6"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
        />

        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-14 h-7"
          backgroundColorOn="bg-gray-300"
          backgroundColorOff="bg-gray-200"
          thumbSize="w-6 h-6"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 2da fila */}

        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-12 h-4"
          backgroundColorOn="bg-[#E5E7EB]"
          backgroundColorOff="bg-[#E5E7EB]"
          thumbSize="w-6 h-6"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
        />

        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-12 h-4"
          backgroundColorOn="bg-[#E5E7EB]"
          backgroundColorOff="bg-[#E5E7EB]"
          thumbSize="w-6 h-6"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 3ra fila */}

        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#E5E7EB]"
          backgroundColorOff="bg-[#E5E7EB]"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
          thumbIconOn={CheckIcon}
          thumbIconOff={XMarkIcon}
          thumbIconColor="text-gray-300"
        />

        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-gray-300"
          backgroundColorOff="bg-gray-200"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-[#1A1D3B]"
          thumbIconOn={CheckIcon}
          thumbIconOff={XMarkIcon}
          thumbIconColor="text-gray-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 4ta fila */}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#1C2143]"
          backgroundColorOff="bg-[#111928]"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-white"
        />
        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#1C2143]"
          backgroundColorOff="bg-[#111928]"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 5ta fila */}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-12 h-4"
          backgroundColorOn="bg-[#E5E7EB]"
          backgroundColorOff="bg-[#E5E7EB]"
          thumbSize="w-6 h-6"
          thumbColor="bg-gray border-4 border-[#FFFFFF]"
          activeThumbColor="bg-[#1C2143] border-4 border-[#FFFFFF]"
          thumbIconColor="text-white"
        />

        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-12 h-4"
          backgroundColorOn="bg-[#E5E7EB]"
          backgroundColorOff="bg-[#E5E7EB]"
          thumbSize="w-6 h-6"
          thumbColor="bg-gray border-4 border-[#FFFFFF]"
          activeThumbColor="bg-[#1C2143] border-4 border-[#FFFFFF]"
          thumbIconColor="text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 6ta fila */}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#1C2143]"
          backgroundColorOff="bg-[#1C2143]"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-white"
        />
        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#1C2143]"
          backgroundColorOff="bg-[#1C2143]"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 7ma fila */}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#EAEEFB]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#1C2143]"
          activeThumbColor="bg-[#1C2143]"
        />

        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#EAEEFB]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#1C2143]"
          activeThumbColor="bg-[#1C2143]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 8va fila lo logre*/}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-5"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#111928]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#FFFFFF] -border border-[#FFFFFF]"
          activeThumbColor="bg-[#1C2143] border-4 border-[#1C2143]"
          //thumbIconOff={XCircleIcon} en hero no hay está icono el icono que se necesita
          //thumbIconOn={XCircleIcon} en hero no hay está icono el icono que se necesita
          thumbIconColor="text-[#808080]"
        />
        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-5"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#111928]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#FFFFFF] -border border-[#FFFFFF]"
          activeThumbColor="bg-[#1C2143] border-4 border-[#1C2143]"
          //thumbIconOff={XCircleIcon} en hero no hay está icono el icono que se necesita
          //thumbIconOn={XCircleIcon} en hero no hay está icono el icono que se necesita
          thumbIconColor="text-[#808080]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Toggles de la 9na fila */}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#EAEEFB]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#1C2143] border-8 border-[#FFFFFF]"
          activeThumbColor="bg-[#FFFFFF] border-8 border-[#1C2143]"
        />
        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#EAEEFB]"
          backgroundColorOff="bg-[#EAEEFB]"
          thumbSize="w-7 h-7"
          thumbColor="bg-[#1C2143] border-8 border-[#FFFFFF]"
          activeThumbColor="bg-[#FFFFFF] border-8 border-[#1C2143]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Toggles extras*/}
        <Toggle
          isSelected={false}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#111928]"
          backgroundColorOff="bg-gray-300"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-[#FFFFFF]"
          thumbIconOff={SunIcon}
          thumbIconOn={MoonIcon}
          thumbIconColor="text-[#111928]"
        />
        <Toggle
          isSelected={true}
          onChange={test}
          backgroundSize="w-16 h-8"
          backgroundColorOn="bg-[#111928]"
          backgroundColorOff="bg-gray-300"
          thumbSize="w-7 h-7"
          thumbColor="bg-white"
          activeThumbColor="bg-[#FFFFFF]"
          thumbIconOff={BellSlashIcon}
          thumbIconOn={BellIcon}
          thumbIconColor="text-[#111928]"
        />
      </div>
    </div>
  );
}
