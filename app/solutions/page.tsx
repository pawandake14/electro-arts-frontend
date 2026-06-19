"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function SolutionsPage() {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        // Fetching the real machines from your backend!
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/machines`,
        );
        setMachines(res.data);
      } catch (error) {
        console.error("Failed to fetch machines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const filteredMachines = machines.filter((machine) =>
    machine.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900 min-h-screen">
      {/* Hero Header Section */}
      <section className="bg-slate-50 pt-16 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Our Solutions & Machinery
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                Explore our catalog of advanced industrial automation equipment,
                custom-built to optimize performance and efficiency on your
                plant floor.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-end">
              {/* Decorative Blueprint/Sketch Graphic */}
              <div className="w-full max-w-md opacity-60">
                <svg
                  viewBox="0 0 400 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto text-slate-400"
                >
                  <path
                    d="M50 100 L100 50 L150 100 Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="70"
                    y="100"
                    width="60"
                    height="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="250"
                    cy="70"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M250 100 L250 130 M220 70 L190 70 M280 70 L310 70"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M330 110 Q350 50 380 90"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B132B]">
            Equipment Catalog
          </h2>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search machinery..."
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

        {/* Dynamic Data Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium text-sm">
              Loading catalog...
            </p>
          </div>
        ) : filteredMachines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mb-16">
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
              No Machines Found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your search terms or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredMachines.map((machine) => (
              <div
                key={machine._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col group hover:shadow-lg transition-all duration-300"
              >
                {/* Dynamic Image Box */}
                <div className="h-48 w-full overflow-hidden relative bg-slate-100 flex items-center justify-center border-b border-slate-100">
                  <img
                    src={machine.image}
                    alt={machine.title}
                    className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Box */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                    {machine.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {machine.description}
                  </p>

                  <Link
                    href="/contact"
                    className="text-blue-600 text-sm font-bold flex items-center group/link mt-auto pt-4 border-t border-slate-50"
                  >
                    Inquire About System
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-50 flex-shrink-0">
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
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Need a Custom Solution?
              </h3>
              <p className="text-slate-600 text-sm">
                We tailor equipment and automation logic to meet your unique
                challenges.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center"
          >
            Talk to Our Experts
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
