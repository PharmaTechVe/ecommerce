'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
interface PaginationProps {
  totalPages: number;
  previousText?: string;
  nextText?: string;
  previousIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  nextIcon2?: React.ReactNode;
  buttonStyle?: 'rounded' | 'full';
  activeButtonColor?: string;
  inactiveButtonColor?: string;
  backgroundColor?: string;
}
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  previousText = 'Previous',
  nextText = 'Next',
  previousIcon = <FontAwesomeIcon icon={faChevronLeft} />,
  nextIcon = <FontAwesomeIcon icon={faChevronRight} />,
  buttonStyle = 'rounded',
  activeButtonColor = 'bg-blue-900 text-white',
  inactiveButtonColor = 'border-gray-300 text-gray-500',
  backgroundColor = 'bg-white',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);
    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(totalPages, maxPagesToShow);
    } else if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`mt-3 flex h-[35px] w-[50px] items-center justify-center border ${inactiveButtonColor} ${buttonStyle === 'rounded' ? 'rounded' : 'rounded-full'} ${currentPage === i ? activeButtonColor : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };
  return (
    <div
      className={`mb-10 flex h-[58px] w-[350px] justify-center space-x-4 rounded-xl border px-2 ${backgroundColor}`}
    >
      <button
        className="space-between-1 mt-3 flex h-[35px] w-[50px] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-950"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="px-3">{previousIcon}</span>
        <span className="text-xs text-gray-500">{previousText}</span>
      </button>
      {renderPageNumbers()}
      <button
        className="space-between-1 mt-3 flex h-[35px] w-[50px] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-950"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="text-xs text-gray-500">{nextText}</span>
        <span className="px-3">{nextIcon}</span>
      </button>
    </div>
  );
};
export default Pagination;
