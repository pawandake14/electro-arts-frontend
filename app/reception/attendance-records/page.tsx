"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AttendanceRecords() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Reusing the same backend endpoint we made for the daily sheet!
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/daily?date=${selectedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [selectedDate]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Attendance Records
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            View historical presence data for all employees.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-400 uppercase">
            Select Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-slate-400 font-medium tracking-wide animate-pulse"
                >
                  Loading records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-slate-400">
                  No records found for this date.
                </td>
              </tr>
            ) : (
              records.map((record: any) => {
                const status = record.status || "Absent";
                return (
                  <tr
                    key={record._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {record.firstName} {record.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{record.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {record.department || "Engineering"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          status === "Present"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "Half Day"
                              ? "bg-amber-100 text-amber-700"
                              : status === "On Leave"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {status}
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
