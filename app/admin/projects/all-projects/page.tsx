"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust path if needed
import Link from "next/link";
import axios from "axios";

export default function AllProjects() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? It will be removed from the public website immediately.",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the table
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.clientIndustry &&
        project.clientIndustry
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
              <span className="text-slate-900 font-medium">Projects</span>
            </div>
          </div>
          <Link
            href="/admin/projects/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span className="hidden sm:inline">Add Project</span>
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">All Projects</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage the portfolio projects currently displayed on the public
              website.
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
                placeholder="Search projects or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="text-sm font-medium text-slate-500">
              Showing {filteredProjects.length} projects
            </div>
          </div>

          {/* Project Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Project Overview</th>
                    <th className="px-6 py-4">Client / Industry</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500 font-medium"
                      >
                        Loading projects...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500 font-medium"
                      >
                        No projects found. Add a new project to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr
                        key={project._id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Image & Overview Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-24 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0 overflow-hidden shadow-sm">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm mb-1">
                                {project.title}
                              </div>
                              <div
                                className="text-xs text-slate-500 max-w-xs truncate"
                                title={project.shortDescription}
                              >
                                {project.shortDescription}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Industry Column */}
                        <td className="px-6 py-4">
                          {project.clientIndustry ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {project.clientIndustry}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                          )}
                        </td>

                        {/* Date Added Column */}
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {new Date(project.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-sm"
                          >
                            Delete
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
    </div>
  );
}
