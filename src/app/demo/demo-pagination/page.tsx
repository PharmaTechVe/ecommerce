'use client';
import React from 'react';
import Pagination from '@/components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const Page: React.FC = () => {
  return (
    <div className="border-radius-50 flex min-h-screen items-center justify-center bg-gray-900">
      <div className="rounded-lg border-gray-950 bg-white p-8 shadow-lg">
        <Pagination
          totalPages={10}
          previousText=""
          nextText=""
          buttonStyle="rounded"
          activeButtonColor="bg-blue-950 text-white"
          inactiveButtonColor="border-gray-500 text-gray-500"
          previousIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          nextIcon={<FontAwesomeIcon icon={faChevronRight} />}
        />

        <Pagination
          totalPages={10}
          previousText=""
          nextText=""
          buttonStyle="full"
          activeButtonColor="bg-blue-950 text-white"
          inactiveButtonColor="border-gray-500 text-gray-500"
          previousIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          nextIcon={<FontAwesomeIcon icon={faChevronRight} />}
        />
        <Pagination
          totalPages={10}
          previousText=""
          nextText=""
          buttonStyle="rounded"
          activeButtonColor="bg-blue-100 text-blue-900"
          inactiveButtonColor="border-gray-500 text-gray-500"
          previousIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          nextIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
        <Pagination
          totalPages={10}
          previousText=""
          nextText=""
          buttonStyle="full"
          activeButtonColor="bg-blue-100 text-blue-900"
          inactiveButtonColor="border-gray-500 text-gray-500"
          previousIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          nextIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
      </div>
    </div>
  );
};
export default Page;
