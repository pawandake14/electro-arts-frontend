"use client";
import { useState, useEffect } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";
import axios from "axios";

export default function AttendanceSummary() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Real Data States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [experienceDays, setExperienceDays] = useState(0); // Added State

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // --- BULLETPROOF EXPERIENCE CALCULATION ---
      let joinDate;
      // Catch BOTH naming conventions for MongoDB IDs
      const userId = parsedUser._id || parsedUser.id;

      if (parsedUser.createdAt) {
        joinDate = new Date(parsedUser.createdAt);
      } else if (userId) {
        // Extract exact creation timestamp from the MongoDB ObjectId
        const timestamp = parseInt(userId.substring(0, 8), 16) * 1000;
        joinDate = new Date(timestamp);
      } else {
        joinDate = new Date();
      }

      const currentDate = new Date();
      const calculatedExperience = Math.max(
        0,
        Math.floor(
          (currentDate.getTime() - joinDate.getTime()) / (1000 * 3600 * 24),
        ),
      );

      // Temporary debug log so we can see exactly what's happening!
      console.log("DEBUG - User Object:", parsedUser);
      console.log("DEBUG - Calculated Days:", calculatedExperience);

      setExperienceDays(calculatedExperience);
    }

    const fetchMyAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAttendance();
  }, []);

  // --- 1. CORE MATH & FILTERING ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Filter records specifically for the currently viewed month
  const monthRecords = records.filter((r) => {
    const d = new Date(r.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  // Top Metrics Counts
  const presentDays = monthRecords.filter((r) => r.status === "Present").length;
  const halfDays = monthRecords.filter((r) => r.status === "Half Day").length;
  const leaveDays = monthRecords.filter(
    (r) => r.status === "On Leave" || r.status === "Leave",
  ).length;

  // Calculate Absents (Past days in the month that have no record, plus explicit Absent records)
  let absentDays = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const cellDate = new Date(year, month, i);
    if (cellDate > today) continue; // Don't count future days

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const rec = monthRecords.find((r) => r.date === dateStr);
    if (!rec || rec.status === "Absent") absentDays++;
  }

  // --- 2. PERCENTAGE CALCULATIONS (For Donut Chart) ---
  const totalTrackedDays = presentDays + halfDays + leaveDays + absentDays || 1; // Prevent divide by zero
  const presentPct = Math.round((presentDays / totalTrackedDays) * 100);
  const halfPct = Math.round((halfDays / totalTrackedDays) * 100);
  const leavePct = Math.round((leaveDays / totalTrackedDays) * 100);
  const absentPct = Math.round((absentDays / totalTrackedDays) * 100);
  const overallAttendancePct =
    Math.round(((presentDays + halfDays * 0.5) / totalTrackedDays) * 100) || 0;

  // --- 3. TREND LINE CHART (Last 6 Months Engine) ---
  const last6Months = Array.from({ length: 6 })
    .map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();
      const mDaysInMonth = new Date(mYear, mMonth + 1, 0).getDate();

      const mRecords = records.filter(
        (r) =>
          new Date(r.date).getMonth() === mMonth &&
          new Date(r.date).getFullYear() === mYear,
      );
      const mPresent = mRecords.filter((r) => r.status === "Present").length;
      const mHalf = mRecords.filter((r) => r.status === "Half Day").length;

      // Days to count (Total month days, or up to today if it's the current month)
      const mTrackedDays =
        mYear === today.getFullYear() && mMonth === today.getMonth()
          ? today.getDate()
          : mDaysInMonth;
      const mAttPct =
        mTrackedDays === 0
          ? 0
          : Math.round(((mPresent + mHalf * 0.5) / mTrackedDays) * 100);

      return {
        label: d.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        pct: mAttPct > 100 ? 100 : mAttPct,
      };
    })
    .reverse(); // Reverse so oldest is on the left

  // Generate dynamic SVG coordinates based on the percentages
  const trendPoints = last6Months
    .map((m, i) => {
      const x = 25 + i * 90;
      const y = 100 - m.pct; // 0% = 100px (bottom), 100% = 0px (top)
      return `${x},${y}`;
    })
    .join(" ");

  // --- 4. WEEKLY BREAKDOWN ENGINE ---
  const weeks = [
    {
      name: "Week 1",
      range: `01 ${currentDate.toLocaleString("default", { month: "short" })} - 07`,
      start: 1,
      end: 7,
    },
    {
      name: "Week 2",
      range: `08 ${currentDate.toLocaleString("default", { month: "short" })} - 14`,
      start: 8,
      end: 14,
    },
    {
      name: "Week 3",
      range: `15 ${currentDate.toLocaleString("default", { month: "short" })} - 21`,
      start: 15,
      end: 21,
    },
    {
      name: "Week 4",
      range: `22 ${currentDate.toLocaleString("default", { month: "short" })} - 28`,
      start: 22,
      end: 28,
    },
    {
      name: "Week 5",
      range: `29 ${currentDate.toLocaleString("default", { month: "short" })} - ${daysInMonth}`,
      start: 29,
      end: daysInMonth,
    },
  ].map((week) => {
    let wPres = 0,
      wHalf = 0,
      wLeav = 0,
      wAbs = 0,
      wTracked = 0;

    for (let i = week.start; i <= week.end; i++) {
      const cDate = new Date(year, month, i);
      if (cDate > today) continue; // Skip future days
      wTracked++;

      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const rec = monthRecords.find((r) => r.date === dateStr);
      if (rec?.status === "Present") wPres++;
      else if (rec?.status === "Half Day") wHalf++;
      else if (rec?.status === "On Leave" || rec?.status === "Leave") wLeav++;
      else wAbs++;
    }

    const total = wPres + wHalf + wLeav + wAbs || 1;
    return {
      ...week,
      pPct: (wPres / total) * 100,
      hPct: (wHalf / total) * 100,
      lPct: (wLeav / total) * 100,
      aPct: (wAbs / total) * 100,
      score:
        wTracked === 0
          ? 0
          : Math.round(((wPres + wHalf * 0.5) / wTracked) * 100),
    };
  });

  // --- 5. ALL-TIME SUMMARY DETAILS ---
  const totalAllTimeLeaves = records.filter(
    (r) => r.status === "On Leave" || r.status === "Leave",
  ).length;
  const totalAllTimeHalfs = records.filter(
    (r) => r.status === "Half Day",
  ).length;

  // Calculate lowest and highest months from our 6 month trend array
  const bestMonth = [...last6Months].sort((a, b) => b.pct - a.pct)[0] || {
    label: "N/A",
    pct: 0,
  };
  const worstMonth = [...last6Months]
    .filter((m) => m.pct > 0)
    .sort((a, b) => a.pct - b.pct)[0] || { label: "N/A", pct: 0 };

  // Handlers
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

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
                    {user?.firstName?.charAt(0) || "E"}
                  </div>
                )}
              </div>
              <div className="hidden md:block overflow-hidden">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
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

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            <Link
              href="/employee/attendance"
              className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              My Attendance
            </Link>
            <Link
              href="/employee/attendance/summary"
              className="pb-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600"
            >
              Attendance Summary
            </Link>
          </div>

          {/* Date Selector Row */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={prevMonth}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50 border-r border-slate-200"
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
              <div className="px-4 py-2 font-bold text-slate-800 text-sm flex items-center gap-2">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={nextMonth}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50 border-l border-slate-200"
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
          </div>

          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Present Days
                </span>
                <div className="text-emerald-500">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {presentDays}
              </div>
              <div className="text-xs font-medium text-emerald-600 mt-1">
                {presentPct}%
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Leave Days
                </span>
                <div className="text-rose-500">
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
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {leaveDays}
              </div>
              <div className="text-xs font-medium text-rose-600 mt-1">
                {leavePct}%
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Half Days
                </span>
                <div className="text-amber-500">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {halfDays}
              </div>
              <div className="text-xs font-medium text-amber-600 mt-1">
                {halfPct}%
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Experience
                </span>
                <div className="text-indigo-500">
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
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {/* Dynamically uses the parsed experience value */}
                {experienceDays}
              </div>
              <div className="text-xs font-medium text-indigo-600 mt-1">
                Days Completed
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Total Working Days
                </span>
                <div className="text-blue-600">
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
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {daysInMonth}
              </div>
              <div className="text-xs font-medium text-blue-600 mt-1">100%</div>
            </div>
          </div>

          {/* MIDDLE CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Donut Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-6">
                Attendance Overview
              </h3>
              <div className="flex-1 flex items-center justify-between gap-4">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90 transition-all duration-1000"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${presentPct}, 100`}
                      strokeDashoffset="0"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500"
                      strokeDasharray={`${halfPct}, 100`}
                      strokeDashoffset={`-${presentPct}`}
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-rose-500"
                      strokeDasharray={`${leavePct}, 100`}
                      strokeDashoffset={`-${presentPct + halfPct}`}
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-slate-300"
                      strokeDasharray={`${absentPct}, 100`}
                      strokeDashoffset={`-${presentPct + halfPct + leavePct}`}
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">
                      {overallAttendancePct}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium text-center">
                      Overall
                      <br />
                      Attendance
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-sm flex-1 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600 font-medium">
                      Present{" "}
                      <span className="text-slate-400 text-xs">
                        ({presentDays} Days)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600 font-medium">
                      Half Days{" "}
                      <span className="text-slate-400 text-xs">
                        ({halfDays} Days)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-slate-600 font-medium">
                      Leave{" "}
                      <span className="text-slate-400 text-xs">
                        ({leaveDays} Days)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="text-slate-600 font-medium">
                      Absent{" "}
                      <span className="text-slate-400 text-xs">
                        ({absentDays} Days)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-800">
                  Attendance Trend
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-wider">
                  Last 6 Months
                </span>
              </div>

              <div className="flex-1 relative w-full h-full min-h-[160px]">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400">
                  {[100, 80, 60, 40, 20, 0].map((val) => (
                    <div
                      key={val}
                      className="flex items-center border-b border-slate-100 w-full pb-1"
                    >
                      <span>{val}%</span>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 ml-8 pb-5">
                  <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 500 100"
                  >
                    <polyline
                      points={trendPoints}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {last6Months.map((m, i) => (
                      <g key={i}>
                        <circle
                          cx={25 + i * 90}
                          cy={100 - m.pct}
                          r="4"
                          fill="#2563eb"
                          className="cursor-pointer hover:r-6 transition-all"
                        />
                        <text
                          x={25 + i * 90}
                          y={100 - m.pct - 12}
                          fontSize="12"
                          fill="#475569"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {m.pct}%
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="absolute bottom-[-5px] left-8 right-0 flex justify-between text-[10px] font-bold text-slate-500">
                  {last6Months.map((m, i) => (
                    <span key={i}>{m.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance by Week */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-800">
                  Attendance by Week
                </h3>
                <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                    Present
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{" "}
                    Half Day
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>{" "}
                    Leave
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                    Absent
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {weeks.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 text-xs font-medium"
                  >
                    <span className="w-32 text-slate-800">
                      {w.name}{" "}
                      <span className="text-slate-400 font-normal">
                        ({w.range})
                      </span>
                    </span>
                    <div className="flex-1 h-1.5 flex rounded-full overflow-hidden bg-slate-100">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${w.pPct}%` }}
                      ></div>
                      <div
                        className="bg-amber-500 transition-all border-l border-white"
                        style={{ width: `${w.hPct}%` }}
                      ></div>
                      <div
                        className="bg-rose-500 transition-all border-l border-white"
                        style={{ width: `${w.lPct}%` }}
                      ></div>
                      <div
                        className="bg-slate-300 transition-all border-l border-white"
                        style={{ width: `${w.aPct}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-bold text-blue-600">
                      {w.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-6">
                All-Time Statistics
              </h3>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
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
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Records Tracked
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {records.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-rose-100 text-rose-500 rounded-lg">
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
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Total Leaves Taken
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {totalAllTimeLeaves}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
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
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Best Attendance
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {bestMonth.pct}%{" "}
                      <span className="text-xs text-slate-400 font-medium">
                        ({bestMonth.label})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-amber-100 text-amber-500 rounded-lg">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Total Half Days
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {totalAllTimeHalfs}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-rose-100 text-rose-500 rounded-lg">
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
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Lowest Attendance
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {worstMonth.pct}%{" "}
                      <span className="text-xs text-slate-400 font-medium">
                        ({worstMonth.label})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="p-2.5 bg-slate-200 text-slate-600 rounded-lg">
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
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Avg Presence
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {Math.round(
                        (records.filter((r) => r.status === "Present").length /
                          (records.length || 1)) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 pb-4">
            <p>© 2026 Electro Arts Automation Pvt. Ltd. All rights reserved.</p>
            <p className="font-medium">Build. Automate. Elevate.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
