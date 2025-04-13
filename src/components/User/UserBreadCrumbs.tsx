'use client';

import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function UserBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbLabels: Record<string, string> = {
    user: 'Mi Perfil',
    address: 'Mis Direcciones',
    edit: 'Editar Perfil',
    'edit-address': 'Editar Dirección',
    new: 'Nueva Dirección',
    security: 'Seguridad',
    updatePassword: 'Actualizar Contraseña',
    recoverPassword: 'Recuperar Contraseña',
  };

  const nonClickableSegments = ['security', 'edit-address', 'new'];

  const segments = pathname.split('/').filter(Boolean);

  const isUUID = (segment: string) => /^[0-9a-fA-F-]{36}$/.test(segment);

  const cleanedSegments = segments.flatMap((segment, index, arr) => {
    if (isUUID(segment) && arr[index + 1] === 'edit-address') {
      return [];
    }
    return [segment];
  });

  const limitedSegments =
    cleanedSegments.includes('updatePassword') ||
    cleanedSegments.includes('recoverPassword')
      ? cleanedSegments.slice(0, cleanedSegments.indexOf('security') + 1)
      : cleanedSegments;

  const items: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
  ];
  let currentPath = '';

  limitedSegments.forEach((segment, index) => {
    const label = breadcrumbLabels[segment] || segment;
    currentPath += `/${segment}`;
    const isLast = index === limitedSegments.length - 1;

    if (isLast || nonClickableSegments.includes(segment)) {
      items.push({ label });
    } else {
      items.push({ label, href: currentPath });
    }
  });

  return <Breadcrumb items={items} />;
}
