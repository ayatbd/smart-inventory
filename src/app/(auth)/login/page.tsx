"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import {
  Lock,
  Mail,
  LayoutDashboard,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await api.login(email, password);

      if (data.success) {
        // Save user info to localStorage so the app remembers them
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server is not responding. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // Requirement: Demo Login button
  const handleDemoLogin = () => {
    const demoEmail = "admin@inventory.com";
    const demoPass = "123456";
    setEmail(demoEmail);
    setPassword(demoPass);

    // We use a small timeout to let the state update visually before submitting
    setTimeout(() => {
      setIsLoading(true);
      api.login(demoEmail, demoPass).then((data) => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
        }
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl text-white mb-4">
            <LayoutDashboard size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventory System
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Log in to manage your stock and orders
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                placeholder="admin@inventory.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Processing..." : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-2 bg-white text-xs text-slate-400 uppercase">
              Test Account
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition border border-slate-200"
          >
            Try Demo Account
          </button>
        </form>
      </div>
    </div>
  );
}
