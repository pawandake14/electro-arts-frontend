"use client";
import { useState, useEffect } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import Link from "next/dist/client/link";
import axios from "axios";

export default function LeaveRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Fetch user for header
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Auto-calculate total days
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      if (diffDays > 0) {
        setTotalDays(`${diffDays} Day${diffDays > 1 ? "s" : ""}`);
      } else {
        setTotalDays("Invalid Range");
      }
    } else {
      setTotalDays("");
    }
  }, [fromDate, toDate]);

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setReason("");
    setContact("");
    setTotalDays("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves`,
        { fromDate, toDate, reason, totalDays },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Request Submitted Successfully!");

      // Refresh the UI
      handleReset(); // Clears form fields
      fetchLeaves(); // Fetches fresh data from DB
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit request.");
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this request?")) {
      try {
        const token = localStorage.getItem("token");

        // Let's debug the ID specifically
        console.log("Cancelling ID:", id);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        alert("Leave Cancelled Successfully!");
        fetchLeaves();
      } catch (err) {
        // Log the WHOLE error object
        console.error("DEBUGGING ERROR:", err);
        alert("Check the Console for the specific error!");
      }
    }
  };

  const upcomingLeaves = leaves.filter(
    (l: any) => l.status === "Approved" && new Date(l.fromDate) > new Date(),
  );
  const recentLeaves = leaves.slice(0, 5); // Latest 5 requests

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
              Leave Request
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
                    {user?.lastName?.charAt(0) || ""}
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Leave Request</h2>
            <p className="text-slate-500 mt-1 text-sm">
              Apply for leave and track your leave requests.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
            <button className="pb-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
              Apply Leave
            </button>
            <Link
              href="/employee/leave-history"
              className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Leave Request History
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* LEFT COLUMN: Apply Leave Form */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">
                  Apply for Leave
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        From Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Total Days */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Total Days
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={totalDays}
                      placeholder="Calculated automatically"
                      className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none font-medium ${totalDays === "Invalid Range" ? "text-red-500" : "text-slate-700"}`}
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for leave..."
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Contact Number (During Leave){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select className="px-3 py-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-700 focus:outline-none text-sm">
                        <option>+91</option>
                      </select>
                      <input
                        type="tel"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-r-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>

              {/* Note Section */}
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex gap-4 items-start">
                <div className="mt-0.5 text-blue-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 mb-1">
                    Note:
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
                    <li>
                      Leave request will be sent to your reporting manager for
                      approval.
                    </li>
                    <li>
                      You will be notified once your request is approved or
                      rejected.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Policy & Upcoming Leaves */}
            <div className="space-y-6">
              {/* Leave Policy Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  Leave Policy
                </h3>
                <ul className="text-sm text-slate-600 list-disc pl-4 space-y-2">
                  <li>Casual Leave: Max 2 days per request</li>
                  <li>
                    Sick Leave: Requires medical certificate if more than 2 days
                  </li>
                  <li>Privilege Leave: Prior approval is mandatory</li>
                  <li>Comp Off: Can be availed within 3 months</li>
                </ul>
              </div>

              {/* Upcoming Leaves Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[200px]">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  Upcoming Leaves
                </h3>
                {upcomingLeaves.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingLeaves.map((leave: any) => (
                      <li key={leave._id} className="text-sm border-b pb-2">
                        <p className="font-bold text-slate-700">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Approved for {leave.totalDays}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="font-bold text-slate-800 mb-1">
                      No upcoming leaves
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Recent Leave Requests Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Recent Leave Requests
              </h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">From Date</th>
                    <th className="py-3 px-4">To Date</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Applied On</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map((leave: any) => (
                    <tr
                      key={leave._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {leave._id.slice(-6).toUpperCase()}{" "}
                        {/* Generates ID from Mongo ID */}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {leave.totalDays}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            leave.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : leave.status === "Rejected"
                                ? "bg-rose-50 text-rose-600 border border-rose-100"
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(leave.appliedOn).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {leave.status === "Pending" ? (
                          <button
                            onClick={() => handleCancel(leave._id)}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
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
