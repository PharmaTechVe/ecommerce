import React, { useState } from 'react';

const Checkbox5 = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="text-dark flex cursor-pointer select-none items-center dark:text-white">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div
          className={`box border-primary mr-4 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
            isChecked
              ? 'bg-primary border-primary'
              : 'border-stroke bg-transparent'
          }`}
        >
          <span
            className={`h-[10px] w-[10px] rounded-full transition-all ${
              isChecked ? 'dark:bg-dark bg-white' : 'bg-transparent'
            }`}
          ></span>
        </div>
      </div>
      Checkbox Text
    </label>
  );
};

export default Checkbox5;
