'use client';

import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function UserBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbLabels: Record<string, string> = {
    user: 'Mi Perfil',
    edit: 'Editar Perfil',
    security: 'Seguridad',
  };

  const nonClickableSegments = ['security'];

  const segments = pathname.split('/').filter(Boolean);
  const limitedSegments =
    segments.includes('updatePassword') || segments.includes('recoverPassword')
      ? segments.slice(0, segments.indexOf('security') + 1)
      : segments;

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
