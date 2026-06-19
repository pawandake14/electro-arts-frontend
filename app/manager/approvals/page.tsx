"use client";
import { useState, useEffect } from "react";
import ManagerSidebar from "@/components/ManagerSidebar";
import axios from "axios";

export default function LeaveApprovals() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLeaves(res.data); // This fills the 'leaves' variable with your DB data
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  // State for Pending Requests (Actionable)
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "LR-8041",
      name: "Rahul Singh",
      type: "Employee", // Replaced role with account type
      avatar: "R",
      from: "12 Jun 2026",
      to: "14 Jun 2026",
      dur: "3 Days",
      reason: "Diagnosed with viral fever, doctor advised complete rest.",
      appliedOn: "10 Jun 2026",
    },
    {
      id: "LR-8042",
      name: "Priya Verma",
      type: "Employee", // Replaced role with account type
      avatar: "P",
      from: "18 Jun 2026",
      to: "18 Jun 2026",
      dur: "1 Day",
      reason: "Need to attend a family function out of town.",
      appliedOn: "11 Jun 2026",
    },
  ]);

  // State for History (Read-only)
  const [history, setHistory] = useState([
    {
      id: "LR-7011",
      name: "Anil Kapoor",
      dur: "2 Days",
      status: "Approved",
      date: "05 Jun 2026",
    },
    {
      id: "LR-7009",
      name: "Deepak Sharma",
      dur: "5 Days",
      status: "Rejected",
      date: "01 Jun 2026",
    },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handlers for Approve/Reject actions
  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    const requestToMove = pendingRequests.find((req) => req.id === id);
    if (requestToMove) {
      // Remove from pending
      setPendingRequests(pendingRequests.filter((req) => req.id !== id));

      // Add to history
      const newHistoryItem = {
        id: requestToMove.id,
        name: requestToMove.name,
        dur: requestToMove.dur,
        status: action,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setHistory([newHistoryItem, ...history]);
    }
  };

  const pendingLeaves = leaves.filter((l: any) => l.status === "Pending");

  const fetchAllLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // 3. Update the master list
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // 1. Grab the token from storage
      const token = localStorage.getItem("token");

      // 2. Send the PUT request WITH the headers attached!
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }, // <- This was missing!
      );

      // 3. Show success and refresh the data
      alert(`Leave ${newStatus} successfully!`);
      fetchAllLeaves();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update status.");
    }
  };

  const pendingLeavesCount = leaves.filter(
    (l: any) => l.status === "Pending",
  ).length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const approvedThisMonthCount = leaves.filter((l: any) => {
    if (l.status !== "Approved") return false;

    // Make sure we use the date it was applied (fallback to fromDate if needed)
    const leaveDate = new Date(l.appliedOn || l.fromDate);
    return (
      leaveDate.getMonth() === currentMonth &&
      leaveDate.getFullYear() === currentYear
    );
  }).length;

  const totalProcessedCount = leaves.filter(
    (l: any) => l.status !== "Pending" && l.status !== undefined,
  ).length;

  //   const approvedThisMonth = leaves.filter(
  //     (l: any) => l.status === "Approved",
  //   ).length; // You can add date logic here later
  //   const totalProcessed = leaves.filter(
  //     (l: any) => l.status !== "Pending",
  //   ).length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
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
              Leave Approvals
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
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "M"}
                  </div>
                )}
              </div>
              <div className="hidden md:block overflow-hidden">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user
                    ? user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name
                    : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Manager"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Manage Leave Requests
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Review pending applications and track your team's time-off
              history.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Pending Actions
              </p>
              <h3 className="text-3xl font-bold text-slate-800">
                {pendingLeavesCount}
              </h3>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Approved This Month
              </p>
              {/* THIS WAS LIKELY HARDCODED TO 1 */}
              <h3 className="text-3xl font-bold text-slate-800">
                {approvedThisMonthCount}
              </h3>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Total Processed
              </p>
              {/* THIS WAS LIKELY HARDCODED TO 2 */}
              <h3 className="text-3xl font-bold text-slate-800">
                {totalProcessedCount}
              </h3>
            </div>
          </div>

          {/* Action Required Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              Action Required
              {pendingLeaves.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {pendingLeaves.length}
                </span>
              )}
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
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
                <h4 className="text-lg font-bold text-slate-800">
                  All Caught Up!
                </h4>
                <p className="text-slate-500 mt-1 text-sm">
                  There are no pending leave requests to review.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 
              xl:grid-cols-2 gap-6"
              >
                {pendingLeaves.map((leave: any) => (
                  <div
                    key={leave._id} // MongoDB uses _id
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-center">
                        {/* Generate avatar dynamically from User name */}
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg border border-slate-200">
                          {leave.user?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {leave.user?.firstName} {leave.user?.lastName}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {leave.user?.role || "Employee"} • Applied:{" "}
                            {new Date(leave.appliedOn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                          Duration
                        </p>
                        <p className="font-bold text-slate-800 text-sm">
                          {leave.totalDays}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                          Dates
                        </p>
                        <p className="font-bold text-slate-800 text-sm">
                          {new Date(leave.fromDate).toLocaleDateString()}
                          <span className="text-slate-400 font-normal mx-1">
                            to
                          </span>
                          {new Date(leave.toDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        Reason provided
                      </p>
                      <p className="text-sm text-slate-700 italic border-l-2 border-slate-200 pl-3 py-1">
                        "{leave.reason}"
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
                      <button
                        onClick={() =>
                          handleUpdateStatus(leave._id, "Rejected")
                        }
                        className="flex-1 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition-colors text-sm"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(leave._id, "Approved")
                        }
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
                      >
                        Approve Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                Processed Requests
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3">Req ID</th>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave: any) => (
                    <tr
                      key={leave._id}
                      className="bg-white shadow-sm border border-slate-100 rounded-lg"
                    >
                      <td className="px-6 py-4 font-bold rounded-l-lg">
                        {leave._id.slice(-5)}
                      </td>
                      <td className="px-6 py-4">{leave.user.firstName}</td>
                      <td className="px-6 py-4">{leave.totalDays}</td>
                      <td className="px-6 py-4">
                        {/* Dynamic Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 rounded-r-lg">
                        {leave.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(leave._id, "Approved")
                              }
                              className="text-green-600 font-bold hover:underline"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(leave._id, "Rejected")
                              }
                              className="text-red-600 font-bold hover:underline"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
