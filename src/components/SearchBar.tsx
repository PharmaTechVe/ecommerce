'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import SearchSuggestions from './SuggestionProduct';

type SearchBarProps = {
  categories: string[];
  onSearch?: (query: string, category: string) => void;
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
  height = '2.5rem',
  borderRadius = '0.375rem',
  backgroundColor = 'white',
  textColorDrop = '#374151',
  textplaceholderColor = '#9CA3AF',
  categoryColor = '#1C2143',
  inputPlaceholder = 'Buscar producto',
  disableDropdown = false,
}: SearchBarProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Categorías');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) return;

    onSearch?.(term, selectedCategory);

    const qEnc = encodeURIComponent(term);
    const cEnc = encodeURIComponent(selectedCategory.trim());
    router.push(`/search?query=${qEnc}&category=${cEnc}`);
  };

  return (
    <div className="relative flex w-full flex-col overflow-visible">
      <div
        className="flex w-full border"
        style={{ height, borderRadius, backgroundColor }}
      >
        {!disableDropdown && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-full items-center gap-1 border-r px-4"
              style={{
                color: textColorDrop,
                borderColor: '#d1d5db',
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
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
                style={{ backgroundColor }}
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
                          : backgroundColor,
                      color:
                        category === selectedCategory
                          ? backgroundColor
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
          className="h-full flex-grow px-4 text-sm focus:outline-none"
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
          className="h-full flex-shrink-0 border-l px-4 hover:bg-gray-100"
          style={{
            borderColor: '#d1d5db',
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          }}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Opcional: sugerencias bajo el input */}
      {searchTerm.length > 0 && (
        <SearchSuggestions query={searchTerm} category={selectedCategory} />
      )}
    </div>
  );
}
