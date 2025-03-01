'use client';
import { useState } from 'react';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';
import '../styles/globals.css';

type CheckButtonProps = {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  text?: string; // Nueva propiedad para el texto
};

const CheckButton: React.FC<CheckButtonProps> = ({
  initialChecked = false,
  onChange,
  text,
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleClick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-auto w-auto items-center justify-center space-x-2 p-0 focus:outline-none"
    >
      {isChecked ? (
        <IoCheckbox size={20} className="icon-color" />
      ) : (
        <IoSquareOutline size={24} className="icon-color" />
      )}

      {/* Campo de texto opcional */}
      {text && <span className="text-main text-sm">{text}</span>}
    </button>
  );
};

export default CheckButton;
