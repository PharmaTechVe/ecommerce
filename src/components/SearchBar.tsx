'use client';
import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Colors } from '../styles/styles';

type SearchBarProps = {
  categories: string[];
  onSearch: (query: string, category: string) => void;
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundColor?: string;
  textColorDrop?: string;
  textplaceholderColor?: string;
  categoryColor?: string;
  inputPlaceholder?: string;
  disableDropdown?: boolean;
};

export default function SearchBar({
  categories,
  onSearch,
  width = '',
  height = '',
  borderRadius = '',
  backgroundColor = '',
  textColorDrop = '',
  textplaceholderColor = '',
  categoryColor = '',
  inputPlaceholder = '',
  disableDropdown = false,
}: SearchBarProps) {
  const [selectedCategory, setSelectedCategory] = useState('Categorías');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm, selectedCategory);
  };

  return (
    <div
      className="relative flex overflow-visible border"
      style={{
        width: `${width}`,
        height: `${height}`,
        borderRadius: `${borderRadius}`,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Renderiza el dropdown solo si disableDropdown es false */}
      {!disableDropdown && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center gap-1 border-r px-4"
            style={{
              color: textColorDrop,
              borderColor: '#d1d5db',
              borderTopLeftRadius: `${borderRadius}`,
              borderBottomLeftRadius: `${borderRadius}`,
            }}
          >
            <span className="font-medium">{selectedCategory}</span>
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4 transition duration-200" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 transition duration-200" />
            )}
          </button>
          {isOpen && (
            <ul
              className="absolute z-10 mt-1 w-full shadow-md"
              style={{
                backgroundColor: Colors.menuWhite,
                borderRadius: `${borderRadius}`,
              }}
            >
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm"
                  style={{
                    backgroundColor:
                      category === selectedCategory
                        ? categoryColor
                        : Colors.menuWhite,
                    color:
                      category === selectedCategory
                        ? Colors.menuWhite
                        : textColorDrop,
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder={inputPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-full flex-grow px-4 text-sm placeholder-[color:var(--tw-placeholder-color)] focus:outline-none"
        style={
          {
            color: textColorDrop,
            backgroundColor: 'transparent',
            '--tw-placeholder-color': textplaceholderColor,
          } as React.CSSProperties
        }
      />
      <button
        onClick={handleSearch}
        className="h-full border-l px-4 hover:bg-gray-100"
        style={{
          borderColor: '#d1d5db',
          borderTopRightRadius: `${borderRadius}`,
          borderBottomRightRadius: `${borderRadius}`,
        }}
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
