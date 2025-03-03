'use client';
import { useState } from 'react';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';
import { Colors } from '../styles/styles';

type CheckButtonProps = {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  text?: string;
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
        <IoCheckbox size={20} color={Colors.primary} />
      ) : (
        <IoSquareOutline size={24} color={Colors.primary} />
      )}

      {text && (
        <span style={{ color: Colors.textMain }} className="text-sm">
          {text}
        </span>
      )}
    </button>
  );
};

export default CheckButton;
