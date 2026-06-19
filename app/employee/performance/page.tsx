"use client";
import { useState } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";

export default function PerformanceComingSoon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen p-8 items-center justify-center text-center relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full z-10">
          {/* Analytics / Trending Up Icon */}
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Performance Analytics
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Under Construction
          </div>

          <p className="text-slate-500 mb-8 leading-relaxed">
            The Performance tracking module is currently in development. This
            feature will be rolled out alongside the upcoming Project Tasks
            update to provide accurate metrics.
          </p>

          <Link
            href="/employee/dashboard"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Go Back
          </Link>
        </div>
      </main>
    </div>
  );
}
