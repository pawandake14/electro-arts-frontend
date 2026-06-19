"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function AddMachine() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    if (!title || !description || !imageFile) {
      return alert("Please provide a Title, Description, and Image.");
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/machines`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Machine successfully added to the system!");
      setTitle("");
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
    } catch (error: any) {
      // Safely tell TypeScript this is an Axios error and REMOVE console.error
      const axiosError = error as any;

      // Get the specific error message from the backend so you know EXACTLY what failed
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error adding machine. Please try again.";

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/admin/dashboard"
              className="text-slate-500 hover:text-slate-800"
            >
              Dashboard
            </Link>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-500">Machines</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-900 font-medium">Add Machine</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Add Machine</h1>
            <p className="text-slate-500 text-sm mt-1">
              Register a new piece of equipment into the system catalog.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-800 mb-2">
                Machine Details
              </h2>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Machine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Axis CNC Router"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe the machine's capabilities and specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                >
                  {isSubmitting ? "Uploading..." : "Save Machine"}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-base font-bold text-slate-800 mb-5">
                Machine Image *
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
                    Click to upload image
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, JPEG (Max. 2MB)
                  </p>
                </div>
              </div>

              {imagePreview && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Preview
                  </h3>
                  <div className="w-full aspect-[16/9] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
