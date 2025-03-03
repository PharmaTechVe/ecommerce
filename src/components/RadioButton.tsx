'use client';
import { useState } from 'react';
import { ImRadioUnchecked } from 'react-icons/im';
import { RiRadioButtonFill } from 'react-icons/ri';
import { Colors } from '../styles/styles';
import '../styles/globals.css';

type RadioButtonProps = {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  text?: string;
};

const RadioButton: React.FC<RadioButtonProps> = ({
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
        <RiRadioButtonFill size={20} color={Colors.primary} />
      ) : (
        <ImRadioUnchecked size={20} color={Colors.primary} />
      )}

      {text && (
        <span style={{ color: Colors.textMain }} className="text-sm">
          {text}
        </span>
      )}
    </button>
  );
};

export default RadioButton;
