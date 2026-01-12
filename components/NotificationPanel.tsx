"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Car,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "./Badge";

interface Notification {
  id: string;
  type: "lead" | "status" | "valuation" | "system" | "team";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "lead",
    title: "New Lead Assigned",
    message: "You have been assigned a new lead: Rajesh Kumar - Maruti Swift",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    actionUrl: "/leads/L001",
  },
  {
    id: "2",
    type: "status",
    title: "Lead Status Updated",
    message: "Lead L002 - Priya Sharma moved to Valuation Scheduled",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionUrl: "/leads/L002",
  },
  {
    id: "3",
    type: "valuation",
    title: "Valuation Completed",
    message: "Valuation for Lead L003 - Amit Patel has been completed. Final offer: ₹7,75,000",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    actionUrl: "/leads/L003",
  },
  {
    id: "4",
    type: "team",
    title: "Team Performance Update",
    message: "Your team closed 3 deals this week! Great work!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    actionUrl: "/team",
  },
  {
    id: "5",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday 2:00 AM - 4:00 AM IST",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "lead":
        return Car;
      case "status":
        return TrendingUp;
      case "valuation":
        return DollarSign;
      case "team":
        return Users;
      case "system":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "lead":
        return "from-blue-500 to-cyan-500";
      case "status":
        return "from-purple-500 to-pink-500";
      case "valuation":
        return "from-green-500 to-emerald-500";
      case "team":
        return "from-orange-500 to-red-500";
      case "system":
        return "from-gray-500 to-gray-600";
      default:
        return "from-primary-500 to-secondary-500";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 glass-effect rounded-2xl shadow-2xl border border-white/20 z-50 animate-in slide-in-from-top-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No notifications</p>
                <p className="text-sm text-gray-500 mt-1">We'll notify you when something arrives</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getIcon}
                    getIconColor={getIconColor}
                    getTimeAgo={getTimeAgo}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
            <Link
              href="/notifications"
              className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 py-2"
              onClick={() => setIsOpen(false)}
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  getIcon,
  getIconColor,
  getTimeAgo,
  onClose,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => React.ElementType;
  getIconColor: (type: string) => string;
  getTimeAgo: (timestamp: string) => string;
  onClose: () => void;
}) => {
  const Icon = getIcon(notification.type);

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
    if (notification.actionUrl) {
      onClose();
    }
  };

  const content = (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
        !notification.read ? "bg-blue-50/50" : ""
      }`}
      onClick={handleClick}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-primary-600 rounded-full"></div>
      )}

      <div className="flex items-start space-x-3 ml-4">
        {/* Icon */}
        <div
          className={`h-10 w-10 bg-gradient-to-br ${getIconColor(
            notification.type
          )} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold text-gray-900 mb-1">
              {notification.title}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>;
  }

  return content;
};
