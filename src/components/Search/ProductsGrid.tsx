import {
  isAPIError,
  ProductPaginationRequest,
  ProductPresentation,
} from '@pharmatech/sdk';
import { Filters } from './SidebarFilter';
import { api } from '@/lib/sdkConfig';
import ProductCard from '../Product/ProductCard';

export default async function ProductsGrid({ filters }: { filters: Filters }) {
  const {
    categories,
    brands,
    presentations,
    activeIngredients,
    query,
    priceMin,
    priceMax,
  } = filters;
  const req: ProductPaginationRequest = {
    page: 1,
    limit: 50,
    ...(query?.trim() && { q: query?.trim() }),
    ...(categories.length > 0 && {
      categoryId: categories.filter((c) => c != ''),
    }),
    ...(brands.length > 0 && { manufacturerId: brands }),
    ...(activeIngredients.length > 0 && {
      genericProductId: activeIngredients,
    }),
    ...(presentations.length > 0 && {
      presentationId: presentations,
    }),
    ...(priceMin &&
      priceMax && {
        priceRange: {
          min: priceMin,
          max: priceMax,
        },
      }),
  };
  let products: ProductPresentation[] = [];
  let productsCount = 0;
  try {
    const response = await api.product.getProducts(req);
    products = response.results;
    productsCount = response.count;
  } catch (error) {
    if (isAPIError(error)) {
      console.error('Error fetching products:', error.message);
    } else {
      console.error('Unexpected error fetching products:', error);
    }
  }
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl">
          Resultados para:{' '}
          <span className="capitalize">
            {query ? query : 'Todos los productos'}
          </span>
        </h2>
        <span className="text-sm text-gray-600">
          {productsCount} resultado{products.length !== 1 && 's'}
        </span>
      </div>
      <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
