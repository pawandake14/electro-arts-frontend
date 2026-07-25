"use client";
import { useState } from "react";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function ProjectTasksComingSoon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 🔥 FIX 1: Removed items-center, justify-center, and p-8 from main */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Header now spans the full width perfectly at the top */}
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

        {/* 🔥 FIX 2: Wrapped the card in a new div that handles the perfect centering */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-y-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Coming Soon
            </h2>
            <p className="text-slate-500 mb-6 text-sm md:text-base">
              The Project Tasks module is currently under development. This
              feature will be available in the upcoming system upgrade.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
