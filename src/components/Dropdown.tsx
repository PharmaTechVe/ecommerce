'use client';
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type DropdownProps = {
  label: string;
  items: string[];
  onSelect?: (item: string) => void;
};

export default function Dropdown({ label, items, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  return (
    <div className="relative w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:blue flex w-full items-center justify-between rounded-md border border-gray-400 bg-white px-4 py-2 focus:outline-none focus:ring-2"
      >
        {selected}
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 transition duration-200" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 transition duration-200" />
        )}
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {items.map((item) => (
            <li
              key={item}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
                if (onSelect) {
                  onSelect(item);
                }
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
