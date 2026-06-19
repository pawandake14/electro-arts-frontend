"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // 2. Get the current URL path

  // HIDE NAVBAR ON ALL DASHBOARD ROUTES
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/employee") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/reception")
  ) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Solutions", path: "/solutions" },
    { name: "Our Projects", path: "/projects" },
    { name: "Products", path: "/products" },
    { name: "Careers", path: "/careers" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="w-full bg-[#111f38] shadow-md z-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white tracking-wider flex items-center">
                <span className="text-4xl mr-1 text-cyan-500">E</span>
                <span className="text-xl mt-1">ELECTRO ARTS</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path; // Check if active

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  // 3. Dynamic styling for active and hover states with an animated underline
                  className={`relative py-1 text-sm xl:text-base font-medium transition-colors duration-300 whitespace-nowrap
                    ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
                    after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-white 
                    after:transition-transform after:duration-300 after:origin-left
                    ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                  `}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Outlined Login Button */}
            <Link
              href="/login"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-[#111f38] px-5 py-2 rounded-md font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 whitespace-nowrap ml-4"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden w-full bg-[#0a1324] border-t border-slate-700 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.name}
                href={link.path}
                // Dynamic styling for mobile menu active state
                className={`block px-3 py-3 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-[#111f38] text-white border-l-4 border-cyan-500 pl-2"
                    : "text-gray-300 hover:text-white hover:bg-[#111f38]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-700">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full text-center border border-white text-white px-5 py-3 rounded-md font-semibold hover:bg-white hover:text-[#111f38] transition-colors"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Login Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
