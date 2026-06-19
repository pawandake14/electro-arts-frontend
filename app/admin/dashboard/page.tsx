"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust path if needed
import Link from "next/link";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- HTML5 Canvas Particle Animation Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas!.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas!.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(96, 165, 250, 0.5)"; // Lighter, glowing blue for dark mode
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            // Higher base opacity, longer fade for dark mode lines
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 - distance / 480})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050A15] font-sans text-slate-200">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Animated Background Canvas - Dark Mode Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B132B] via-[#050A15] to-black">
          <canvas ref={canvasRef} className="block w-full h-full" />
        </div>

        {/* Top Navbar - Dark frosted glass */}
        <header className="bg-[#050A15]/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-slate-400 hover:text-white"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-bold tracking-wide">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              A
            </div>
            <span className="text-sm font-bold text-slate-300 hidden sm:block">
              Admin User
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 custom-scrollbar">
          {/* Welcome Banner */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="text-blue-500">Admin</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Here is what is happening across your Electro Arts platforms
              today.
            </p>
          </div>

          {/* Dashboard Quick Stats (Updated to 3 columns to perfectly balance 6 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat Card 1: Products */}
            <Link
              href="/admin/products/all-products"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/20">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">Products</h3>
              <p className="text-sm font-medium text-slate-400">
                Manage your catalog
              </p>
            </Link>

            {/* Stat Card 2: Projects */}
            <Link
              href="/admin/projects/all-projects"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-500/20">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">Projects</h3>
              <p className="text-sm font-medium text-slate-400">
                Update portfolio
              </p>
            </Link>

            {/* Stat Card 3: Machines */}
            <Link
              href="/admin/machines/all-machines"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-500/20">
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
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">Machines</h3>
              <p className="text-sm font-medium text-slate-400">
                View equipment
              </p>
            </Link>

            {/* Stat Card 4: Meetings */}
            <Link
              href="/admin/meetings/history"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors border border-rose-500/20">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">Meetings</h3>
              <p className="text-sm font-medium text-slate-400">View history</p>
            </Link>

            {/* NEW Stat Card 5: Attendance Records */}
            <Link
              href="/admin/records"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors border border-cyan-500/20">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">Attendance</h3>
              <p className="text-sm font-medium text-slate-400">
                View staff records
              </p>
            </Link>

            {/* NEW Stat Card 6: Job Applications */}
            <Link
              href="/admin/job/applications"
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors border border-purple-500/20">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                Applications
              </h3>
              <p className="text-sm font-medium text-slate-400">
                Review candidates
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
