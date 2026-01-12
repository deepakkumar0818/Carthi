"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Car,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  X,
  Check,
  Clock,
  Filter,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

interface Notification {
  id: string;
  type: "lead" | "status" | "valuation" | "system" | "team";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const allNotifications: Notification[] = [
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
  {
    id: "6",
    type: "lead",
    title: "Follow-up Reminder",
    message: "Don't forget to follow up with Lead L004 - Sneha Gupta today",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
    actionUrl: "/leads/L004",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Bell className="h-10 w-10 mr-3 text-primary-600" />
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your leads and system activities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Unread</p>
                <p className="text-3xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Today</p>
                <p className="text-3xl font-bold text-green-600">3</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === "unread"
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-12 text-center">
              <div className="h-24 w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
                getIcon={getIcon}
                getIconColor={getIconColor}
                getTimeAgo={getTimeAgo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
  getIcon,
  getIconColor,
  getTimeAgo,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => React.ElementType;
  getIconColor: (type: string) => string;
  getTimeAgo: (timestamp: string) => string;
}) => {
  const Icon = getIcon(notification.type);

  const content = (
    <div
      className={`glass-effect rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-lg transition-all ${
        !notification.read ? "ring-2 ring-primary-200" : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`h-12 w-12 bg-gradient-to-br ${getIconColor(
            notification.type
          )} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
              {!notification.read && (
                <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
              )}
            </div>
            <button
              onClick={() => onDelete(notification.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-700 mb-3">{notification.message}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {getTimeAgo(notification.timestamp)}
            </span>
            <div className="flex gap-2">
              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkRead(notification.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark Read
                </Button>
              )}
              {notification.actionUrl && (
                <Link href={notification.actionUrl}>
                  <Button size="sm">View Details</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
};
