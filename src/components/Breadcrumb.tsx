'use client';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="py-3">
      <ol className="flex items-center space-x-2 text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const content = item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-main-500 focus:outline-none"
            >
              {item.label}
            </button>
          ) : item.href && !isLast ? (
            <Link href={item.href} className="hover:text-main-500">
              {item.label}
            </Link>
          ) : (
            <span className={isLast ? 'font-regular text-[#2D397B]' : ''}>
              {item.label}
            </span>
          );

          return (
            <li key={item.href ?? item.label} className="flex items-center">
              {content}
              {!isLast && (
                <ChevronRightIcon className="text-main-400 mx-2 h-4 w-4" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
