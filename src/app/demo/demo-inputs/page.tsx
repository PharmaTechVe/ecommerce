'use client';
import Input from '@/components/Input/Input';
import ToggleVisibilityInput from '@/components/Input/ToggleVisibilityInput';
import { CircleAlert, BadgeCheck } from 'lucide-react';

export default function PageInput() {
  const test = (message: string): void => {
    console.log(message);
  };
  return (
    <div className="p-5">
      <h1>Input</h1>
      <div className="grid grid-cols-4">
        {/* Inputs de la 1ra fila */}
        <div className="bg-white px-6 py-4">
          <ToggleVisibilityInput
            label="Label 1x1"
            borderSize="0px"
            placeholder="Placeholder"
            helperText="Helper text"
            onChange={(e) => test(e.target.value)}
          />
        </div>

        <div className="bg-white px-6 py-4">
          <ToggleVisibilityInput
            label="Label 1x2"
            borderSize="1px"
            borderColor="#1C2143"
            placeholder="Placeholder"
            helperText="Helper text"
            onChange={(e) => test(e.target.value)}
          />
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 1x3"
              borderSize="3px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 1x4"
              borderSize="0px"
              placeholder="Placeholder"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 2da fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 2x1"
              borderSize="1px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 2x2"
              borderSize="1px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 2x3"
              borderSize="3px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 2x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#777675"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 3ra fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 3x1"
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 3x2"
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 3x3"
              borderSize="3px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              label="Label 3x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#777675"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 4ta fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 4x1"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 4x2"
              borderSize="1px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 4x3"
              borderSize="3px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <ToggleVisibilityInput
              label="Label 4x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 12va fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              borderSize="3px"
              borderColor="#00C814"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <Input
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
