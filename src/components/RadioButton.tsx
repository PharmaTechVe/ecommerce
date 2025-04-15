import React from 'react';
import { Colors } from '@/styles/styles';

type RadioButtonProps = {
  text: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  text,
  selected,
  onSelect,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect();
    }
  };

  return (
    <label
      className={`flex select-none items-center text-dark dark:text-white ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <input
          type="radio"
          checked={selected}
          readOnly
          disabled={disabled}
          className="sr-only"
        />
        <div
          className="mr-4 flex h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: Colors.primary,
            backgroundColor: selected ? Colors.primary : 'transparent',
          }}
        >
          {selected && (
            <span className="h-[10px] w-[10px] rounded-full bg-white"></span>
          )}
        </div>
      </div>
      <span style={{ color: Colors.textMain }}>{text}</span>
    </label>
  );
};

export default RadioButton;
