"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("General Application");

  // --- Form State ---
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/jobs`,
        );
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openModal = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
    setResumeFile(null);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please attach a resume PDF.");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("jobTitle", selectedRole);
      submitData.append("resume", resumeFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/public/applications`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      alert(
        "Application submitted successfully! Please check your email for confirmation.",
      );
      closeModal();
    } catch (error: any) {
      // We removed the console.error() here so Next.js stops hijacking the screen!

      // Pull the specific error message we sent from the backend
      const errorMessage =
        error.response?.data?.message ||
        "Error submitting application. Please try again.";

      // Show the clean browser alert
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col relative">
      {/* Application Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">
                Submit Application
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Applying for
                </p>
                <p className="font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md inline-block text-sm border border-blue-100">
                  {selectedRole}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Resume (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="bg-white border-b border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B132B] mb-4 tracking-tight">
              Careers
            </h1>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Build the future with us
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
              We are always looking for talented, passionate and driven
              individuals to join our team and help us create innovative
              solutions for a better tomorrow.
            </p>
          </div>

          <div className="md:w-1/2 w-full">
            {/* Real Image Added Here! */}
            <div className="w-full aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden shadow-lg relative border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop"
                alt="Team working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B132B]">
            Open Positions
          </h2>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
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
          </div>
        </div>

        {/* Dynamic Job Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium text-sm">
              Loading open positions...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No Openings Right Now
            </h3>
            <p className="text-slate-500 text-sm">
              We don't have any positions matching your search. Check back
              later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => openModal(job.title)}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all duration-300 group"
              >
                <h3 className="font-extrabold text-lg text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>

                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {job.employmentType}
                  </span>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  {job.shortSummary}
                </p>

                <div className="flex items-center justify-between text-xs font-medium text-slate-400 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {job.experience}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {new Date(job.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-blue-50 flex-shrink-0">
              <svg
                className="w-6 h-6 transform -rotate-45 ml-1 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Don't see the right role?
              </h3>
              <p className="text-slate-600 text-sm">
                Send us your resume and we'll get in touch when a suitable
                opportunity comes up.
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal("General Application")}
            className="whitespace-nowrap px-6 py-2.5 bg-white text-blue-600 font-bold text-sm rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm transition-all"
          >
            Send Us Your Resume
          </button>
        </div>
      </main>
    </div>
  );
}
