"use client";
import { useState, useEffect } from "react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import axios from "axios";

export default function HalfDayRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: "",
    session: "Morning",
    reason: "",
    contactNumber: "",
  });

  // Fetch only Half Day requests for the table
  const fetchRecentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Filter to only show half days
      const halfDays = res.data.filter(
        (req: any) => req.leaveType === "Half Day",
      );
      setRecentRequests(halfDays);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchRecentRequests();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Sending payload to existing Leave controller
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves`,
        {
          leaveType: "Half Day",
          fromDate: formData.date,
          toDate: formData.date, // Same day for half day
          totalDays: 0.5,
          reason: formData.reason,
          session: formData.session,
          contactNumber: formData.contactNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Half Day request submitted successfully!");

      // Reset form
      setFormData({
        date: "",
        session: "Morning",
        reason: "",
        contactNumber: "",
      });

      // Refresh table
      fetchRecentRequests();
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
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
              Half Day Request
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200">
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

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="xl:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Request Half Day
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Session *
                      </label>
                      <select
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Reason *
                    </label>
                    <textarea
                      name="reason"
                      required
                      rows={4}
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Briefly explain the reason for your half day..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      required
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="e.g., +91 9876543210"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          date: "",
                          session: "Morning",
                          reason: "",
                          contactNumber: "",
                        })
                      }
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Policy Note Section */}
            <div className="xl:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  Policy Note
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  Half day leave must be applied at least 2 hours before the
                  start of the chosen session. Continuous half days exceeding 2
                  days will require managerial approval via the standard Leave
                  Request portal.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Recent Requests
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-400 text-sm"
                      >
                        No recent half day requests found.
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((req: any) => (
                      <tr
                        key={req._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-slate-700 text-sm">
                          HD-{req._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm">
                          {new Date(req.fromDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm font-medium">
                          {req.session || "Morning"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              req.status === "Approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : req.status === "Rejected"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
