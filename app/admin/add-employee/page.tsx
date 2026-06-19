"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function AddEmployee() {
  // Expanded state to match the new UI fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    doj: "",
    password: "",
    confirmPassword: "",
    sendEmail: true,
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // NEW: State for the mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token");

    await axios.post(
      "${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-user",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Fixed!
        },
      },
    );

    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Error: Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // UPDATED: Now sending the exact fields to match your new database schema
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        doj: formData.doj,
        password: formData.password,
        role: formData.role || "Employee",
        department: "Engineering",
        sendEmail: formData.sendEmail,
      };

      const response = await fetch(
        "${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ User added successfully!");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dob: "",
          gender: "",
          doj: "",
          password: "",
          confirmPassword: "",
          sendEmail: true,
          role: "",
        });
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* UPDATED: Passing the mobile sidebar state */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* UPDATED: Changed ml-64 to md:ml-64 and added w-full for mobile */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* UPDATED: Adjusted padding for mobile (px-4 md:px-8) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center flex-1">
            {/* NEW: Hamburger Button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-slate-500 hover:text-slate-800 focus:outline-none"
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

            <h1 className="text-xl font-bold text-slate-800">Add User</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-4 md:pl-6">
              <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center text-xs font-bold">
                AU
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {/* Page Title & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Add User</h1>
              <p className="text-sm text-slate-500 mt-1">
                Fill in the details below to create a new user.
              </p>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="text-blue-600 hover:underline"
              >
                Dashboard
              </Link>
              <span className="text-slate-400">{">"}</span>
              <span className="text-slate-700">Add User</span>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              {message}
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-4 md:p-8">
              {/* SECTION 1: User Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
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
                  <h2 className="text-lg font-bold text-slate-800">
                    User Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-1 lg:col-span-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 lg:col-span-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="col-span-1 lg:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="col-span-1 lg:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select className="px-3 py-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-700 focus:outline-none text-sm">
                        <option>🇮🇳 +91</option>
                      </select>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-r-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 lg:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="col-span-1 lg:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Date of Joining <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.doj}
                      onChange={(e) =>
                        setFormData({ ...formData, doj: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 my-8" />

              {/* SECTION 2: Account Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                  <h2 className="text-lg font-bold text-slate-800">
                    Account Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-10 text-slate-400 hover:text-slate-600"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, sendEmail: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="sendEmail"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Send login credentials to email
                  </label>
                </div>
              </div>

              <hr className="border-slate-200 my-8" />

              {/* SECTION 3: Role & Permissions */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <h2 className="text-lg font-bold text-slate-800">
                    Role & Permissions
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Assign Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Reception">Reception</option>
                      <option value="Store">Store</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        ></path>
                      </svg>
                      Save User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
