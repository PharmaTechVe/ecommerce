'use client';
//import Input from '@/components/Input/Input';
//import ToggleVisibilityInput from '@/components/Input/ToggleVisibilityInput';
import FixedInput from '@/components/Input/FixedInput';
//import { CircleAlert, CheckCircleIcon } from 'lucide-react';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserIcon,
  UserCircleIcon,
  LockClosedIcon,
  PhoneIcon,
  CreditCardIcon,
  CalendarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

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
          <FixedInput
            label="Label 1x1"
            placeholder="Placeholder"
            helperText="Helper text"
            helperTextColor="#393938"
            disabled={false}
            type="password"
            showPasswordToggle={true}
            showPasswordToggleIconColor="#777675"
            borderSize="1px"
            borderColor="#FFFFFF"
            onChange={(e) => test(e.target.value)}
          />

          {/* <ToggleVisibilityInput
            label="Label 1x1"
            borderSize="0px"
            placeholder="Placeholder"
            helperText="Helper text"
            onChange={(e) => test(e.target.value)}
          /> */}
        </div>

        <div className="bg-white px-6 py-4">
          <FixedInput
            label="Label 1x2"
            placeholder="Placeholder"
            helperText="Helper text"
            helperTextColor="#393938"
            disabled={false}
            type="password"
            showPasswordToggle={true}
            showPasswordToggleIconColor="#111928"
            borderSize="1px"
            borderColor="#1C2143"
            onChange={(e) => test(e.target.value)}
          />
          {/* <ToggleVisibilityInput
            label="Label 1x2"
            borderSize="1px"
            borderColor="#1C2143"
            placeholder="Placeholder"
            helperText="Helper text"
            onChange={(e) => test(e.target.value)}
          /> */}
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 1x3"
              placeholder="Placeholder"
              icon={UserIcon}
              iconColor="#6B7280"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#393938"
              disabled={false}
              type="password"
              showPasswordToggle={true}
              showPasswordToggleIconColor="#111928"
              borderSize="1px"
              borderColor="#3758F9"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 1x3"
              borderSize="3px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 1x4"
              placeholder="Lorem Ipsum"
              helperText="Helper text"
              helperTextColor="#393938"
              disabled={true}
              type="password"
              showPasswordToggle={true}
              showPasswordToggleIconColor="#111928"
              borderSize="1px"
              borderColor="#FFFFFF"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 1x4"
              borderSize="0px"
              placeholder="Placeholder"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 2da fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 2x1"
              placeholder="Placeholder"
              icon={ExclamationCircleIcon}
              iconColor="#E10000"
              iconPosition="right"
              helperText="Helper text"
              helperTextColor="#E10000"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 2x1"
              borderSize="1px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 2x2"
              placeholder="Placeholder"
              icon={ExclamationCircleIcon}
              iconColor="#E10000"
              iconPosition="right"
              helperText="Helper text"
              helperTextColor="#E10000"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 2x2"
              borderSize="1px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 2x3"
              placeholder="Placeholder"
              icon={ExclamationCircleIcon}
              iconColor="#E10000"
              iconPosition="right"
              helperText="Helper text"
              helperTextColor="#E10000"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="3px"
              borderColor="#E10000"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 2x3"
              borderSize="3px"
              borderColor="#E10000"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#E10000"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 2x4"
              placeholder="Placeholder"
              icon={ExclamationCircleIcon}
              iconColor="#393938"
              iconPosition="right"
              helperText="Helper text"
              helperTextColor="#393938"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#FFFFFF"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 2x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              icon={CircleAlert}
              iconColor="#777675"
              helperText="Helper text"
              helperTextColor="#E10000"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 3ra fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 3x1"
              placeholder="Placeholder"
              icon={CheckCircleIcon}
              iconColor="#00C814"
              iconPosition="right"
              helperText="Helper text"
              helperTextColor="#00C814"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 3x1"
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 3x2"
              placeholder="Placeholder"
              icon={EnvelopeIcon}
              iconColor="#00C814"
              iconPosition="left"
              helperText="Left icon"
              helperTextColor="#00C814"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 3x2"
              borderSize="1px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 3x3"
              placeholder="Placeholder"
              icon={CheckCircleIcon}
              iconColor="#00C814"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#00C814"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="3px"
              borderColor="#00C814"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 3x3"
              borderSize="3px"
              borderColor="#00C814"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#00C814"
              helperText="Helper text"
              helperTextColor="#00C814"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 3x4"
              placeholder="Placeholder"
              icon={UserCircleIcon}
              iconColor="#777675"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#777675"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#FFFFFF"
              onChange={(e) => test(e.target.value)}
            />
            {/* <Input
              label="Label 3x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              icon={BadgeCheck}
              iconColor="#777675"
              helperText="Helper text"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Inputs de la 4ta fila */}
        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 4x1"
              placeholder="Placeholder"
              icon={LockClosedIcon}
              iconColor="#1C2143"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#1C2143"
              disabled={false}
              type="password"
              showPasswordToggle={true}
              showPasswordToggleIconColor="#1C2143"
              borderSize="1px"
              borderColor="#1C2143"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 4x1"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 4x2"
              placeholder="Placeholder"
              icon={PhoneIcon}
              iconColor="#1C2143"
              iconPosition="left"
              helperText="Telefono"
              helperTextColor="#1C2143"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="2px"
              borderColor="#1C2143"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 4x2"
              borderSize="1px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 4x3"
              placeholder="Placeholder"
              icon={CreditCardIcon}
              iconColor="#1C2143"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#1C2143"
              disabled={false}
              type="text"
              showPasswordToggle={true}
              showPasswordToggleIconColor="#1C2143"
              borderSize="3px"
              borderColor="#1C2143"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 4x3"
              borderSize="3px"
              borderColor="#1C2143"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mx-2">
            <FixedInput
              label="Label 4x4"
              placeholder="Placeholder"
              icon={CalendarIcon}
              iconColor="#1C2143"
              iconPosition="left"
              helperText="Helper text"
              helperTextColor="#1C2143"
              disabled={false}
              type="text"
              showPasswordToggle={false}
              borderSize="1px"
              borderColor="#FFFFFF"
              onChange={(e) => test(e.target.value)}
            />
            {/* <ToggleVisibilityInput
              label="Label 4x4"
              borderSize="1px"
              borderColor="#FFFFFF"
              placeholder="Placeholder"
              onChange={(e) => test(e.target.value)}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
