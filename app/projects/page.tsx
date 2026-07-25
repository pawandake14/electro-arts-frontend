"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import FadeIn from "@/components/FadeIn";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`,
        );
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.clientIndustry &&
        project.clientIndustry
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
      {/* 🔥 FIXED: Replaced py-20 with pt-6 md:pt-10 pb-16 md:pb-24 to fix the top gap! */}
      <main className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-16 md:pb-24">
        {/* Page Header & Search */}
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0B132B] mb-4">
                Our Projects
              </h1>
              <p className="text-slate-600 text-lg">
                Explore our portfolio of successful industrial automation,
                robotics, and custom engineering implementations.
              </p>
            </div>

            <div className="relative w-full md:w-80 flex-shrink-0">
              <input
                type="text"
                placeholder="Search projects or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full pl-5 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
              />
              <svg
                className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
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
        </FadeIn>

        <div className="w-full border-b border-slate-200 my-8"></div>

        {/* Dynamic Project Grid */}
        {loading ? (
          <FadeIn direction="up">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium text-sm">
                Loading portfolio...
              </p>
            </div>
          </FadeIn>
        ) : filteredProjects.length === 0 ? (
          <FadeIn direction="up">
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No Projects Found
              </h3>
              <p className="text-slate-500 text-sm">
                Try adjusting your search terms or check back later.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <FadeIn key={project._id} direction="up" delay={index * 0.1}>
                <div className="bg-white h-full rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Cinematic 16:9 Image Container */}
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="font-bold text-xl text-slate-900 leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Client / Industry Badge */}
                    {project.clientIndustry && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {project.clientIndustry}
                        </span>
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
