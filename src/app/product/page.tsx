'use client';
import React from 'react';
import NavBar, { NavBarProps } from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Badge from '@/components/Badge';
import Carousel from '@/components/Product/Carousel';
import Dropdown from '@/components/Dropdown';
import CardButton from '@/components/CardButton';
import { Colors, FontSizes } from '@/styles/styles';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ProductDetailPage() {
  // Cambiar por la respuesta de la API
  const product = {
    id: '1',
    name: 'Acetaminofén 650 mg Genven Caja x 10 Tabletas',
    description:
      'Analgésico y antipirético de uso común para aliviar el dolor y reducir la fiebre.',
    category: 'Salud',
    price: 15.0,
    brand: 'Genven',
    stock: 100,
    slides: [
      { id: 1, imageUrl: '/images/product-detail.jpg' },
      { id: 2, imageUrl: '/images/product-detail-2.jpg' },
      { id: 3, imageUrl: '/images/product-detail.jpg' },
      { id: 4, imageUrl: '/images/product-detail-2.jpg' },
    ],
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    {
      label: product.category,
      href: `/category/${product.category.toLowerCase()}`,
    },
    { label: product.name, href: `/product/${product.id}` },
  ];

  const variantOptions = [
    'Acetaminofén 650 mg Genven Caja x 20 Tabletas',
    'Acetaminofén 650 mg Genven Caja x 15 Tabletas',
    'Acetaminofén 800 mg Genven Caja x 10 Tabletas',
  ];

  const navBarProps: NavBarProps = {
    isLoggedIn: true,
    avatarProps: {
      name: 'Juan Pérez',
      imageUrl: '/images/profilePic.jpeg',
      size: 52,
      withDropdown: true,
      dropdownOptions: [
        { label: 'Perfil', route: '/profile' },
        { label: 'Cerrar sesión', route: '/logout' },
      ],
    },
  };

  return (
    <div>
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        <NavBar {...navBarProps} />
      </div>
      <main className="mx-auto mt-6 max-w-7xl p-4 pt-[100px]">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Carousel slides={product.slides} />
          <div className="flex flex-col space-y-4">
            <div>
              {product.brand && (
                <Badge variant="filled" color="info" size="medium">
                  {product.brand}
                </Badge>
              )}
            </div>
            <h1
              className="text-3xl"
              style={{
                fontSize: `${FontSizes.h3.size}px`,
                lineHeight: `${FontSizes.h3.lineHeight}px`,
                color: Colors.textMain,
              }}
            >
              {product.name}
            </h1>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex items-center justify-between">
              <p
                className="text-lg"
                style={{
                  fontSize: `${FontSizes.h5.size}px`,
                  color: Colors.textMain,
                }}
              >
                ${product.price.toFixed(2)}
              </p>
              <CardButton />
            </div>
            <Dropdown
              label="Selecciona una presentación"
              items={variantOptions}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
