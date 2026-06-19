"use client";
import { useState, useEffect } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/link";
import axios from "axios";

export default function LeaveHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch leave history:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Header - Reusing your existing responsive header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Leave Request</h1>
          {/* Avatar Area */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-200">
              {user?.firstName?.charAt(0) || "E"}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Leave Request History
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Review your past leave applications and their current status.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
            <Link
              href="/employee/leave-request"
              className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Apply Leave
            </Link>
            <button className="pb-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
              Leave Request History
            </button>
          </div>

          {/* Full History Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">From Date</th>
                    <th className="py-3 px-4">To Date</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Applied On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-slate-400 text-sm"
                      >
                        Loading your leave history...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-slate-400 text-sm italic"
                      >
                        No past leave records found.
                      </td>
                    </tr>
                  ) : (
                    history.map((leave: any) => (
                      <tr
                        key={leave._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* Shortened ID generated from MongoDB Object ID */}
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          LR-{leave._id.slice(-6).toUpperCase()}
                        </td>

                        {/* Fallback to generic "Leave" if your schema doesn't track custom types yet */}
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {leave.leaveType || "Leave"}
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          {new Date(leave.fromDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          {new Date(leave.toDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {leave.totalDays}{" "}
                          {leave.totalDays === 1 ? "Day" : "Days"}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold inline-block tracking-wide uppercase ${
                              leave.status === "Approved"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : leave.status === "Rejected"
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : leave.status === "Cancelled"
                                    ? "bg-slate-100 text-slate-500 border border-slate-200"
                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-500 text-sm">
                          {new Date(
                            leave.appliedOn || leave.createdAt,
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
      </main>
    </div>
  );
}
