'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import NotificationList from '@/components/User/NotificationList';
import type { NotificationResponse } from '@pharmatech/sdk';

interface Props {
  isMobile?: boolean;
  notificationCount: number;
  isOpen: boolean;
  onToggle: () => void;
  notifications: NotificationResponse[];
}

export default function NotificationBell({
  isMobile = false,
  notificationCount,
  isOpen,
  onToggle,
  notifications,
}: Props) {
  return (
    <div className="relative">
      {notificationCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF9595] text-xs font-semibold text-white">
          {notificationCount}
        </span>
      )}

      <BellIcon
        onClick={onToggle}
        className={`${isMobile ? 'h-8 w-8' : 'h-7 w-7'} cursor-pointer text-gray-700 hover:text-black`}
      />

      {isOpen && (
        <div
          className={`absolute right-0 z-50 mt-3 rounded-xl bg-white shadow-lg ${
            isMobile ? 'max-h-[500px] w-[300px]' : 'max-h-[600px] w-[400px]'
          } overflow-y-auto`}
        >
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
}
