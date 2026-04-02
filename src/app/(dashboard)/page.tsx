"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ShoppingCart, AlertTriangle, DollarSign, Package } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats);
  }, []);

  if (!stats) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="text-blue-600" />}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          icon={<DollarSign className="text-green-600" />}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={<AlertTriangle className="text-red-600" />}
        />
        <StatCard
          title="Active Products"
          value={stats?.products?.length}
          icon={<Package className="text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" /> Restock Queue
          </h2>
          <div className="space-y-3">
            {stats.lowStockItems.map((item: any) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-red-600">
                    Only {item.stock} left (Threshold: {item.threshold})
                  </p>
                </div>
                <button className="text-sm bg-white border border-red-200 px-3 py-1 rounded shadow-sm hover:bg-red-100">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="font-bold mb-4">Inventory Summary</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Product</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.products?.slice(0, 5).map((item: any) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.stock}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${item.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  );
}
