"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, LayoutDashboard, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle actual login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard"); // Redirect after login
    }, 1500);
  };

  // Requirement: Demo Login button (Pre-filled credentials)
  const handleDemoLogin = () => {
    setEmail("admin@inventory.com");
    setPassword("password123");

    // Optional: Auto-submit after a brief delay
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white mb-4">
            <LayoutDashboard size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">
            Manage your stock and orders efficiently
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Main Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Testing the app?
              </span>
            </div>
          </div>

          {/* Requirement: Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition duration-200 border border-slate-200"
          >
            Try Demo Account
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
