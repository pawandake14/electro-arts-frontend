"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeSidebar from "@/components/EmployeeSidebar";

export default function SupportHelpdesk() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    category: "IT Support",
    priority: "Low",
    description: "",
  });

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        // We will create this specific "my tickets" route in the backend next
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Add new ticket to the top of the table seamlessly
      setTickets([res.data, ...tickets]);

      // Reset form
      setFormData({
        subject: "",
        category: "IT Support",
        priority: "Low",
        description: "",
      });
      alert("Ticket submitted securely and anonymously to management.");
    } catch (err) {
      console.error("Failed to submit ticket:", err);
      alert("Failed to submit ticket. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center flex-1">
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
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              Support / Helpdesk
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex-shrink-0">
                {user?.gender === "Male" ? (
                  <img
                    src="/avatars/male-avatar.png"
                    alt="Male"
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white"
                  />
                ) : user?.gender === "Female" ? (
                  <img
                    src="/avatars/female-avatar.png"
                    alt="Female"
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                    {user?.firstName?.charAt(0) || "E"}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              How can we help?
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Submit a ticket for IT, HR, or Facility issues anonymously.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            {/* Form Section */}
            <div className="flex-1 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Create New Ticket
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Subject *
                  </label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is the issue?"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="IT Support">IT Support</option>
                      <option value="HR / Admin">HR / Admin</option>
                      <option value="Facility / Maintenance">
                        Facility / Maintenance
                      </option>
                      <option value="General Complaint">
                        General Complaint
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Description *
                  </label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the problem in detail..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Submit Ticket
                </button>
              </form>
            </div>

            {/* Tips Panel */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-3">
                  Support Tips
                </h3>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                  <li>
                    For urgent issues, please call the helpdesk extension
                    (x402).
                  </li>
                  <li>
                    Tickets are routed anonymously to protect your privacy.
                  </li>
                  <li>
                    Provide as much detail as possible to speed up resolution.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Tickets Table */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Your Recent Tickets
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-4 px-6">TICKET ID</th>
                      <th className="py-4 px-6">SUBJECT</th>
                      <th className="py-4 px-6">CATEGORY</th>
                      <th className="py-4 px-6">PRIORITY</th>
                      <th className="py-4 px-6">STATUS</th>
                      <th className="py-4 px-6">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-400"
                        >
                          Loading tickets...
                        </td>
                      </tr>
                    ) : tickets.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-400"
                        >
                          No tickets submitted yet.
                        </td>
                      </tr>
                    ) : (
                      tickets.map((ticket) => (
                        <tr
                          key={ticket._id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-6 font-bold text-slate-800 text-xs">
                            TKT-
                            {ticket._id
                              .substring(ticket._id.length - 4)
                              .toUpperCase()}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-800 font-medium">
                            {ticket.subject}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-500">
                            {ticket.category}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span
                              className={`${ticket.priority === "High" ? "text-rose-600" : ticket.priority === "Medium" ? "text-amber-600" : "text-emerald-600"} font-bold`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                ticket.status === "Open"
                                  ? "bg-blue-50 text-blue-600"
                                  : ticket.status === "In Progress"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-500">
                            {formatDate(ticket.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
