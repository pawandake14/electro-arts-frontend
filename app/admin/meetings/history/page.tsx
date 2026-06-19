"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust path if needed
import Link from "next/link";
import axios from "axios";

export default function MeetingHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pastMeetings, setPastMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Call your existing getAllMeetings endpoint
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/meetings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Automatically filter for PAST meetings based on the date string
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate day comparison

        const history = res.data.filter((meeting: any) => {
          const meetingDate = new Date(meeting.date);
          return meetingDate < today; // Only keep meetings from previous days
        });

        setPastMeetings(history);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = pastMeetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.organizer?.firstName &&
        meeting.organizer.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
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
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/admin/dashboard"
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-900 font-medium">
                Meeting History
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Meeting History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review records of past meetings and their agendas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-80">
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search by title or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="text-sm font-medium text-slate-500">
              Showing {filteredMeetings.length} past records
            </div>
          </div>

          {/* Meeting Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Meeting Title & Agenda</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Organizer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500 font-medium"
                      >
                        Loading history...
                      </td>
                    </tr>
                  ) : filteredMeetings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500 font-medium"
                      >
                        No past meetings found.
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meeting) => (
                      <tr
                        key={meeting._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Title & Agenda */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm mb-1">
                            {meeting.title}
                          </div>
                          <div
                            className="text-xs text-slate-500 max-w-md truncate"
                            title={meeting.agenda}
                          >
                            {meeting.agenda || "No specific agenda provided."}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-700">
                            {new Date(meeting.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <svg
                              className="w-3 h-3"
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
                            {meeting.time}
                          </div>
                        </td>

                        {/* Organizer */}
                        <td className="px-6 py-4">
                          {meeting.organizer ? (
                            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 shadow-sm">
                                {meeting.organizer.firstName?.charAt(0)}
                                {meeting.organizer.lastName?.charAt(0)}
                              </div>
                              <span className="font-medium">
                                {meeting.organizer.firstName}{" "}
                                {meeting.organizer.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              System Generated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
