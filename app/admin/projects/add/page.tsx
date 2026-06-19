"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust if needed
import Link from "next/link";
import axios from "axios";

export default function AddProject() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [clientIndustry, setClientIndustry] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please select an image under 2MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !imageFile) {
      alert("Please provide a Title, Short Description, and Image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("shortDescription", shortDescription);
      formData.append("clientIndustry", clientIndustry);
      formData.append("image", imageFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Project successfully uploaded and added to the website!");
      setTitle("");
      setShortDescription("");
      setClientIndustry("");
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-slate-500 hover:text-slate-800"
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
              <Link
                href="/admin/dashboard"
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-500">Projects</span>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-900 font-medium">
                Add New Project
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Add New Project
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add a new project to showcase on the website.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Project Details
                </h2>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>
                      Short Description <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-xs font-normal text-slate-400">
                      {shortDescription.length} / 150
                    </span>
                  </label>
                  <textarea
                    required
                    maxLength={150}
                    rows={3}
                    placeholder="Enter a short description (max 150 characters)"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Client / Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Automotive, Manufacturing, Water Treatment"
                    value={clientIndustry}
                    onChange={(e) => setClientIndustry(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setShortDescription("");
                    setClientIndustry("");
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors bg-white shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                >
                  {isSubmitting ? "Uploading..." : "Save Project"}
                </button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Project Image <span className="text-rose-500">*</span>
                </h2>

                <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-8 text-center transition-colors mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <svg
                      className="w-8 h-8 text-blue-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, JPEG, WEBP (Max. 2MB)
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700">
                    Image Preview
                  </h3>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md border border-rose-100 transition-colors"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>

                <div className="w-full aspect-[16/9] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">No image selected</p>
                  )}
                </div>

                <div className="mt-5 bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-xs leading-relaxed text-blue-800">
                    This image and text will automatically be formatted and
                    displayed on the public Projects page.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
