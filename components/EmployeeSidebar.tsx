"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmployeeSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Fetch the logged-in user's details when the sidebar loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-blue-600 text-white font-medium shadow-md"
        : "text-slate-300 hover:bg-slate-800"
    }`;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#0B132B] text-slate-300 flex flex-col shadow-xl z-50 overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/50 sticky top-0 bg-[#0B132B] z-10">
          <div className="text-2xl font-bold text-white flex items-center">
            <span className="text-3xl text-cyan-500 mr-2">E</span>
            <span className="text-sm tracking-widest mt-1">ELECTRO ARTS</span>
          </div>
          <button
            onClick={() => setIsOpen && setIsOpen(false)}
            className="md:hidden ml-auto text-slate-400 hover:text-white"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* UPDATED: Dynamic User Profile */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
          <div className="flex-shrink-0">
            {user?.gender === "Male" ? (
              <img
                src="/avatars/male-avatar.png"
                alt="Male Avatar"
                className="w-10 h-10 rounded-full border border-slate-600 bg-white"
              />
            ) : user?.gender === "Female" ? (
              <img
                src="/avatars/female-avatar.png"
                alt="Female Avatar"
                className="w-10 h-10 rounded-full border border-slate-600 bg-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {user?.firstName?.charAt(0) || "E"}
                {user?.lastName?.charAt(0) || "M"}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-white font-bold text-sm truncate w-full">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {user?.role || "Employee Account"}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          <Link
            href="/employee/dashboard"
            className={getLinkClass("/employee/dashboard")}
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
            Dashboard
          </Link>
          <Link
            href="/employee/attendance"
            className={getLinkClass("/employee/attendance")}
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Attendance
          </Link>
          <Link
            href="/employee/tasks"
            className={getLinkClass("/employee/tasks")}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
            My Tasks
          </Link>
          <Link
            href="/employee/projects"
            className={getLinkClass("/employee/projects")}
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            Projects
          </Link>
          <Link
            href="/employee/meetings"
            className={getLinkClass("/employee/meetings")}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Meetings
          </Link>
          <Link
            href="/employee/announcements"
            className={getLinkClass("/employee/announcements")}
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
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              ></path>
            </svg>
            Announcements
          </Link>
          <Link
            href="/employee/performance"
            className={getLinkClass("/employee/performance")}
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
            Performance
          </Link>
          <Link
            href="/employee/support"
            className={getLinkClass("/employee/support")}
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            Support / Helpdesk
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm transition-colors mt-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>{" "}
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
