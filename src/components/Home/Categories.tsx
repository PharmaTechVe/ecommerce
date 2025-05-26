import { api } from '@/lib/sdkConfig';
import CategoryCarousel from '../CategoryCarousel';
import { Category } from '@pharmatech/sdk';
import ProductDetailImg from '@/lib/utils/images/Antibioticos.png';

type CategoryForCarousel = Category & {
  id: string;
  imageUrl?: string;
};

export default async function Categories() {
  const response = await api.category.findAll({
    page: 1,
    limit: 20,
  });
  const categories: CategoryForCarousel[] = response.results.map((c) => ({
    ...c,
    id: String(c.id),
    imageUrl: ProductDetailImg.src,
  }));
  return (
    <div className="mt-8 cursor-pointer">
      <CategoryCarousel categories={categories} />
    </div>
  );
}
