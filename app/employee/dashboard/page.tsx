"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import EmployeeSidebar from "@/components/EmployeeSidebar";

export default function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic States
  const [experienceDays, setExperienceDays] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState("Not Marked");
  const [attStats, setAttStats] = useState({
    present: 0,
    half: 0,
    leave: 0,
    pct: 0,
  });
  const [nextMeeting, setNextMeeting] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

  // Notification States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 1. BULLETPROOF EXPERIENCE CALCULATION
      let joinDate;
      const userId = parsedUser._id || parsedUser.id;
      if (parsedUser.createdAt) {
        joinDate = new Date(parsedUser.createdAt);
      } else if (userId) {
        const timestamp = parseInt(userId.substring(0, 8), 16) * 1000;
        joinDate = new Date(timestamp);
      } else {
        joinDate = new Date();
      }
      const currentDate = new Date();
      setExperienceDays(
        Math.max(
          0,
          Math.floor(
            (currentDate.getTime() - joinDate.getTime()) / (1000 * 3600 * 24),
          ),
        ),
      );
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Fetch Attendance
        const attRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/me`,
          { headers },
        );
        const records = attRes.data;

        const todayStr = new Date().toISOString().split("T")[0];
        const todayRecord = records.find((r: any) => r.date === todayStr);
        setAttendanceToday(todayRecord ? todayRecord.status : "Not Marked");

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(
          currentYear,
          currentMonth + 1,
          0,
        ).getDate();

        const monthRecords = records.filter((r: any) => {
          const d = new Date(r.date);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });

        const present = monthRecords.filter(
          (r: any) => r.status === "Present",
        ).length;
        const half = monthRecords.filter(
          (r: any) => r.status === "Half Day",
        ).length;
        const leave = monthRecords.filter(
          (r: any) => r.status === "On Leave" || r.status === "Leave",
        ).length;
        const pct =
          daysInMonth === 0 ? 0 : Math.round((present / daysInMonth) * 100);

        setAttStats({ present, half, leave, pct });

        // 3. EXACT TIME MEETING LOGIC
        const meetRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meetings`,
          {
            headers,
          },
        );
        const now = new Date();

        const upcomingMeetings = meetRes.data
          .filter((m: any) => {
            // Combine DB date and DB time into one exact JavaScript Date object
            const exactMeetingTime = new Date(m.date);
            let hours = 0,
              mins = 0;

            if (m.time) {
              const [timePart, ampm] = m.time.split(" ");
              if (timePart) {
                let [h, mns] = timePart.split(":");
                hours = parseInt(h);
                mins = parseInt(mns);
                if (ampm && ampm.toUpperCase() === "PM" && hours < 12)
                  hours += 12;
                if (ampm && ampm.toUpperCase() === "AM" && hours === 12)
                  hours = 0;
              }
            }
            exactMeetingTime.setHours(hours, mins, 0, 0);
            m.exactDateTime = exactMeetingTime; // Save it to the object for sorting

            return exactMeetingTime >= now; // ONLY return meetings happening right now or in the future
          })
          .sort(
            (a: any, b: any) =>
              a.exactDateTime.getTime() - b.exactDateTime.getTime(),
          );

        setMeetings(upcomingMeetings);
        if (upcomingMeetings.length > 0) {
          setNextMeeting(upcomingMeetings[0]); // Grabs the absolute next meeting
        }

        // 4. Fetch Tickets (Complaints)
        try {
          const ticketRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
            { headers },
          );
          setComplaints(ticketRes.data.reverse());
        } catch (e) {
          try {
            const ticketRes2 = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/my`,
              { headers },
            );
            setComplaints(ticketRes2.data.reverse());
          } catch (err) {
            setComplaints([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Notifications Filter
  const updatedComplaints = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "Resolved",
  );
  const totalAlerts = meetings.length + updatedComplaints.length;

  const displayComplaints = [...complaints].sort((a, b) => {
    if (a.status !== "Resolved" && b.status === "Resolved") return -1;
    if (a.status === "Resolved" && b.status !== "Resolved") return 1;
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
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
              Employee Overview
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATION BELL */}
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
                  </div>

                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {totalAlerts === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <p className="text-xs">
                          You have no new notifications.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Meeting Alerts */}
                        {meetings.map((meet) => (
                          <Link
                            key={meet._id}
                            href="/employee/meetings"
                            className="block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
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
                                    New Meeting:
                                  </span>{" "}
                                  {meet.title}
                                </p>
                                {/* FIX: Using exact DB time string! */}
                                <p className="text-[10px] text-slate-400 mt-1">
                                  Scheduled for {meet.time}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}

                        {/* Complaint Alerts */}
                        {updatedComplaints.map((ticket) => (
                          <Link
                            key={ticket._id}
                            href="/employee/support"
                            className="block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ticket.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
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
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                  ></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-slate-800">
                                  Your complaint{" "}
                                  <span className="font-bold">
                                    "{ticket.subject}"
                                  </span>{" "}
                                  is now{" "}
                                  <span className="font-bold">
                                    {ticket.status}
                                  </span>
                                  .
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
                    {user?.firstName?.charAt(0) || "E"}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user ? user.firstName : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.firstName || "Employee"}!
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Here is what is happening with your tasks and attendance today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  Attendance Today
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {loading ? "-" : attendanceToday}
                </h3>
              </div>
            </div>

            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Experience
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {experienceDays} Days
                </h3>
              </div>
            </div>

            <div className="bg-white py-6 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
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
                  Next Meeting
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {/* FIX: Displays exact time string from DB and automatically skips past meetings! */}
                  {loading
                    ? "-"
                    : nextMeeting
                      ? nextMeeting.time
                      : "No Meetings"}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Attendance Overview
                </h3>
                <span className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 text-slate-600 bg-slate-50">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
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
                      strokeDasharray={`${attStats.pct}, 100`}
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">
                      {attStats.pct}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
                      Present
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-600">Present</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {attStats.present} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-slate-600">Half Days</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {attStats.half} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-slate-600">Leaves</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {attStats.leave} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 font-bold">
                      Total Working Days
                    </span>
                    <span className="font-bold text-slate-900 text-base">
                      {new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0,
                      ).getDate()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/employee/meetings"
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors"
                >
                  <span>Meetings</span>
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
                </Link>
                <Link
                  href="/employee/leave-request"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <span>Request Leave</span>
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
                </Link>
                <Link
                  href="/employee/support"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <span>Submit IT Ticket</span>
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
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Recent Complaints
              </h3>
              <Link
                href="/employee/support"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <p className="text-sm text-slate-400 py-4 col-span-2 text-center">
                  Loading complaints...
                </p>
              ) : displayComplaints.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 col-span-2 text-center">
                  No recent complaints filed.
                </p>
              ) : (
                displayComplaints.slice(0, 2).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${ticket.status === "Resolved" ? "bg-emerald-500" : ticket.status === "In Progress" ? "bg-amber-500" : "bg-slate-300"}`}
                    ></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-4">
                        {ticket.subject}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white border ${ticket.status === "Resolved" ? "border-emerald-200 text-emerald-600" : ticket.status === "In Progress" ? "border-amber-200 text-amber-600" : "border-slate-200 text-slate-500"}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 pl-2 leading-relaxed">
                      {ticket.description}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-3 pl-2 uppercase tracking-wider">
                      Filed on {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
