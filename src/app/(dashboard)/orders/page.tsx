"use client";
import React, { useState, useEffect } from "react";
import { orderAPI, inventoryAPI } from "@/lib/api";
import {
  Plus,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    const [ordersData, productsData] = await Promise.all([
      orderAPI.getOrders(),
      inventoryAPI.getProducts(),
    ]);
    setOrders(ordersData);
    setProducts(productsData);
    setIsLoading(false);
  };

  // Conflict Handling & Stock Validation (Requirement #4 & #6)
  const addToCart = () => {
    setError("");
    const product = products.find((p) => p._id === selectedProductId);

    if (!product) return;

    // 1. Prevent ordering inactive products
    if (product.status === "Out of Stock") {
      setError("This product is currently unavailable.");
      return;
    }

    // 2. Prevent duplicate entries in the same order
    const alreadyInCart = cart.find(
      (item) => item.productId === selectedProductId,
    );
    if (alreadyInCart) {
      setError("This product is already added to the order.");
      return;
    }

    // 3. Check stock availability
    if (selectedQty > product.stock) {
      setError(`Only ${product.stock} items available in stock.`);
      return;
    }

    const newItem = {
      productId: product._id,
      name: product.name,
      quantity: Number(selectedQty),
      price: product.price,
    };

    setCart([...cart, newItem]);
    setSelectedProductId("");
    setSelectedQty(1);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return setError("Add at least one product.");

    const res = await orderAPI.createOrder({ customerName, items: cart });

    if (res.success) {
      setCart([]);
      setCustomerName("");
      setIsModalOpen(false);
      refreshData();
    } else {
      setError(res.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    await orderAPI.updateStatus(id, status);
    refreshData();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="text-amber-500" />;
      case "Shipped":
        return <Truck size={16} className="text-blue-500" />;
      case "Delivered":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "Cancelled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">
            Manage customer purchases and fulfillment.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={20} /> New Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-slate-500 text-sm font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {order.items
                    .map((i) => `${i.quantity}x ${i.name}`)
                    .join(", ")}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  ${order.totalPrice}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">{order.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    value={order.status}
                    className="text-xs bg-slate-100 border-none rounded px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={22} /> Create New Order
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {/* Customer Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Customer Name
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* Product Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Select Product
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {products.map((p) => (
                      <option
                        key={p._id}
                        value={p._id}
                        disabled={p.status === "Out of Stock"}
                      >
                        {p.name} ({p.stock} left)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(e.target.value)}
                    min="1"
                  />
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  className="bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  Add Item
                </button>
              </div>

              {/* Cart List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  Order Items ({cart.length})
                </h3>
                {cart.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    No items added yet.
                  </p>
                ) : (
                  <div className="divide-y border rounded-lg">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.quantity} x ${item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold">
                            ${item.quantity * item.price}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Total Amount
                </p>
                <p className="text-2xl font-black text-indigo-600">
                  ${calculateTotal()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
