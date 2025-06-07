import ProductCarousel from '@/components/Product/ProductCarousel';
import { api } from '@/lib/sdkConfig';

export default async function ProductsOffer({
  withPromo = false,
}: {
  withPromo?: boolean;
}) {
  // Fetch products with a promo if `withPromo` is true
  const products = await api.product.getProducts({
    page: 1,
    limit: 12,
    isVisible: true,
    withPromo,
  });
  return (
    <>
      <div className="mt-8 cursor-pointer">
        <ProductCarousel products={products.results} />
      </div>
    </>
  );
}
