"use client";
import { useEffect, useState } from "react";

export default function ReceptionDashboard() {
  const [userName, setUserName] = useState("Receptionist");

  useEffect(() => {
    // Optionally grab the user's name from localStorage if you stored it during login
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* --- Pure CSS 3D Particle/Orb Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Blue Particle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse"></div>
        {/* Emerald Particle */}
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Purple Particle */}
        <div
          className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* --- Main Welcome Content --- */}
      <div className="relative z-10 text-center p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full mx-4">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          Manage daily check-ins, oversee staff presence, and keep Electro Arts
          running smoothly.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <a
            href="/reception/mark-attendance"
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            Mark Attendance Today
          </a>
          <a
            href="/reception/attendance-records"
            className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
          >
            View Past Records
          </a>
        </div>
      </div>
    </div>
  );
}
