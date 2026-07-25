"use client";
import { useState } from "react";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function AnnouncementsComingSoon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Changed the main tag to allow the header to span the top */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* The injected mobile-responsive header */}
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

        {/* The new centering wrapper for the content card */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-y-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full">
            {/* Your Megaphone Icon */}
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                ></path>
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Coming Soon
            </h2>
            <p className="text-slate-500 mb-8 text-sm md:text-base">
              The Company Announcements module is currently under development.
              This feature will be available in the upcoming system upgrade.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
