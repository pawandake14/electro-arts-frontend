"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeSidebar from "@/components/EmployeeSidebar";

export default function EmployeeMeetings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Real Data States
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [historyMeetings, setHistoryMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meetings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const allMeetings = res.data;

        // Set "today" to midnight so any meeting happening today stays in "Upcoming"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = allMeetings.filter(
          (m: any) => new Date(m.date) >= today,
        );
        const history = allMeetings.filter(
          (m: any) => new Date(m.date) < today,
        );

        setUpcomingMeetings(upcoming);
        setHistoryMeetings(history);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Helper to format date cleanly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Top Header */}
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
              Meetings
            </h1>
          </div>
          <div className="flex items-center gap-4">
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
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Meetings</h2>
            <p className="text-slate-500 mt-1 text-sm">
              View your upcoming meetings and past meeting records.
            </p>
          </div>

          {/* Upcoming Meetings Section (Vertical Layout) */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Upcoming Meetings
            </h3>
            {loading ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
                Loading meetings...
              </div>
            ) : upcomingMeetings.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
                No upcoming meetings scheduled.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="bg-white p-5 md:px-6 md:py-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1 md:mt-0">
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
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {meeting.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-0.5 leading-snug">
                          {meeting.agenda || "No agenda provided."}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right flex-shrink-0 ml-16 md:ml-0">
                      <p className="text-sm font-bold text-slate-900">
                        {formatDate(meeting.date)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {meeting.time} <span className="mx-1">&bull;</span>{" "}
                        {meeting.organizer?.firstName || "Manager"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meeting History Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Meeting History
            </h3>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">MEETING TITLE</th>
                      <th className="py-3 px-2">DATE & TIME</th>
                      <th className="py-3 px-2">ORGANISED BY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-slate-400 text-sm"
                        >
                          Loading history...
                        </td>
                      </tr>
                    ) : historyMeetings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-slate-400 text-sm"
                        >
                          No past meetings found.
                        </td>
                      </tr>
                    ) : (
                      historyMeetings.map((history) => (
                        <tr
                          key={history._id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-2 font-bold text-slate-800 text-sm">
                            {history.title}
                          </td>
                          <td className="py-4 px-2 text-sm text-slate-600">
                            {formatDate(history.date)}, {history.time}
                          </td>
                          <td className="py-4 px-2 text-sm text-slate-600">
                            {history.organizer?.firstName}{" "}
                            {history.organizer?.lastName}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
