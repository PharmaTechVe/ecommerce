'use client';

import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function UserBreadcrumbs() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = usePathname();
  const breadcrumbLabels: Record<string, string> = {
    user: 'Mi Perfil',
    address: 'Mis Direcciones',
    edit: 'Editar Perfil',
    editAddress: 'Editar Dirección',
    new: 'Nueva Dirección',
    security: 'Seguridad',
    'update-password': 'Actualizar Contraseña',
    'recover-password': 'Recuperar Contraseña',
  };
  const nonClickableSegments = ['security', 'new'];
  const segments = pathname.split('/').filter(Boolean);
  const isUUID = (segment: string) => /^[0-9a-fA-F-]{36}$/.test(segment);

  const cleanedSegments = [];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];

    if (isUUID(segment) && segments[index + 1] === 'edit') {
      cleanedSegments.push('editAddress');
      break;
    }
    cleanedSegments.push(segment);
  }

  const limitedSegments =
    cleanedSegments.includes('update-password') ||
    cleanedSegments.includes('recover-password')
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
