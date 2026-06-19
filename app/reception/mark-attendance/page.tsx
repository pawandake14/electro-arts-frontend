"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ReceptionMarkAttendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Staff Data
  const fetchStaffAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      // We will build this backend route next!
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/daily?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStaffList(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAttendance();
  }, [selectedDate]);

  // 2. Handle the Button Click
  const handleMarkStatus = async (userId: string, newStatus: string) => {
    // Optimistic UI update for instant feedback
    setStaffList((prev: any) =>
      prev.map((staff: any) =>
        staff._id === userId ? { ...staff, status: newStatus } : staff,
      ),
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/mark`,
        {
          userId,
          date: selectedDate,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.error("Failed to save status:", err);
      alert("Failed to save attendance. Please try again.");
      fetchStaffAttendance(); // Revert on failure
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mark Attendance</h2>
          <p className="text-slate-500 text-sm mt-1">
            Record daily presence for all employees.
          </p>
        </div>

        {/* Date Picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Mark Status</th>
              <th className="px-6 py-4 text-right">Current Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-400">
                  Loading directory...
                </td>
              </tr>
            ) : staffList.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-400">
                  No staff found.
                </td>
              </tr>
            ) : (
              staffList.map((staff: any) => {
                // If the DB doesn't have a status saved, it defaults to 'Absent'
                const currentStatus = staff.status || "Absent";

                return (
                  <tr
                    key={staff._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Column 1: Name & Role */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {/* Added a fallback in case any old test accounts have blank names */}
                        {staff.firstName || staff.lastName
                          ? `${staff.firstName} ${staff.lastName}`
                          : "Unnamed User"}
                      </p>
                      {/* Changed staff.department to staff.role */}
                      <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mt-0.5">
                        {staff.role || "Employee"}
                      </p>
                    </td>

                    {/* Column 2: The Three Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkStatus(staff._id, "Present")}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                            currentStatus === "Present"
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                              : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            handleMarkStatus(staff._id, "Half Day")
                          }
                          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                            currentStatus === "Half Day"
                              ? "bg-amber-500 text-white border-amber-500 shadow-md"
                              : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
                          }`}
                        >
                          Half Day
                        </button>
                        <button
                          onClick={() =>
                            handleMarkStatus(staff._id, "On Leave")
                          }
                          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                            currentStatus === "On Leave"
                              ? "bg-rose-500 text-white border-rose-500 shadow-md"
                              : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          On Leave
                        </button>
                      </div>
                    </td>

                    {/* Column 3: The visual badge proving what is recorded */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          currentStatus === "Present"
                            ? "bg-emerald-100 text-emerald-700"
                            : currentStatus === "Half Day"
                              ? "bg-amber-100 text-amber-700"
                              : currentStatus === "On Leave"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-100 text-slate-500" // Grey Absent Default
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
