"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import axios from "axios";

export default function AddProduct() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
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

      setImageFile(file); // Save physical file for backend submission

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Save string for UI preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) {
      alert("Please provide both a Title and an Image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // We must use FormData to send physical files over HTTP
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(
        "Product successfully uploaded to Cloudinary and added to the website!",
      );
      setTitle("");
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
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
              <span className="text-slate-500">Products</span>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-900 font-medium">Add Product</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>
            <p className="text-slate-500 text-sm mt-1">
              Add a new product to showcase on the website.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Product Information
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mitsubishi PLC"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Product Image <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-8 text-center transition-colors">
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
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                  >
                    {isSubmitting
                      ? "Uploading to Cloudinary..."
                      : "Save Product"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-bold text-slate-800">
                    Image Preview
                  </h2>
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

                <div className="aspect-square w-full max-w-sm mx-auto bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">No image selected</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Website Card Preview
                </h2>
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-6 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-lg w-64 mx-auto">
                  <div className="h-32 w-full flex items-center justify-center mb-4 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 rounded flex items-center justify-center text-slate-300">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900">
                    {title || "Product Title"}
                  </h3>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
