'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
                    className={`w-[50px] h-[35px] flex items-center justify-center border mt-3 ${inactiveButtonColor} ${buttonStyle === 'rounded' ? 'rounded' : 'rounded-full'} ${currentPage === i ? activeButtonColor : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };
    return (
        <div  className={`flex space-x-4 px-2 mb-10 justify-center border rounded-xl h-[58px] w-[350px] ${backgroundColor}`}>
            <button
                className=" w-[50px] h-[35px] mt-3  flex justify-center text-sm items-center space-between-1 text-gray-950 border border-gray-300 rounded-lg"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                 <span className='px-3'>{previousIcon}</span>
                <span className='text-gray-500 text-xs'>{previousText}</span>
            </button>
            {renderPageNumbers()}
            <button
                className="  w-[50px] h-[35px] mt-3  flex justify-center text-sm items-center space-between-1 text-gray-950 border border-gray-300 rounded-lg"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className='text-gray-500 text-xs'>{nextText}</span>
                <span className='px-3'>{nextIcon}</span>
            </button>
        </div>
    );
};
export default Pagination;


