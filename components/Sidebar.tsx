"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname();

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
      {/* Mobile Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      {/* The Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#0B132B] text-slate-300 flex flex-col shadow-xl z-50 overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top Logo */}
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

        {/* User Profile */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden flex items-center justify-center">
            <svg
              className="w-6 h-6 text-slate-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Admin User</h3>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6">
          {/* Main Dashboard */}
          <div>
            <Link
              href="/admin/dashboard"
              className={getLinkClass("/admin/dashboard")}
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
          </div>

          {/* User Management */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              User Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/add-employee"
                className={getLinkClass("/admin/add-employee")}
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  ></path>
                </svg>{" "}
                Add User
              </Link>
              <Link
                href="/admin/employees"
                className={getLinkClass("/admin/employees")}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>{" "}
                Employees
              </Link>
              <Link
                href="/admin/managers"
                className={getLinkClass("/admin/managers")}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>{" "}
                Managers
              </Link>
              <Link
                href="/admin/reception"
                className={getLinkClass("/admin/reception")}
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>{" "}
                Reception
              </Link>
              <Link
                href="/admin/store-staff"
                className={getLinkClass("/admin/store-staff")}
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>{" "}
                Store Staff
              </Link>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Attendance
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/records"
                className={getLinkClass("/admin/attendance-records")}
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>{" "}
                Attendance Records
              </Link>
            </div>
          </div>

          {/* Machines */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Machines
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/machines/all-machines"
                className={getLinkClass("/admin/machines/all-machines")}
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Machines
              </Link>

              <Link
                href="/admin/machines/add"
                className={getLinkClass("/admin/machines/add")}
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
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Add Machine
              </Link>
            </div>
          </div>

          {/* Projects */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Projects
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/projects/all-projects"
                className={getLinkClass("/admin/projects/all-projects")}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>{" "}
                All Projects
              </Link>
              <Link
                href="/admin/projects/add"
                className={getLinkClass("/admin/projects/add")}
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
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>{" "}
                Add Project
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Products
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/products/all-products"
                className={getLinkClass("/admin/products/all-products")}
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>{" "}
                All Products
              </Link>
              <Link
                href="/admin/products/add"
                className={getLinkClass("/admin/products/add")}
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
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>{" "}
                Add Product
              </Link>
            </div>
          </div>

          {/* HR Management */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              HR Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/job/add"
                className={getLinkClass("/admin/job/add")}
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>{" "}
                Job Vacancies
              </Link>
              <Link
                href="/admin/job/applications"
                className={getLinkClass("/admin/job/applications")}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>{" "}
                Applications
              </Link>
            </div>
          </div>

          {/* Meetings */}
          <div>
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Meetings
            </p>
            <div className="space-y-1">
              <Link
                href="/admin/meetings/history"
                className={getLinkClass("/admin/meetings/history")}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>{" "}
                Meeting History
              </Link>
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm transition-colors mt-1"
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
          </Link>
        </div>
      </aside>
    </>
  );
}
