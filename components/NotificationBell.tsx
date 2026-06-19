"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("process.env.NEXT_PUBLIC_API_URL");

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  interface Notification {
    message: string;
    createdAt: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    socket.emit("register", userId);

    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [userId]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 text-slate-400 hover:text-slate-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
          <div className="p-3 border-b font-bold text-sm">Notifications</div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.map((n, i) => (
              <div key={i} className="p-3 text-xs border-b hover:bg-slate-50">
                {n.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
