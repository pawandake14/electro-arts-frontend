"use client";
import { useState } from "react";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function ProjectTasksComingSoon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen p-8 items-center justify-center text-center">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full">
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
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-slate-500 mb-6">
            The Project Tasks module is currently under development. This
            feature will be available in the upcoming system upgrade.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}
