'use client';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ProductCarousel from '@/components/Product/ProductCarousel';
import ProductCard from '@/components/Product/ProductCard';
import Image1 from '@/lib/utils/images/Rectangle 1.png';
import Image2 from '@/lib/utils/images/Rectangle 1 (4).png';
import Footer from '@/components/Footer';

export default function Home() {
  const avatarProps = {
    name: 'Juan Pérez',
    imageUrl: '/images/profilePic.jpeg',
    size: 52,
    showStatus: true,
    isOnline: true,
    withDropdown: true,
    dropdownOptions: [
      { label: 'Perfil', route: '/profile' },
      { label: 'Cerrar sesión', route: '/login' },
    ],
  };

  const navBarProps: NavBarProps = {
    isLoggedIn: true,
    avatarProps,
  };

  const slides = [
    { id: 1, imageUrl: '/images/banner-oferta.png' },
    { id: 2, imageUrl: '/images/banner-pharma.png' },
    { id: 3, imageUrl: '/images/banner-oferta.png' },
    { id: 4, imageUrl: '/images/banner-prueba.png' },
  ];

  const singleProduct = {
    id: 1,
    productName: 'Lansoprazol 30mg x 14 Tabletas AAAAA',
    stock: 10,
    currentPrice: 25.99,
    lastPrice: 30.99,
    discountPercentage: 15,
    ribbonText: 'Nueva Oferta',
    imageSrc: Image1,
    label: 'Popular',
  };

  // Array de ProductCard ya renderizados
  const productsMinimal = [
    <ProductCard
      key={1}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="minimal"
    />,
    <ProductCard
      key={2}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="minimal"
    />,
    <ProductCard
      key={3}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText="Nuevo!!"
      label={singleProduct.label}
      variant="minimal"
    />,
  ];
  const productsRegular = [
    <ProductCard
      key={1}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="regular"
    />,
    <ProductCard
      key={2}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="regular"
    />,
    <ProductCard
      key={3}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText="Nuevo!!"
      label={singleProduct.label}
      variant="regular"
    />,
  ];
  const productsResponsive = [
    <ProductCard
      key={1}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="responsive"
    />,
    <ProductCard
      key={2}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText={singleProduct.ribbonText}
      label={singleProduct.label}
      variant="responsive"
    />,
    <ProductCard
      key={3}
      imageSrc={Image2}
      productName={singleProduct.productName}
      stock={singleProduct.stock}
      currentPrice={singleProduct.currentPrice}
      ribbonText="Nuevo!!"
      label={singleProduct.label}
      variant="responsive"
    />,
  ];

  return (
    <div>
      {/* Navbar fijado */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        <NavBar {...navBarProps} />
      </div>

      <main className="p-4 pt-[124px]">
        <h1 className="text-2xl font-bold">Pharmatech</h1>

        {/* Carousel de banners */}
        <div className="mx-auto w-full max-w-[95vw] p-2 md:max-w-6xl md:p-4">
          <Carousel slides={slides} />
          <div>
            <h3 className="pt-4 text-[32px] text-[#1C2143]">
              Productos en Oferta Exclusiva
            </h3>
          </div>

          {/* Product Cards Carousel */}
          <div className="mt-8">
            <ProductCarousel isLargeCarousel={true}>
              {productsMinimal}
            </ProductCarousel>
            <div>
              <h3 className="text-[32px] text-[#1C2143]">
                Categoría Medicamentos
              </h3>
            </div>
            <ProductCarousel>{productsRegular}</ProductCarousel>
            <ProductCarousel>{productsResponsive}</ProductCarousel>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
