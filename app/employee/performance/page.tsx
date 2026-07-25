"use client";
import { useState } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";

export default function PerformanceComingSoon() {
  // State for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main container structured to support the header and center the card */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Mobile Header with Hamburger Menu */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-8 flex-shrink-0 z-10 w-full">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-4 text-slate-500 hover:text-slate-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </header>

        {/* Centered Content Wrapper (made relative to hold the background blur) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-y-auto relative">
          {/* Background decorative elements - preserved from your code! */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-50/80 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full z-10">
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

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Performance Analytics
            </h2>

            {/* Pulsing Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Under Construction
            </div>

            <p className="text-slate-500 mb-8 text-sm md:text-base leading-relaxed">
              The Performance tracking module is currently in development. This
              feature will be rolled out alongside the upcoming Project Tasks
              update to provide accurate metrics.
            </p>

            {/* Standardized Return Button */}
            <Link
              href="/employee/dashboard"
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
