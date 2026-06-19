"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function ManagerComplaints() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Data States
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Modal State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetching all tickets anonymously (no user data is attached from backend)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${selectedTicket._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update the ticket in the local state
      setTickets(
        tickets.map((t) => (t._id === selectedTicket._id ? res.data : t)),
      );
      setSelectedTicket(res.data); // Update modal state
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update ticket status.");
    }
  };

  // Derived Stats
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "In Progress",
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  // Filtered List
  const filteredTickets = tickets.filter(
    (t) => filter === "All" || t.status === filter,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
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
              Staff Complaints
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {/* Resolution Center Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Resolution Center
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Review and resolve anonymous issues reported by your team.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {["All", "Open", "In Progress", "Resolved"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                    filter === f
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Needs Attention (Open)
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {openCount}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  In Progress
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {inProgressCount}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
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
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Resolved
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {resolvedCount}
                </h3>
              </div>
            </div>
          </div>

          {/* Tickets Table (ANONYMOUS VIEW) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-4 px-6">TICKET DETAILS</th>
                    <th className="py-4 px-6">SUBJECT</th>
                    <th className="py-4 px-6">PRIORITY</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6">DATE</th>
                    <th className="py-4 px-6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400"
                      >
                        Loading tickets...
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400"
                      >
                        No tickets found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 text-sm">
                            TKT-
                            {ticket._id
                              .substring(ticket._id.length - 4)
                              .toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {ticket.category}
                          </p>
                        </td>
                        {/* Notice: Replaced "Reported By" with "Subject" for complete anonymity */}
                        <td className="py-4 px-6 text-sm text-slate-800 font-medium truncate max-w-[200px]">
                          {ticket.subject}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              ticket.priority === "High"
                                ? "text-rose-600 bg-rose-50 px-2 py-1 rounded-md"
                                : ticket.priority === "Medium"
                                  ? "text-amber-600 bg-amber-50 px-2 py-1 rounded-md"
                                  : "text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                ticket.status === "Open"
                                  ? "bg-rose-500"
                                  : ticket.status === "In Progress"
                                    ? "bg-blue-500"
                                    : "bg-emerald-500"
                              }`}
                            ></span>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-4 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-lg transition-colors"
                          >
                            Review
                          </button>
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

      {/* --- REVIEW TICKET MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800">
                  Ticket Review
                </h3>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-md border border-slate-200">
                  TKT-
                  {selectedTicket._id
                    .substring(selectedTicket._id.length - 4)
                    .toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full p-1.5 border border-slate-200 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedTicket.subject}
                  </h4>
                  <div className="flex gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        ></path>
                      </svg>
                      {selectedTicket.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
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
                      {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
                    selectedTicket.priority === "High"
                      ? "text-rose-700 bg-rose-50 border-rose-200"
                      : selectedTicket.priority === "Medium"
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}
                >
                  {selectedTicket.priority} Priority
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Issue Description
                </h5>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h5 className="text-sm font-bold text-blue-900 mb-1">
                    Anonymous Report
                  </h5>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    This ticket was submitted anonymously. You cannot reply
                    directly to the reporter. Please resolve the issue
                    internally and update the status here.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-bold text-slate-700">
                  Current Status:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedTicket.status === "Open"
                        ? "bg-rose-500"
                        : selectedTicket.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                    }`}
                  ></span>
                  {selectedTicket.status}
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {selectedTicket.status === "Open" && (
                  <button
                    onClick={() => handleUpdateStatus("In Progress")}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
                {selectedTicket.status !== "Resolved" && (
                  <button
                    onClick={() => handleUpdateStatus("Resolved")}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
