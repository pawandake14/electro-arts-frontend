"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function AllMachines() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/machines`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMachines(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this machine?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/machines/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMachines(machines.filter((m) => m._id !== id));
      alert("Machine deleted successfully.");
    } catch (error) {
      alert("Failed to delete machine.");
    }
  };

  const filteredMachines = machines.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="text-sm font-medium text-slate-500">
            Dashboard &gt; <span className="text-slate-900">All Machines</span>
          </div>
          <Link
            href="/admin/machines/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm"
          >
            + Add Machine
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Machines
            </h1>
          </div>

          <div className="mb-6 w-full max-w-md relative">
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
              placeholder="Search machines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Machine Details</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredMachines.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">
                      No machines found.
                    </td>
                  </tr>
                ) : (
                  filteredMachines.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-20 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={m.image}
                              alt={m.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm mb-1">
                              {m.title}
                            </div>
                            <div className="text-xs text-slate-500 max-w-sm truncate">
                              {m.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors"
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
      </main>
    </div>
  );
}
