import ProductCarousel from '@/components/Product/ProductCarousel';
import { api } from '@/lib/sdkConfig';

export default async function ProductsOffer() {
  const products = await api.product.getProducts({
    page: 1,
    limit: 20,
  });
  return (
    <>
      <div className="mt-8 cursor-pointer">
        <ProductCarousel products={products.results} />
      </div>
    </>
  );
}
