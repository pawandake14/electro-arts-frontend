"use client";

import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // HIDE NAVBAR ON ALL DASHBOARD ROUTES
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/employee") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/reception")
  ) {
    return null;
  }

  return (
    <footer className="bg-[#0a1324] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <div className="text-2xl font-bold text-white tracking-wider flex items-center mb-6">
              <span className="text-4xl mr-1 text-cyan-500">E</span>
              <span className="text-xl mt-1">ELECTRO ARTS</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Leading the future of industrial automation with intelligent
              robotics, custom machinery, and enterprise-grade control systems.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/careers"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-cyan-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>
                  MIDC Industrial Area, Phase 2<br />
                  Pune, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>info@electroarts.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Developer Signature */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Electro Arts. All rights reserved.
          </p>

          {/* YOUR DEVELOPER CREDIT HERE */}
          <p className="text-sm text-slate-500">
            Designed & Developed by{" "}
            <a
              href="https://my-portfolio-pawan-dake.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Pawan Kishorkumar Dake
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
