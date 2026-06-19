"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function AddJobVacancy() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [experience, setExperience] = useState("");
  const [openings, setOpenings] = useState(1);
  const [description, setDescription] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !experience || !description || !shortSummary) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/jobs`,
        {
          title,
          employmentType,
          experience,
          openings,
          description,
          shortSummary,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Job Vacancy successfully posted to the Careers page!");
      setTitle("");
      setExperience("");
      setOpenings(1);
      setDescription("");
      setShortSummary("");
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-500">Job Vacancies</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-900 font-medium">Add Vacancy</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Add Job Vacancy
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* Left Column (Main Details) - Takes up 2/3 of the space */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Job Details
                </h2>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Employment Type *
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Experience Required *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2-5 years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      No. of Openings *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Describe the role, responsibilities and requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column (Summary & Actions) - Takes up 1/3 of the space */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-2">
                  About the Role
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Add a short summary about the role to attract the right
                  candidates on the public card.
                </p>

                <textarea
                  required
                  maxLength={200}
                  rows={5}
                  placeholder="Short summary about this job..."
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                ></textarea>
                <div className="text-right text-xs font-medium text-slate-400">
                  {shortSummary.length} / 200
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setExperience("");
                    setOpenings(1);
                    setDescription("");
                    setShortSummary("");
                  }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-lg text-sm bg-white hover:bg-slate-50 shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg text-sm shadow-sm transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Vacancy"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
