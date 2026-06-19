import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (Breadcrumb + Header + Building Image) */}
      <section className="relative w-full bg-slate-50 pt-6 pb-16 lg:pb-0 lg:h-[400px] flex items-start overflow-hidden">
        {/* Removed lg:pt-16 from this inner div so it doesn't push down on desktop */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-start">
          {/* Left Text */}
          <div className="w-full lg:w-1/2 lg:pr-12">
            <FadeIn direction="up">
              <div className="text-sm text-slate-500 mb-6 font-medium">
                <Link href="/" className="hover:text-[#111f38]">
                  Home
                </Link>{" "}
                <span className="mx-2">&gt;</span> About Us
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#111f38] mb-4">
                About Us
              </h1>
              <div className="w-16 h-1 bg-[#111f38] mb-6"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                Driving Automation. Delivering Excellence.
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-md">
                Electro Arts is a trusted automation company delivering
                innovative solutions, advanced machinery, and reliable support
                to help industries work smarter, faster, and more efficiently.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Right Building Image Background (Desktop) */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0">
          {/* Using a linear gradient to fade the image into the white background on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10"></div>
          {/* Note: Replace this Unsplash URL with your actual building image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            }}
          ></div>
        </div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Text */}
            <div className="w-full lg:w-1/2">
              <FadeIn direction="up">
                <h2 className="text-3xl font-bold text-[#111f38] mb-4">
                  Who We Are
                </h2>
                <div className="w-12 h-1 bg-[#111f38] mb-8"></div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  With years of experience in the automation industry, Electro
                  Arts specializes in designing, developing, and delivering
                  end-to-end automation solutions. From concept to
                  commissioning, we provide high-quality products and services
                  that empower businesses to achieve higher productivity and
                  operational excellence.
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Our team of engineers, designers, and technicians work
                  together with a shared passion for innovation and a commitment
                  to quality.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#111f38] text-white px-8 py-3 rounded-md font-semibold hover:bg-slate-800 transition-colors"
                >
                  Know More About Us
                </Link>
              </FadeIn>
            </div>

            {/* Right Rounded Image */}
            <div className="w-full lg:w-1/2">
              <FadeIn direction="left">
                {/* Changed to use your local image and added a fallback bg-slate-200 color */}
                <div
                  className="w-full h-[350px] lg:h-[400px] rounded-2xl bg-cover bg-center shadow-lg bg-slate-200"
                  style={{ backgroundImage: "url('/robot-arm.jpg')" }}
                ></div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARK STATS BAR */}
      <section className="bg-[#111f38] text-white py-12">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x divide-slate-600 text-center">
            <div className="flex flex-col items-center px-4">
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
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
              <h3 className="text-3xl font-bold mb-1">10+</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider">
                Years of Experience
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
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
              <h3 className="text-3xl font-bold mb-1">50+</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider">
                Projects Completed
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-3xl font-bold mb-1">20+</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider">
                Happy Clients
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
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
              </svg>
              <h3 className="text-3xl font-bold mb-1">100+</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider">
                Machines Delivered
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
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
              <h3 className="text-3xl font-bold mb-1">24/7</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider">
                Support & Service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION, VALUES CARDS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Mission */}
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#111f38]">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111f38]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To deliver innovative automation solutions that drive
                  efficiency, quality, and growth for our clients while
                  contributing to industrial advancement.
                </p>
              </div>
            </FadeIn>

            {/* Card 2: Vision */}
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#111f38]">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111f38]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To be a leading global automation company recognized for
                  innovation, quality, and customer satisfaction.
                </p>
              </div>
            </FadeIn>

            {/* Card 3: Values */}
            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#111f38]">
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
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111f38]">
                    Our Values
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#111f38]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>{" "}
                    Innovation
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#111f38]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>{" "}
                    Quality
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#111f38]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>{" "}
                    Integrity
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#111f38]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>{" "}
                    Customer Focus
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#111f38]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>{" "}
                    Teamwork
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-[#111f38] mb-4">
              Why Choose Electro Arts?
            </h2>
            <div className="w-12 h-1 bg-[#111f38] mx-auto mb-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We combine technology, expertise, and dedication to deliver
              solutions that truly make a difference.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center relative">
          {/* Left Angled Image */}
          <div className="w-full lg:w-5/12 h-[400px] lg:h-[500px] [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] z-10 hidden lg:block">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')",
              }}
            ></div>
          </div>

          {/* Mobile Image Fallback (No Clip-path) */}
          <div className="w-full h-[300px] lg:hidden mb-10 px-4">
            <div
              className="w-full h-full bg-cover bg-center rounded-xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')",
              }}
            ></div>
          </div>

          {/* Right Features Grid */}
          <div className="w-full lg:w-7/12 px-4 sm:px-6 lg:pl-16">
            <FadeIn direction="up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {/* Feature 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      Quality Assurance
                    </h4>
                    <p className="text-xs text-slate-500">
                      We follow stringent quality standards to ensure reliable
                      and long-lasting solutions.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      Customized Solutions
                    </h4>
                    <p className="text-xs text-slate-500">
                      We provide tailor-made solutions that perfectly fit your
                      business requirements.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      Advanced Technology
                    </h4>
                    <p className="text-xs text-slate-500">
                      We use the latest technologies and modern tools to deliver
                      innovative solutions.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      Timely Delivery
                    </h4>
                    <p className="text-xs text-slate-500">
                      On-time delivery with efficient execution is our
                      commitment to you.
                    </p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      Expert Team
                    </h4>
                    <p className="text-xs text-slate-500">
                      Our experienced professionals bring expertise and
                      dedication to every project.
                    </p>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
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
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111f38] mb-1">
                      After Sales Support
                    </h4>
                    <p className="text-xs text-slate-500">
                      We stand by our solutions with 24/7 support and reliable
                      after-sales service.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. OUR PRIME CUSTOMERS (Trusted By) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111f38] mb-12">
              Trusted by industry leaders and{" "}
              <span className="text-cyan-600">top enterprises</span>
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            {/* Logo Grid - Reduced the gap slightly to fit the larger logos perfectly */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 items-center justify-items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
              {/* Siemens */}
              {/* Changed h-12 md:h-16 to h-20 md:h-24 lg:h-28 */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/siemens.png"
                  alt="Siemens"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Bajaj */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/bajaj.png"
                  alt="Bajaj"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Aditya Birla */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/aditya-birla.png"
                  alt="Aditya Birla Group"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Endurance */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center  transition-all duration-300 w-full px-4">
                <img
                  src="/logos/endurance.png"
                  alt="Endurance"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Varroc */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/varroc.png"
                  alt="Varroc"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Glenmark */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/glenmark.png"
                  alt="Glenmark"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Metalman */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/metalman.png"
                  alt="Metalman"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* FDC */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center  transition-all duration-300 w-full px-4">
                <img
                  src="/logos/fdc.png"
                  alt="FDC"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Ajanta Pharma */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center  transition-all duration-300 w-full px-4">
                <img
                  src="/logos/ajanta.png"
                  alt="Ajanta Pharma"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Rucha */}
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center transition-all duration-300 w-full px-4">
                <img
                  src="/logos/rucha.png"
                  alt="Rucha"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
