import Link from "next/link";
import FadeIn from "../components/FadeIn";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      {/* Removed max-w-7xl from the parent section so it stretches edge-to-edge */}
      <section className="relative w-full flex flex-col lg:flex-row items-center overflow-hidden min-h-[550px] lg:min-h-[600px]">
        {/* Inner container to keep text aligned with the navbar */}
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex">
          <div className="w-full lg:w-[55%] py-16 lg:py-24 pr-8">
            <FadeIn direction="up">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Driving Automation.
                <br />
                Delivering Excellence.
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Electro Arts provides smart automation solutions and advanced
                machinery to power industries towards a more efficient tomorrow.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/solutions"
                  className="bg-[#111f38] hover:bg-slate-800 text-white px-6 py-3 rounded-md font-semibold transition-all shadow-sm"
                >
                  Explore Our Solutions
                </Link>
                <Link
                  href="/projects"
                  className="bg-white border border-slate-300 text-slate-700 hover:border-slate-400 px-6 py-3 rounded-md font-semibold transition-all shadow-sm"
                >
                  View Our Projects
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Side: Angled Image */}
        {/* Pinned to the absolute right of the full-width screen */}
        <div className="w-full lg:w-[50vw] h-[400px] lg:h-full lg:absolute right-0 top-0 hidden lg:block [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] bg-slate-200">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/robot-arm.jpg')" }}
          >
            {/* Optional: Subtle Blue Overlay */}
            <div className="w-full h-full bg-[#111f38]/5 mix-blend-multiply"></div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-[#111f38] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-700">
            {/* Stat 1 */}
            <div className="flex items-center justify-center gap-4 px-4">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <div>
                <h3 className="text-2xl font-bold">50+</h3>
                <p className="text-sm text-slate-300">Projects Completed</p>
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex items-center justify-center gap-4 px-4">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <div>
                <h3 className="text-2xl font-bold">20+</h3>
                <p className="text-sm text-slate-300">Happy Clients</p>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex items-center justify-center gap-4 px-4">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              <div>
                <h3 className="text-2xl font-bold">10+</h3>
                <p className="text-sm text-slate-300">Years of Experience</p>
              </div>
            </div>
            {/* Stat 4 */}
            <div className="flex items-center justify-center gap-4 px-4">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-sm text-slate-300">Support & Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-[#111f38] mb-4">
              Our Solutions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-12">
              We deliver innovative automation products and solutions tailored
              to your industry needs.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <FadeIn delay={0.1}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <svg
                    className="w-8 h-8 text-[#111f38]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <h3 className="font-bold text-[#111f38]">
                    Industrial Automation
                  </h3>
                </div>
                <p className="text-sm text-slate-500">
                  End-to-end automation solutions for industries.
                </p>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.2}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <svg
                    className="w-8 h-8 text-[#111f38]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                  <h3 className="font-bold text-[#111f38]">Custom Machinery</h3>
                </div>
                <p className="text-sm text-slate-500">
                  High-performance machines built for precision.
                </p>
              </div>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.3}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <svg
                    className="w-8 h-8 text-[#111f38]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <h3 className="font-bold text-[#111f38]">Control Systems</h3>
                </div>
                <p className="text-sm text-slate-500">
                  Smart control solutions for better efficiency.
                </p>
              </div>
            </FadeIn>

            {/* Card 4 */}
            <FadeIn delay={0.4}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <svg
                    className="w-8 h-8 text-[#111f38]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <h3 className="font-bold text-[#111f38]">
                    Support & Service
                  </h3>
                </div>
                <p className="text-sm text-slate-500">
                  24/7 support to keep your operations running.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <FadeIn direction="up">
              <h2 className="text-4xl font-bold text-[#111f38] mb-4">
                Featured Projects
              </h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Explore our portfolio of custom automation integrations, robotic
                deployments, and enterprise-grade manufacturing solutions.
              </p>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <Link
                href="/projects"
                className="hidden md:inline-flex items-center gap-2 text-[#111f38] font-semibold hover:text-cyan-600 transition-colors"
              >
                View All Projects
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </Link>
            </FadeIn>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <FadeIn delay={0.1}>
              <div className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Background Image - Scale on Hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1565439390118-bbf1755611ed?q=80&w=2069&auto=format&fit=crop')",
                  }}
                ></div>

                {/* Default Gradient Overlay (Always visible so text is readable) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111f38]/90 via-[#111f38]/40 to-transparent"></div>

                {/* Hover Gradient Overlay (Darkens on hover) */}
                <div className="absolute inset-0 bg-[#111f38]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Text Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-cyan-400 font-medium text-sm mb-2 tracking-wider uppercase">
                    Automotive Sector
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Automated Chassis Welding
                  </h3>
                  <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Deployed a 6-axis robotic welding cell reducing cycle time
                    by 40% and ensuring perfect structural integrity.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Project 2 */}
            <FadeIn delay={0.3}>
              <div className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=2070&auto=format&fit=crop')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111f38]/90 via-[#111f38]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[#111f38]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-cyan-400 font-medium text-sm mb-2 tracking-wider uppercase">
                    FMCG Industry
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    High-Speed Sorting Line
                  </h3>
                  <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Custom computer-vision integration for real-time quality
                    control and rapid pneumatic sorting.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Project 3 */}
            <FadeIn delay={0.5}>
              <div className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111f38]/90 via-[#111f38]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[#111f38]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-cyan-400 font-medium text-sm mb-2 tracking-wider uppercase">
                    Custom Electronics
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Smart PLC Dashboards
                  </h3>
                  <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Engineered bespoke control panels with IoT connectivity for
                    remote factory monitoring and predictive maintenance.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Mobile Only: View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-[#111f38] text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-800 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
