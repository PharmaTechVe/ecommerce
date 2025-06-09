import { api } from '@/lib/sdkConfig';
import CategoryCarousel from '../CategoryCarousel';
import { Category } from '@pharmatech/sdk';

type CategoryForCarousel = Category & {
  id: string;
  imageUrl?: string;
};

const validImageNames = [
  'Analgésico',
  'Antibióticos',
  'Anticonvulsivo',
  'Antidiabetico oral',
  'Antieméticos',
  'Antihipertensivo',
  'Antipireticos',
];

function getRandomImageUrl() {
  const randomName =
    validImageNames[Math.floor(Math.random() * validImageNames.length)];
  return `/images/categories/${randomName}.png`;
}

export default async function Categories() {
  const response = await api.category.findAll({
    page: 1,
    limit: 20,
  });
  const categories: CategoryForCarousel[] = response.results.map((c) => ({
    ...c,
    id: String(c.id),
    imageUrl: validImageNames.includes(c.name)
      ? `/images/categories/${c.name}.png`
      : getRandomImageUrl(),
  }));
  return (
    <div className="mt-8 cursor-pointer">
      <CategoryCarousel categories={categories} />
    </div>
  );
}
