"use client";
import { Search, Bell, UserCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) setUserName(user.email.split("@")[0]);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
      {/* Left: Search Bar */}
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search products or orders..."
          className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Settings size={20} />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 capitalize">
              {userName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Manager
            </p>
          </div>
          <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
