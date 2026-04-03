"use client";
import React, { useState, useEffect } from "react";
import { activityAPI } from "@/lib/api";
import {
  History,
  ShoppingCart,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  UserCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    // Refresh logs every 30 seconds automatically
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    const data = await activityAPI.getActivities();
    setLogs(data);
    setIsLoading(false);
  };

  // Logic: Choose Icon and Color based on the text in the log
  const getLogDetails = (action: string) => {
    const text = action.toLowerCase();
    if (text.includes("order"))
      return {
        icon: <ShoppingCart size={18} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    if (text.includes("stock") || text.includes("restock"))
      return {
        icon: <RefreshCw size={18} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    if (text.includes("low stock") || text.includes("alert"))
      return {
        icon: <AlertTriangle size={18} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
      };
    if (text.includes("added") || text.includes("product"))
      return {
        icon: <PlusCircle size={18} />,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      };
    if (text.includes("user") || text.includes("registered"))
      return {
        icon: <UserCircle size={18} />,
        color: "text-purple-600",
        bg: "bg-purple-50",
      };
    return {
      icon: <History size={18} />,
      color: "text-slate-600",
      bg: "bg-slate-50",
    };
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-500">
            A real-time audit trail of all system actions.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading && logs.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            No recent activity recorded.
          </div>
        ) : (
          <div className="relative">
            {/* The Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 ml-0.5"></div>

            <div className="divide-y divide-slate-50">
              {logs.map((log: any, index: number) => {
                const details = getLogDetails(log.action);
                return (
                  <div
                    key={log._id}
                    className="relative flex items-start gap-6 p-6 hover:bg-slate-50/50 transition group"
                  >
                    {/* Time Column */}
                    <div className="w-20 pt-1 text-right">
                      <p className="text-xs font-bold text-slate-900">
                        {formatTime(log.timestamp)}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">
                        {formatDate(log.timestamp)}
                      </p>
                    </div>

                    {/* Icon Column (Over the line) */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${details.bg} ${details.color}`}
                    >
                      {details.icon}
                    </div>

                    {/* Action Content */}
                    <div className="flex-1 pt-1.5">
                      <p className="text-slate-700 font-medium leading-tight">
                        {log.action}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock size={12} />
                        <span>System Auto-Log</span>
                        <ArrowRight size={10} />
                        <span className="hover:underline cursor-pointer text-indigo-400">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
          <History size={14} /> Showing latest system events
        </p>
      </div>
    </div>
  );
}
