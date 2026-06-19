"use client";
import { useState } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";

export default function AnnouncementsComingSoon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen p-8 items-center justify-center text-center">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full">
          {/* Megaphone Icon specifically for Announcements */}
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
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-slate-500 mb-8">
            The Company Announcements module is currently under development.
            This feature will be available in the upcoming system upgrade.
          </p>
          <Link
            href="/employee/dashboard"
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
          >
            Go Back
          </Link>
        </div>
      </main>
    </div>
  );
}
