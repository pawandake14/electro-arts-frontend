"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <>
      {/* 1. MOBILE/TABLET BLOCKER */}
      {/* This only shows on screens smaller than 1024px (lg breakpoint) */}
      <div className="lg:hidden fixed inset-0 z-50 bg-[#0B132B] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
          <span className="text-white text-3xl font-bold">E</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Desktop Access Required
        </h2>
        <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
          The Reception Portal is designed specifically for desktop monitors to
          ensure fast and accurate attendance management. Please log in from a
          desktop computer.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/10 transition-all"
        >
          Back to Login
        </button>
      </div>

      {/* 2. MAIN DESKTOP LAYOUT */}
      {/* This is completely hidden on mobile, and only uses flexbox on large screens */}
      <div className="hidden lg:flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0B132B] text-white flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center font-bold text-xl">
              E
            </div>
            <span className="font-bold text-lg tracking-wide">
              ELECTRO ARTS
            </span>
          </div>

          <div className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Reception Portal
            </p>
            <nav className="space-y-2">
              <Link
                href="/reception/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/reception/dashboard" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/reception/mark-attendance"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/reception/mark-attendance" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                Mark Attendance
              </Link>
              <Link
                href="/reception/attendance-records"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/reception/attendance-records" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                Attendance Records
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors w-full font-medium text-sm"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">{children}</main>
      </div>
    </>
  );
}
