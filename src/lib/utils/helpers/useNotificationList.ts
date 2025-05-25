'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { NotificationResponse } from '@pharmatech/sdk';
import { api, API_URL } from '@/lib/sdkConfig';

export function useNotifications(token?: string) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const lastMsgRef = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = async (markAsRead = false) => {
    if (!token) return;
    try {
      const res = await api.notification.getNotifications(token);
      if (Array.isArray(res)) {
        const unread = res.filter((n) => !n.isRead);
        setNotifications(res);
        setNotificationCount(unread.length);
        if (markAsRead && unread.length > 0) {
          await Promise.all(
            unread.map((notif) =>
              api.notification.markAsRead(notif.order.id, token),
            ),
          );
          setNotifications((prev) =>
            prev.map((n) =>
              unread.some((u) => u.id === n.id) ? { ...n, isRead: true } : n,
            ),
          );
          setNotificationCount(0);
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const toggleNotifications = async () => {
    const willOpen = !isNotificationsOpen;
    setIsNotificationsOpen(willOpen);
    if (willOpen) {
      await fetchNotifications(true);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let aborted = false;
    let retryId: NodeJS.Timeout;
    const connect = () => {
      fetchEventSource(`${API_URL}/notification/stream`, {
        headers: { Authorization: `Bearer ${token}` },
        openWhenHidden: true,
        onopen: async (res) => {
          if (res.ok) console.log('SSE abierta');
        },
        onmessage(ev) {
          const msg = ev.data?.trim();
          if (!msg || msg === lastMsgRef.current) return;
          lastMsgRef.current = msg;
          setNotificationCount((c) => c + 1);
        },
        onclose() {
          if (!aborted) retryId = setTimeout(connect, 5000);
        },
        onerror() {
          if (!aborted) retryId = setTimeout(connect, 5000);
        },
      });
    };
    connect();
    return () => {
      aborted = true;
      clearTimeout(retryId);
    };
  }, [token]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        isNotificationsOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    },
    [isNotificationsOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
    notifications,
    notificationCount,
    isNotificationsOpen,
    toggleNotifications,
    panelRef,
  };
}
