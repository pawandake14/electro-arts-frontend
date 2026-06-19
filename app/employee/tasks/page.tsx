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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            ></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Tasks</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Manage your tasks and track your progress. It is currently under
          construction, but you can explore other sections of the employee
          portal using the navigation menu. We are working hard to bring you a
          comprehensive task management experience soon!
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
