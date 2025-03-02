'use client';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';

type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  color?: string;
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="py-3">
      <ol className="flex items-center space-x-2 text-gray-600">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <Link href={item.href} className="hover:text-main-500">
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <MdChevronRight className="text-main-400 mx-2 h-4 w-4" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
