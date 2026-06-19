"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function ManagerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Real Dynamic Data States
  const [loading, setLoading] = useState(true);
  const [upcomingMeetingsCount, setUpcomingMeetingsCount] = useState(0);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);

  const [totalTeamCount, setTotalTeamCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);

  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);

  // Notification States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Meetings
        const meetingsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meetings`,
          { headers },
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = meetingsRes.data.filter(
          (m: any) => new Date(m.date) >= today,
        );
        setUpcomingMeetingsCount(upcoming.length);

        // 2. Fetch Complaints
        const ticketsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/all`,
          { headers },
        );
        const activeComplaints = ticketsRes.data.filter(
          (t: any) => t.status !== "Resolved",
        );
        setRecentComplaints(activeComplaints.slice(0, 3));

        // 3. Fetch Attendance
        const todayStr = new Date().toISOString().split("T")[0];
        const attendanceRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/daily?date=${todayStr}`,
          { headers },
        );
        const attendanceData = attendanceRes.data;

        setTotalTeamCount(attendanceData.length);
        setPresentCount(
          attendanceData.filter(
            (a: any) => a.status === "Present" || a.status === "Half Day",
          ).length,
        );
        setLeaveCount(
          attendanceData.filter(
            (a: any) => a.status === "On Leave" || a.status === "Absent",
          ).length,
        );

        // 4. Fetch Leaves
        try {
          const leavesRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/all`,
            { headers },
          );
          const pending = leavesRes.data.filter(
            (l: any) => l.status === "Pending",
          );
          setPendingLeaves(pending);
        } catch (e) {
          setPendingLeaves([]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate total alerts dynamically
  const totalAlerts = pendingLeaves.length + recentComplaints.length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-slate-500 hover:text-slate-800"
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
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              Manager Overview
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* --- INLINE NOTIFICATION COMPONENT --- */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                {totalAlerts > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Notifications
                    </h3>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      New Alerts
                    </span>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {totalAlerts === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <svg
                          className="w-10 h-10 mx-auto mb-2 opacity-20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p className="text-xs">All caught up!</p>
                      </div>
                    ) : (
                      <>
                        {/* Leave Alerts */}
                        {pendingLeaves.map((leave) => (
                          <Link
                            key={leave._id}
                            href="/manager/approvals"
                            className="block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  ></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-slate-800">
                                  <span className="font-bold">
                                    {leave.user?.firstName ||
                                      leave.employee?.firstName ||
                                      "Team Member"}
                                  </span>{" "}
                                  applied for{" "}
                                  <span className="font-bold text-amber-700">
                                    {leave.leaveType || "Leave"}
                                  </span>
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  Status: Pending Review
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}

                        {/* Complaint Alerts */}
                        {recentComplaints.map((ticket) => (
                          <Link
                            key={ticket._id}
                            href="/manager/complaints"
                            className="block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
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
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  ></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-slate-800 font-bold">
                                  New Anonymous Complaint
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                  {ticket.subject}
                                </p>
                                <p className="text-[10px] text-rose-500 mt-1 font-bold">
                                  Priority: {ticket.priority}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* --- END NOTIFICATION COMPONENT --- */}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex-shrink-0">
                {user?.gender === "Male" ? (
                  <img
                    src="/avatars/male-avatar.png"
                    alt="Male"
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white"
                  />
                ) : user?.gender === "Female" ? (
                  <img
                    src="/avatars/female-avatar.png"
                    alt="Female"
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                    {user?.firstName?.charAt(0) || "M"}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Manager"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.firstName || "Manager"}!
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Here is the current status of your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Upcoming Meetings
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {loading ? "-" : upcomingMeetingsCount} Scheduled
                </h3>
              </div>
            </div>

            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Present Today
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {loading ? "-" : `${presentCount} / ${totalTeamCount}`}
                </h3>
              </div>
            </div>

            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  On Leave
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {loading ? "-" : leaveCount} Members
                </h3>
              </div>
            </div>

            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Pending Approvals
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {loading ? "-" : pendingLeaves.length} Requests
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Action Required: Leaves
                </h3>
                <Link
                  href="/manager/approvals"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {loading ? (
                  <div className="text-center text-slate-400 py-8 text-sm">
                    Loading requests...
                  </div>
                ) : pendingLeaves.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[120px] border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm">
                    No pending leave requests.
                  </div>
                ) : (
                  pendingLeaves.map((leave) => {
                    const firstName =
                      leave.user?.firstName ||
                      leave.employee?.firstName ||
                      "Team Member";
                    const lastName =
                      leave.user?.lastName || leave.employee?.lastName || "";
                    const type = leave.leaveType || leave.type || "Leave";
                    const start =
                      leave.startDate || leave.fromDate || leave.date;
                    const end = leave.endDate || leave.toDate || leave.date;

                    return (
                      <div
                        key={leave._id}
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center hover:border-slate-200 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {firstName} {lastName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {type} •{" "}
                            {start
                              ? new Date(start).toLocaleDateString()
                              : "N/A"}{" "}
                            - {end ? new Date(end).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href="/manager/approvals"
                            className="px-5 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Recent Complaints
                </h3>
                <Link
                  href="/manager/complaints"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {loading ? (
                  <div className="text-center text-slate-400 py-8 text-sm">
                    Loading complaints...
                  </div>
                ) : recentComplaints.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[120px] border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm">
                    No active complaints requiring attention.
                  </div>
                ) : (
                  recentComplaints.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          TKT
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {ticket.subject}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {ticket.category}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                ticket.priority === "High"
                                  ? "text-rose-600"
                                  : ticket.priority === "Medium"
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/manager/complaints"
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0 ml-2"
                      >
                        Review
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
