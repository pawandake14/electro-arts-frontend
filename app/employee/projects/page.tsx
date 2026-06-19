"use client";

import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/dist/client/link";

export default function MyTasks() {
  // A quick logout function so you don't get stuck on this page during testing!
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center font-sans text-slate-800">
      <EmployeeSidebar />
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full mx-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Projects</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          this section is currently under construction, but you can explore
          other sections of the employee portal using the navigation menu. We
          are working hard to bring you a comprehensive project management
          experience soon!
        </p>

        <Link
          href="/employee/dashboard"
          className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
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
  );
}
