import Breadcrumb from '@/components/Breadcrumb';
import Badge from '@/components/Badge';
import Carousel from '@/components/Product/Carousel';
import CardButton from '@/components/CardButton';
import ProductBranch from '@/components/Product/ProductBranch';
import ProductCarousel from '@/components/Product/ProductCarousel';
import { StarIcon } from '@heroicons/react/24/solid';
import { Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import { formatPrice } from '@/lib/utils/helpers/priceFormatter';
import PresentationDropdown from '@/components/Product/PresentationDropdown';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string; presentationId: string }>;
}) {
  const { productId, presentationId } = await params;

  const presentation = await api.productPresentation.getByPresentationId(
    productId,
    presentationId,
  );

  const genericProduct = await api.genericProduct.getById(productId);

  const slides = await api.productImage
    .getByProductId(genericProduct.id)
    .then((imgs) =>
      imgs.length
        ? imgs.map((img, i) => ({ id: i, imageUrl: img.url }))
        : [
            { id: 1, imageUrl: '/images/product-detail.jpg' },
            { id: 2, imageUrl: '/images/product-detail-2.jpg' },
          ],
    )
    .catch(() => [
      { id: 1, imageUrl: '/images/product-detail.jpg' },
      { id: 2, imageUrl: '/images/product-detail-2.jpg' },
    ]);

  const presentationList =
    await api.productPresentation.getByProductId(productId);

  const relatedProducts = await api.product.getProducts({
    page: 1,
    limit: 20,
    ...(genericProduct.manufacturer.id && {
      manufacturerId: [genericProduct.manufacturer.id],
    }),
  });

  // Breadcrumb con acción de "volver" si es búsqueda personalizada
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    {
      label: genericProduct.categories?.[0]?.name ?? 'Categoría',
      href: `/search?category=${genericProduct.categories?.[0]?.name}`,
    },
    { label: presentation.presentation.name },
  ];

  const variantOptions = presentationList.map((item) => ({
    id: item.presentation.id,
    display: `${genericProduct.genericName} ${item.presentation.name} ${item.presentation.quantity} ${item.presentation.measurementUnit}`,
  }));

  return (
    <main className="mx-auto mb-12 max-w-7xl p-4">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Carousel slides={slides} />
        <div className="flex flex-col space-y-4">
          <div>
            <Badge variant="filled" color="info" size="medium">
              {genericProduct.manufacturer.name}
            </Badge>
          </div>
          <h1 className="text-3xl" style={{ color: Colors.textMain }}>
            {`${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name} ${presentation.presentation.quantity} ${presentation.presentation.measurementUnit}`}
          </h1>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600">
            {presentation.presentation.description}
          </p>
          <p className="text-md text-gray-600">
            Existencia: {presentation.stock || 0}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-900">
              ${formatPrice(presentation.price)}
            </p>
            <CardButton
              product={{
                productPresentationId: presentation.id,
                name: `${genericProduct.genericName} ${genericProduct.name} ${presentation.presentation.name}`,
                price: presentation.price,
                stock: presentation.stock || 0,
                image: slides[0]?.imageUrl || '',
              }}
            />
          </div>
          <PresentationDropdown
            options={variantOptions}
            productId={productId}
          />
        </div>
      </div>

      <div className="my-10">
        <ProductBranch productPresentationId={presentation.id} />
      </div>

      <div className="mt-3">
        <h3 className="mb-6 text-2xl font-semibold text-[#1C2143]">
          Productos de la marca {genericProduct.manufacturer.name}
        </h3>
        <ProductCarousel products={relatedProducts.results.map((p) => p)} />
      </div>
    </main>
  );
}
