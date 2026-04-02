"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  AlertTriangle,
  History,
  LogOut,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { name: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  {
    name: "Restock Queue",
    icon: AlertTriangle,
    href: "/dashboard/restock",
    color: "text-amber-500",
  },
  { name: "Activity Log", icon: History, href: "/dashboard/activity" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Package size={20} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">
          SmartStock
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: User & Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
