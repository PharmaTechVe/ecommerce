'use client';

import Dropdown from '../Dropdown';
import { useRouter } from 'next/navigation';

export default function PresentationDropdown({
  productId,
  options,
}: {
  productId: string;
  options: { id: string; display: string }[];
}) {
  const router = useRouter();
  const handlePresentationSelect = (display: string) => {
    const found = options.find((v) => v.display === display);
    if (found) router.push(`/product/${productId}/presentation/${found.id}`);
  };

  return (
    <Dropdown
      label="Selecciona una presentación"
      items={options.map((v) => v.display)}
      onSelect={handlePresentationSelect}
    />
  );
}
