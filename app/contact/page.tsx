import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-white pt-6 pb-16 lg:pb-0 lg:h-[350px] flex items-start overflow-hidden border-b border-slate-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-start">
          {/* Left Text */}
          <div className="w-full lg:w-1/2 lg:pr-12">
            <FadeIn direction="up">
              <div className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">
                <span className="text-cyan-600 font-bold">Get In Touch</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#111f38] mb-4">
                Contact Us
              </h1>
              <p className="text-slate-600 leading-relaxed max-w-md mb-6">
                We are here to help and answer any question you might have. We
                look forward to hearing from you!
              </p>
              <div className="w-12 h-1 bg-cyan-600"></div>
            </FadeIn>
          </div>
        </div>

        {/* Right Building Image Background (Desktop) */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0 [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10"></div>
          {/* Replace with your building image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            }}
          ></div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left Column: Contact Info & Map */}
            <div className="w-full lg:w-1/3">
              <FadeIn direction="right">
                <h2 className="text-2xl font-bold text-[#111f38] mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-8 mb-10">
                  {/* Location */}
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-[#111f38] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111f38] mb-1">
                        Our Location
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Electro Arts Automation Pvt. Ltd.
                        <br />
                        Plot No. 123, Industrial Area,
                        <br />
                        Phase 2, Chakan, Pune - 410501,
                        <br />
                        Maharashtra, India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-[#111f38] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111f38] mb-1">Phone</h4>
                      <p className="text-sm text-slate-600">
                        +91 98765 43210
                        <br />
                        +91 20 1234 5678
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-[#111f38] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111f38] mb-1">Email</h4>
                      <p className="text-sm text-slate-600">
                        info@electroarts.in
                        <br />
                        support@electroarts.in
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#111f38] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111f38] mb-1">
                        Business Hours
                      </h4>
                      <p className="text-sm text-slate-600">
                        Monday - Saturday
                        <br />
                        9:00 AM - 6:00 PM
                        <br />
                        <span className="text-slate-400">(Sunday Closed)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Google Map Embed */}
                <div className="w-full h-[200px] rounded-xl mb-6 overflow-hidden shadow-inner border border-slate-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d269.45527339973745!2d75.23343889374361!3d19.831889662088297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1780735275520!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Assistance Box */}
                <div className="bg-slate-100 rounded-xl p-5 flex items-center gap-4 border border-slate-200">
                  <div className="text-[#111f38]">
                    <svg
                      className="w-8 h-8"
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
                  <div className="flex-grow">
                    <h5 className="font-bold text-sm text-[#111f38]">
                      Need Immediate Assistance?
                    </h5>
                    <p className="text-xs text-slate-500">
                      Our support team is available 24/7.
                    </p>
                  </div>
                  <button className="bg-[#111f38] hover:bg-cyan-600 text-white text-xs font-semibold px-4 py-2 rounded transition-colors whitespace-nowrap shadow-sm">
                    Contact Support
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Contact Form */}
            <div className="w-full lg:w-2/3">
              <FadeIn direction="left" delay={0.2}>
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
                  <h2 className="text-2xl font-bold text-[#111f38] mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-slate-500 text-sm mb-8">
                    Fill out the form below and our team will get back to you as
                    soon as possible.
                  </p>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      {/* Company */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your company name"
                          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter the subject"
                        className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Write your message here..."
                        className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white resize-none"
                        required
                      ></textarea>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="w-4 h-4 text-[#111f38] border-slate-300 rounded focus:ring-cyan-500 cursor-pointer"
                        required
                      />
                      <label
                        htmlFor="privacy"
                        className="text-sm text-slate-600 cursor-pointer"
                      >
                        I agree to the{" "}
                        <Link
                          href="/privacy"
                          className="text-cyan-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/terms"
                          className="text-cyan-600 hover:underline"
                        >
                          Terms & Conditions
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#111f38] hover:bg-slate-800 text-white font-semibold py-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      Send Message
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST BADGES */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <h3 className="text-xl font-bold text-[#111f38] mb-10">
              We'd Love to Hear From You
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="text-cyan-600 mt-1">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111f38] mb-1">
                    Quick Response
                  </h5>
                  <p className="text-xs text-slate-500">
                    We reply to all inquiries within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-600 mt-1">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111f38] mb-1">
                    Tailored Solutions
                  </h5>
                  <p className="text-xs text-slate-500">
                    We provide solutions that fit your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-600 mt-1">
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
                <div>
                  <h5 className="font-bold text-sm text-[#111f38] mb-1">
                    Trusted Partner
                  </h5>
                  <p className="text-xs text-slate-500">
                    Reliable automation partner you can count on.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-600 mt-1">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111f38] mb-1">
                    Quality Assured
                  </h5>
                  <p className="text-xs text-slate-500">
                    Committed to delivering quality and excellence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-600 mt-1">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111f38] mb-1">
                    Customer Focused
                  </h5>
                  <p className="text-xs text-slate-500">
                    Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
