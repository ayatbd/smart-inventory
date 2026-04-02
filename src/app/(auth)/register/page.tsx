"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Lock,
  Mail,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Basic Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call Backend API
      const data = await api.signup(email, password);

      if (data.acknowledged === true) {
        console.log(data);
        setError("");
        setIsSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Connection error. Is the backend server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl text-white mb-4">
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Join the Inventory Management System
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-3">
            <CheckCircle2 size={20} />
            <div>
              <p className="font-bold">Success!</p>
              <p>Account created. Redirecting to login...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !isSuccess && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                placeholder="your@email.com"
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
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                placeholder="Repeat password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {isLoading ? "Creating Account..." : "Register Now"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
