'use client';

import Image from 'next/image';
import type { NotificationResponse } from '@pharmatech/sdk';
import { getIconType, iconMap } from '@/lib/utils/constants/IconType';
import { formatTimeAgo } from '@/lib/utils/constants/DateUtils';

type Props = {
  notifications: NotificationResponse[];
};

export default function NotificationList({ notifications }: Props) {
  return (
    <section
      className="max-h-[600px] overflow-y-auto rounded-lg bg-white p-6 shadow-md"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Notificaciones
      </h2>
      <ul className="space-y-5">
        {notifications.map((notif) => {
          const iconType = getIconType(notif.order.status, notif.order.type);
          const title = `Orden #${notif.order.id}`;
          const timeAgo = formatTimeAgo(notif.createdAt);

          return (
            <li
              key={notif.id}
              className={`flex items-start justify-between gap-4 ${!notif.isRead ? 'bg-gray-50' : ''}`}
            >
              <div className="flex gap-3">
                <div className="h-8 w-8 flex-shrink-0">
                  <Image
                    src={iconMap[iconType] || '/icons/default.png'}
                    alt="icono de notificación"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">
                    {notif.message.trim()}
                  </p>
                </div>
              </div>
              <div className="whitespace-nowrap text-sm text-gray-500">
                {timeAgo}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
