"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/FadeIn";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call your Node.js backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        // 2. Based on the role returned from the server, redirect
        if (data.user.role === "Admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "Employee") {
          router.push("/employee/dashboard");
        } else if (data.user.role === "Reception") {
          router.push("/reception/dashboard");
        } else {
          // Catch-all for Managers, Reception, Store (we'll build these later)
          router.push(`/${data.user.role.toLowerCase()}/dashboard`);
        }
      } else {
        alert(data.message); // Show error if login fails
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <FadeIn direction="up">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#111f38]">Login Portal</h2>
            <p className="mt-2 text-sm text-slate-500">
              Secure access for staff members
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Added placeholder:text-slate-400 and text-slate-900
                  className="w-full mt-1 px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900"
                  placeholder="admin@electroarts.in"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Added placeholder:text-slate-400 and text-slate-900
                  className="w-full mt-1 px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#111f38] hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
