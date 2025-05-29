import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function ProductCarouselSkeleton() {
  return (
    <section className="relative w-full px-2 sm:px-4">
      <button className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>

      <div className="flex w-full items-center justify-center space-y-4">
        <div className="flex w-full items-center justify-center space-x-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative flex h-[400px] w-[260px] animate-pulse rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
      <button className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
    </section>
  );
}
