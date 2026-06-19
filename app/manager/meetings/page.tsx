"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ManagerSidebar from "@/components/ManagerSidebar";

export default function ManageMeetings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "09:00 AM",
    agenda: "",
  });

  // Analog Clock States
  const [timeMode, setTimeMode] = useState<"hours" | "minutes">("hours");
  const [tempHour, setTempHour] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempAmPm, setTempAmPm] = useState<"AM" | "PM">("AM");

  // Real Data States
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [historyMeetings, setHistoryMeetings] = useState<any[]>([]);

  // Fetch real data on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meetings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const allMeetings = res.data;

        // We set "today" to midnight so any meeting happening today stays in "Upcoming"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = allMeetings.filter(
          (m: any) => new Date(m.date) >= today,
        );
        const history = allMeetings.filter(
          (m: any) => new Date(m.date) < today,
        );

        setUpcomingMeetings(upcoming);
        setHistoryMeetings(history);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ANALOG CLOCK LOGIC ---
  const handleTimeSelect = () => {
    const formatMinute = tempMinute < 10 ? `0${tempMinute}` : tempMinute;
    const formatHour = tempHour < 10 ? `0${tempHour}` : tempHour;
    setFormData({
      ...formData,
      time: `${formatHour}:${formatMinute} ${tempAmPm}`,
    });
    setShowTimePicker(false);
  };

  const generateDialNumbers = (isMinutes: boolean) => {
    const items = isMinutes
      ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
      : [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const radius = 90;
    const center = 110;

    return items.map((num, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius + center;
      const y = Math.sin(angle) * radius + center;

      const isSelected = isMinutes
        ? tempMinute === num
        : tempHour === num || (tempHour === 12 && num === 12);

      return (
        <button
          key={num}
          type="button"
          onClick={() => {
            if (isMinutes) setTempMinute(num);
            else {
              setTempHour(num);
              setTimeMode("minutes");
            }
          }}
          style={{ left: `${x}px`, top: `${y}px` }}
          className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center font-bold transition-all ${
            isSelected
              ? "bg-blue-600 text-white shadow-md scale-110"
              : "text-slate-600 hover:bg-blue-50"
          }`}
        >
          {isMinutes ? (num < 10 ? `0${num}` : num) : num}
        </button>
      );
    });
  };

  // --- POST REAL DATA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/meetings`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const newMeeting = res.data;
      setUpcomingMeetings([newMeeting, ...upcomingMeetings]);

      setIsModalOpen(false);
      setFormData({ title: "", date: "", time: "09:00 AM", agenda: "" });
    } catch (err) {
      console.error("Failed to create meeting:", err);
      alert("Failed to schedule meeting. Please try again.");
    }
  };

  // Helper to format date cleanly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <ManagerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full relative">
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
              Meetings
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
                    {user?.firstName?.charAt(0) || "M"}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <h3 className="text-slate-800 font-bold text-sm truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || "Manager"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Meetings
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Schedule upcoming meetings and view past records.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 text-sm"
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Schedule Meeting
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Upcoming Meetings
            </h3>
            {upcomingMeetings.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
                No upcoming meetings scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-900 truncate">
                        {meeting.title}
                      </h4>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {meeting.agenda || "No agenda provided."}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {formatDate(meeting.date)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {meeting.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Meeting History
            </h3>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">MEETING TITLE</th>
                      <th className="py-3 px-2">DATE & TIME</th>
                      <th className="py-3 px-2">ORGANISED BY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyMeetings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-slate-400 text-sm"
                        >
                          No past meetings found.
                        </td>
                      </tr>
                    ) : (
                      historyMeetings.map((history) => (
                        <tr
                          key={history._id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-2 font-bold text-slate-800 text-sm">
                            {history.title}
                          </td>
                          <td className="py-4 px-2 text-sm text-slate-600">
                            {formatDate(history.date)}, {history.time}
                          </td>
                          <td className="py-4 px-2 text-sm text-slate-600">
                            {history.organizer?.firstName}{" "}
                            {history.organizer?.lastName}
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

      {/* --- SCHEDULE MEETING MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative transform transition-all">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800">
                Schedule New Meeting
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full p-1.5 border border-slate-100 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Meeting Title *
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Weekly Sync"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Time *
                  </label>
                  <input
                    readOnly
                    type="text"
                    value={formData.time}
                    onClick={() => {
                      setShowTimePicker(true);
                      setTimeMode("hours");
                    }}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Agenda / Description
                </label>
                <textarea
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What will be discussed?"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>

            {/* --- CUSTOM ANALOG CLOCK OVERLAY --- */}
            {showTimePicker && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
                <div className="w-[280px] bg-white border border-slate-100 rounded-2xl shadow-2xl p-5">
                  <div className="flex justify-between items-center mb-6 px-1">
                    <div className="font-bold text-3xl text-slate-800 flex items-baseline gap-1">
                      <button
                        type="button"
                        onClick={() => setTimeMode("hours")}
                        className={`${timeMode === "hours" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"} transition-colors`}
                      >
                        {tempHour < 10 ? `0${tempHour}` : tempHour}
                      </button>
                      <span className="text-slate-300">:</span>
                      <button
                        type="button"
                        onClick={() => setTimeMode("minutes")}
                        className={`${timeMode === "minutes" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"} transition-colors`}
                      >
                        {tempMinute < 10 ? `0${tempMinute}` : tempMinute}
                      </button>
                    </div>
                    <div className="flex bg-slate-100 rounded-lg p-1.5">
                      <button
                        type="button"
                        onClick={() => setTempAmPm("AM")}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${tempAmPm === "AM" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempAmPm("PM")}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${tempAmPm === "PM" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                      >
                        PM
                      </button>
                    </div>
                  </div>

                  <div className="relative w-[220px] h-[220px] mx-auto bg-slate-50 rounded-full border border-slate-100 mb-6 shadow-inner">
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-blue-600 rounded-full z-10"></div>
                    <div
                      className="absolute top-1/2 left-1/2 w-0.5 bg-blue-400/30 origin-bottom"
                      style={{
                        height: "70px",
                        transform: `rotate(${(timeMode === "hours" ? tempHour : tempMinute / 5) * 30}deg) translateY(-100%)`,
                        marginTop: "-70px",
                        marginLeft: "-1px",
                      }}
                    ></div>
                    {generateDialNumbers(timeMode === "minutes")}
                  </div>

                  <div className="flex justify-between gap-3 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTimePicker(false)}
                      className="flex-1 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleTimeSelect}
                      className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
