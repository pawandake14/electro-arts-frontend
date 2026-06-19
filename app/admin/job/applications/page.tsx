"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function ApplicationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Update local state instantly to reflect change
      setApplications((apps) =>
        apps.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app,
        ),
      );
      setOpenDropdownId(null);
      alert(
        `Status updated to ${newStatus}. An automated email has been sent to the applicant!`,
      );
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove this application?",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Remove it from the UI instantly
      setApplications((apps) => apps.filter((app) => app._id !== id));
      setOpenDropdownId(null);
    } catch (error) {
      alert("Failed to delete application.");
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "All Status" || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "New").length,
    review: applications.filter((a) => a.status === "Under Review").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="text-sm font-medium text-slate-500">
            Dashboard &gt; <span className="text-slate-900">Applications</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            Applications
          </h1>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-slate-400">All time</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-2">
                New Applications
              </p>
              <p className="text-3xl font-bold text-blue-500 mb-1">
                {stats.new}
              </p>
              <p className="text-xs text-slate-400">Awaiting action</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Under Review
              </p>
              <p className="text-3xl font-bold text-amber-500 mb-1">
                {stats.review}
              </p>
              <p className="text-xs text-slate-400">In progress</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Shortlisted
              </p>
              <p className="text-3xl font-bold text-emerald-500 mb-1">
                {stats.shortlisted}
              </p>
              <p className="text-xs text-slate-400">Selected</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-2">Rejected</p>
              <p className="text-3xl font-bold text-rose-500 mb-1">
                {stats.rejected}
              </p>
              <p className="text-xs text-slate-400">Not selected</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, email or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-48 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Status">All Status</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">
                              {app.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {app.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 text-sm">
                        {app.jobTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {app.phone}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            app.status === "New"
                              ? "bg-blue-100 text-blue-700"
                              : app.status === "Under Review"
                                ? "bg-amber-100 text-amber-700"
                                : app.status === "Shortlisted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === app._id ? null : app._id,
                            )
                          }
                          className="p-1 text-slate-400 hover:text-slate-800"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                          </svg>
                        </button>

                        {openDropdownId === app._id && (
                          <div className="absolute right-8 top-10 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden text-left">
                            <div className="px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                              CHANGE STATUS
                            </div>
                            <button
                              onClick={() => handleStatusChange(app._id, "New")}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                            >
                              New
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app._id, "Under Review")
                              }
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                            >
                              Under Review
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app._id, "Shortlisted")
                              }
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                            >
                              Shortlisted
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app._id, "Rejected")
                              }
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-rose-600"
                            >
                              Rejected
                            </button>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-500 hover:text-rose-600 font-medium transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
