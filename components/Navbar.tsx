"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Users, BarChart3, Settings, Search } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/leads", label: "Leads", icon: Car },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/leads" className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                CARTHI
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-white/70 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all">
              <Search className="h-5 w-5" />
            </button>
            <NotificationPanel />
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Paresh</p>
                <p className="text-xs text-gray-500">paresh@carthi.com</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-lg">
                P
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
