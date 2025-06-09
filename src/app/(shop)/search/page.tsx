import SidebarFilter from '@/components/Search/SidebarFilter';
import Breadcrumb from '@/components/Breadcrumb';
import ProductsGrid from '@/components/Search/ProductsGrid';
import { Suspense } from 'react';
import Loading from '@/app/loading';

type SearchParams = {
  query?: string;
  categoryId?: string;
  brand?: string;
  presentation?: string;
  activeIngredient?: string;
  priceMin?: string;
  priceMax?: string;
};

export default async function SearchPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await props.searchParams;
  const query = params?.query || '';
  const categories = params?.categoryId?.split(',') || [''];
  const brands = params?.brand?.split(',') || [];
  const presentations = params?.presentation?.split(',') || [];
  const activeIngredients = params?.activeIngredient?.split(',') || [];
  const priceMin = parseFloat(params?.priceMin || String(0));
  const priceMax = parseFloat(params?.priceMax || String(10000));
  const currentFilters = {
    categories,
    brands,
    presentations,
    activeIngredients,
    query,
    priceMin,
    priceMax,
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(query
      ? [{ label: 'Búsqueda', href: `/search?query=${query}` }]
      : [{ label: 'Búsqueda Personalizada', href: `/search` }]),
  ];

  return (
    <div className="mb-10 flex min-h-screen flex-col">
      <main className="container mt-4 flex-grow">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarFilter initialFilters={currentFilters} />
          <section className="mb-12 flex-1">
            <Suspense fallback={<Loading />}>
              <ProductsGrid filters={currentFilters} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
