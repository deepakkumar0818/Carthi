import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    "New": "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    "Contacted": "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    "Valuation Scheduled": "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    "Valuation Completed": "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    "Negotiation": "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
    "Closed": "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "Rejected": "bg-gradient-to-r from-red-500 to-red-600 text-white",
    "Pending": "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
    "Scheduled": "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    "Completed": "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "Approved": "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "Website": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    "Call": "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    "Walk-in": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    "Partner": "bg-gradient-to-r from-orange-500 to-red-500 text-white",
    "Petrol": "bg-gradient-to-r from-red-400 to-red-500 text-white",
    "Diesel": "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
    "CNG": "bg-gradient-to-r from-green-400 to-green-500 text-white",
    "Electric": "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
    "Manual": "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    "Automatic": "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
  };
  return colors[status] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
}
