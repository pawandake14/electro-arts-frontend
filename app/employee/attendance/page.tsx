"use client";
import { useState, useEffect } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";
import axios from "axios";

export default function EmployeeAttendance() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Dynamic States for Real Data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1. Fetch Personal Attendance
        const attRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/me`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setAttendanceRecords(attRes.data);

        // 2. Fetch Personal Leaves ONLY (Changed from /api/leaves to /api/leaves/my)
        // Note: Make sure your backend route maps getMyLeaves to "/my" or "/me"
        const leaveRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setLeaveRequests(leaveRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- CALENDAR GENERATION ENGINE ---
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // JS getDay(): 0=Sun, 1=Mon. We want Monday to be the first column (index 0)
    const startDayOfWeek = firstDay.getDay();
    const padPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const calendarGrid = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // 1. Previous Month Filler
    for (let i = padPrevMonth - 1; i >= 0; i--) {
      calendarGrid.push({
        date: prevMonthLastDay - i,
        status: "",
        currentMonth: false,
        isToday: false,
      });
    }

    // 2. Current Month Days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const cellDate = new Date(year, month, i);
      // Format to YYYY-MM-DD to match the DB exactly
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const record = attendanceRecords.find((r) => r.date === dateString);
      let status = "";

      if (record) {
        status = record.status === "On Leave" ? "Leave" : record.status;
      } else if (
        cellDate < today &&
        cellDate.toDateString() !== today.toDateString()
      ) {
        status = "Absent";
      }

      calendarGrid.push({
        date: i,
        status: status,
        currentMonth: true,
        isToday: cellDate.toDateString() === today.toDateString(),
      });
    }

    // 3. Next Month Filler
    const remainder = calendarGrid.length % 7;
    if (remainder !== 0) {
      const padNextMonth = 7 - remainder;
      for (let i = 1; i <= padNextMonth; i++) {
        calendarGrid.push({
          date: i,
          status: "",
          currentMonth: false,
          isToday: false,
        });
      }
    }

    return calendarGrid;
  };

  const calendarDays = generateCalendar();

  // --- STATS CALCULATION ENGINE ---
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();

  const currentMonthRecords = attendanceRecords.filter((r: any) => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const presentDays = currentMonthRecords.filter(
    (r) => r.status === "Present",
  ).length;
  const halfDays = currentMonthRecords.filter(
    (r) => r.status === "Half Day",
  ).length;
  const leaveDays = currentMonthRecords.filter(
    (r) => r.status === "On Leave" || r.status === "Leave",
  ).length;
  const absentDays = calendarDays.filter(
    (day) => day.currentMonth && day.status === "Absent",
  ).length;

  const presentPercentage =
    daysInCurrentMonth === 0
      ? 0
      : Math.round((presentDays / daysInCurrentMonth) * 100);

  // Month Navigators
  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // --- STYLING HELPERS ---
  const getStatusStyles = (status: string, currentMonth: boolean) => {
    const baseStyle = currentMonth ? "opacity-100" : "opacity-50";
    switch (status) {
      case "Present":
        return `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`;
      case "Leave":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-100`;
      case "Half Day":
        return `${baseStyle} bg-amber-50 text-amber-600 border-amber-100`;
      case "Absent":
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
      default:
        return `${baseStyle} bg-transparent border-transparent`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return (
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        );
      case "Leave":
        return (
          <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        );
      case "Half Day":
        return (
          <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
            <span className="text-[10px] font-bold">½</span>
          </div>
        );
      case "Absent":
        return (
          <div className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M20 12H4"
              ></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center flex-1">
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
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              Attendance
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200 cursor-pointer">
              <div className="flex-shrink-0">
                {user?.gender === "Male" ? (
                  <img
                    src="/avatars/male-avatar.png"
                    alt="Male Avatar"
                    className="w-9 h-9 rounded-full border border-slate-200 shadow-sm bg-white"
                  />
                ) : user?.gender === "Female" ? (
                  <img
                    src="/avatars/female-avatar.png"
                    alt="Female Avatar"
                    className="w-9 h-9 rounded-full border border-slate-200 shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-200">
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "E"}
                  </div>
                )}
              </div>
              <div className="hidden md:block overflow-hidden">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user
                    ? user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || "Employee"
                    : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Attendance</h2>
              <p className="text-slate-500 mt-1 text-sm">
                Track your daily attendance and request leaves or half days.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/employee/half-day-request"
                className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg
                  className="w-4 h-4 text-amber-500"
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
                Half Day Request
              </Link>
              <Link
                href="/employee/leave-request"
                className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>{" "}
                Leave Request
              </Link>
            </div>
          </div>

          <div className="flex gap-8 border-b border-slate-200 mb-6">
            <Link
              href="/employee/attendance"
              className="pb-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600"
            >
              My Attendance
            </Link>
            <Link
              href="/employee/attendance/summary"
              className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Attendance Summary
            </Link>
          </div>

          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT COLUMN: Calendar & History */}
            <div className="xl:col-span-2 space-y-6">
              {/* Calendar Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={prevMonth}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200"
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
                            d="M15 19l-7-7 7-7"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={nextMonth}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600"
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
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                      Present
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>{" "}
                      Leave
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
                      Half Day
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>{" "}
                      Absent
                    </div>
                    <button
                      onClick={goToday}
                      className="ml-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"
                    >
                      Today
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-bold text-slate-800 py-2"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => (
                      <div
                        key={idx}
                        className={`p-2 h-20 flex flex-col justify-between rounded-lg border ${day.isToday ? "border-blue-500 shadow-md ring-1 ring-blue-500" : getStatusStyles(day.status, day.currentMonth)}`}
                      >
                        <span
                          className={`text-sm font-bold ${!day.currentMonth && "text-slate-400"}`}
                        >
                          {day.date}
                        </span>
                        {day.status && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold tracking-wider uppercase">
                              {day.status}
                            </span>
                            {getStatusIcon(day.status)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request History Table */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Request History
                  </h3>
                  <Link
                    href="/employee/leave-history"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <th className="py-3 pr-4">Type</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Reason</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 pl-4">Applied On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-slate-400"
                          >
                            Loading history...
                          </td>
                        </tr>
                      ) : leaveRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-slate-400"
                          >
                            No requests found.
                          </td>
                        </tr>
                      ) : (
                        leaveRequests.slice(0, 5).map((req: any) => (
                          <tr key={req._id}>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-2 font-bold text-slate-800">
                                {req.leaveType === "Half Day" ? (
                                  <svg
                                    className="w-4 h-4 text-amber-500"
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
                                ) : (
                                  <svg
                                    className="w-4 h-4 text-rose-500"
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
                                )}
                                {req.leaveType || "Leave"}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              {req.totalDays}{" "}
                              {req.totalDays === "1" ? "Day" : "Days"}
                            </td>
                            <td className="py-4 px-4 text-slate-600 truncate max-w-[150px]">
                              {req.reason}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-2.5 py-1 rounded text-[11px] font-bold ${req.status === "Approved" ? "bg-emerald-50 text-emerald-600" : req.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-slate-600">
                              {new Date(
                                req.createdAt || req.appliedOn,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Overview & Recent Requests */}
            <div className="space-y-6">
              {/* Attendance Overview Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Attendance Overview
                  </h3>
                  <select
                    className="text-xs font-medium border border-slate-200 rounded-md px-2 py-1 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const [month, year] = e.target.value.split(" ");
                      setCurrentDate(new Date(`${month} 1, ${year}`));
                    }}
                    value={currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  >
                    <option>
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  </select>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-36 h-36 mb-6">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-emerald-50"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-1000 ease-in-out"
                        strokeDasharray={`${presentPercentage}, 100`}
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">
                        {presentPercentage}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Present
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600 font-medium">
                          Present Days
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {presentDays}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600 font-medium">
                          Half Days
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {halfDays}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="text-slate-600 font-medium">
                          Leave Days
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {leaveDays}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        <span className="text-slate-600 font-medium">
                          Absent Days
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {absentDays}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span className="text-slate-500 font-medium">
                        Total Working Days
                      </span>
                      <span className="font-bold text-slate-800">
                        {daysInCurrentMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Requests Mini List */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Recent Requests
                  </h3>
                  <Link
                    href="/employee/leave-history"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Loading requests...
                    </p>
                  ) : leaveRequests.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No recent requests.
                    </p>
                  ) : (
                    leaveRequests.slice(0, 3).map((req: any) => (
                      <div
                        key={req._id}
                        className="flex items-start justify-between p-3 rounded-lg border border-slate-100 bg-slate-50"
                      >
                        <div className="flex gap-3">
                          <div
                            className={`p-2 rounded-lg h-min ${req.leaveType === "Half Day" ? "bg-amber-100 text-amber-500" : "bg-rose-100 text-rose-500"}`}
                          >
                            {req.leaveType === "Half Day" ? (
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
                              </svg>
                            ) : (
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
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">
                              {req.leaveType || "Leave"} Request
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(
                                req.fromDate || req.date,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              • {req.totalDays}{" "}
                              {req.totalDays === "1" ? "Day" : "Days"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold mt-1 ${req.status === "Approved" ? "text-emerald-500" : req.status === "Rejected" ? "text-rose-500" : "text-amber-500"}`}
                        >
                          {req.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 pb-4">
            <p>© 2026 Electro Arts Automation Pvt. Ltd. All rights reserved.</p>
            <p className="font-medium">Build. Automate. Elevate.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
