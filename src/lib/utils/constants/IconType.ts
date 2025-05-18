export type IconType =
  | 'CONFIRMATION'
  | 'READY_TO_SHIP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'ERROR'
  | 'STATUS_UPDATE'
  | 'PARTIALLY_SHIPPED';

export const getIconType = (status: string, type: string): IconType => {
  if (status === 'canceled') {
    return 'ERROR';
  }

  switch (status) {
    case 'approved':
      return type === 'pickup' ? 'CONFIRMATION' : 'STATUS_UPDATE';
    case 'ready_for_pickup':
      return 'READY_TO_SHIP';
    case 'in_progress':
      return 'IN_TRANSIT';
    case 'completed':
      return 'DELIVERED';
    default:
      return 'STATUS_UPDATE';
  }
};

export const iconMap: Record<IconType, string> = {
  CONFIRMATION: '/icons/approved.svg',
  READY_TO_SHIP: '/icons/pickup_icon.svg',
  IN_TRANSIT: '/icons/delivery.svg',
  DELIVERED: '/icons/delivered_icon.svg',
  ERROR: '/icons/error.svg',
  STATUS_UPDATE: '/icons/in_update.svg',
  PARTIALLY_SHIPPED: '/icons/partially-shipped.svg',
};
