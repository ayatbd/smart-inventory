"use client";
import React, { useState, useEffect } from "react";
import { restockAPI } from "@/lib/api";
import {
  AlertCircle,
  ArrowUpCircle,
  Package,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function RestockQueuePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restockQty, setRestockQty] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setIsLoading(true);
    const data = await restockAPI.getRestockData();
    // Requirements: Ordered by lowest stock first
    const sorted = data.lowStockItems.sort(
      (a: any, b: any) => a.stock - b.stock,
    );
    setItems(sorted);
    setIsLoading(false);
  };

  const handleRestock = async (id: string, name: string) => {
    const qty = restockQty[id] || 0;
    if (qty <= 0) return;

    const res = await restockAPI.restock(id, qty);
    if (res.success) {
      setMessage(`Successfully restocked ${name}`);
      setRestockQty({ ...restockQty, [id]: 0 });
      loadQueue(); // Refresh the list - item will disappear if above threshold
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Logic: Priority (High / Medium / Low)
  const getPriority = (stock: number, threshold: number) => {
    if (stock === 0)
      return { label: "High", color: "bg-red-100 text-red-700 border-red-200" };
    if (stock <= threshold / 2)
      return {
        label: "Medium",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      };
    return { label: "Low", color: "bg-blue-100 text-blue-700 border-blue-200" };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Restock Queue</h1>
          <p className="text-slate-500">
            Products currently below their minimum stock threshold.
          </p>
        </div>
        <button
          onClick={loadQueue}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
        >
          <RefreshCw size={22} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={20} /> {message}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Scanning inventory...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center">
          <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Stocked Up!</h3>
          <p className="text-slate-500">
            No products are currently below their thresholds.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item: any) => {
            const priority = getPriority(item.stock, item.threshold);
            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.stock === 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}
                  >
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  {/* Stock Levels */}
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Current Stock
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`text-xl font-black ${item.stock === 0 ? "text-red-600" : "text-slate-900"}`}
                      >
                        {item.stock}
                      </span>
                      <span className="text-slate-300 text-sm">
                        / {item.threshold}
                      </span>
                    </div>
                  </div>

                  {/* Priority Tag */}
                  <div
                    className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${priority.color}`}
                  >
                    {priority.label} Priority
                  </div>

                  {/* Restock Action */}
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={restockQty[item._id] || ""}
                      onChange={(e) =>
                        setRestockQty({
                          ...restockQty,
                          [item._id]: parseInt(e.target.value),
                        })
                      }
                    />
                    <button
                      onClick={() => handleRestock(item._id, item.name)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
                      title="Add to Stock"
                    >
                      <ArrowUpCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Logic Summary Footer */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-indigo-600 mt-0.5" size={18} />
        <div className="text-sm text-indigo-800">
          <p className="font-bold">How the queue works:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>
              Products appear here automatically when stock drops below
              threshold.
            </li>
            <li>
              <strong>High Priority:</strong> Stock is completely empty (0).
            </li>
            <li>
              <strong>Medium Priority:</strong> Stock is at 50% or less of
              threshold.
            </li>
            <li>
              Restocking an item will remove it from this list once it exceeds
              the threshold.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
