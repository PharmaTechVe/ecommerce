'use client';
import '../styles/globals.css';
import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
interface PaginationProps {
  totalPages: number;
  previousText?: string;
  nextText?: string;
  previousIcon?: 'chevron' | 'arrow';
  nextIcon?: 'chevron' | 'arrow';
  buttonStyle?: string;
  pageButtonStyle?: string;
  activePageColor?: string;
  inactivePageColor?: string;
  buttonBorderStyle?: 'rounded' | 'full';
  backgroundColor?: string;
}
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  previousText = '',
  nextText = '',
  previousIcon = '',
  nextIcon = '',
  buttonStyle = '',
  pageButtonStyle = '',
  activePageColor = '',
  inactivePageColor = '',
  buttonBorderStyle = '',
  backgroundColor = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const isHexOrRgb = (color: string) =>
    color.startsWith('#') || color.startsWith('rgb');

  const buttonSize =
    previousText || nextText ? 'h-[25px] w-[25px]' : 'h-[34px] w-[34px]';
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      const isActive = currentPage === i;
      const activeBgColor =
        activePageColor === '#9CB3FF'
          ? { backgroundColor: activePageColor, color: '#000000' }
          : { backgroundColor: activePageColor, color: '#FFFFFF' };
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mt-2 flex ${buttonSize} items-center justify-center border ${buttonBorderStyle === 'full' ? 'rounded-full' : 'rounded-md'} ${pageButtonStyle} ${isActive ? '' : inactivePageColor}`}
          style={
            isActive
              ? isHexOrRgb(activePageColor)
                ? activeBgColor
                : {}
              : isHexOrRgb(inactivePageColor)
                ? { backgroundColor: inactivePageColor }
                : {}
          }
        >
          {i}
        </button>,
      );
    }
    return pages;
  };
  return (
    <div
      className={`mb-10 flex h-[50px] w-[300px] justify-center space-x-2 rounded-xl border px-2 ${backgroundColor}`}
      style={isHexOrRgb(backgroundColor) ? { backgroundColor } : {}}
    >
      <button
        className={`mt-2 flex ${buttonSize} items-center justify-center border border-gray-300 text-xs text-gray-950 ${buttonStyle} ${buttonBorderStyle === 'full' ? 'rounded-full' : 'rounded-md'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {previousIcon === 'chevron' ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ArrowLeftIcon className="h-4 w-4" />
        )}
        {previousText && <span className="ml-1 text-xs">{previousText}</span>}
      </button>
      {renderPageNumbers()}
      <button
        className={`mt-2 flex ${buttonSize} items-center justify-center border border-gray-300 text-xs text-gray-950 ${buttonStyle} ${buttonBorderStyle === 'full' ? 'rounded-full' : 'rounded-md'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {nextText && <span className="mr-1 text-xs">{nextText}</span>}
        {nextIcon === 'chevron' ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ArrowRightIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
export default Pagination;
