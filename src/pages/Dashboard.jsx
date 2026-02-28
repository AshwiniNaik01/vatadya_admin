import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaMountain,
  FaTicketAlt,
  FaStar,
  FaWallet,
  FaPlus,
  FaArrowRight,
  FaChartLine,
  FaHistory,
  FaArrowUp,
  FaRegBell,
  FaHiking,
  FaImages,
  FaCompass,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

// Import all APIs
import { getTreks } from "../api/trekApi";
import { getAllBookings } from "../api/bookingApi";
import { getReviews } from "../api/reviewApi";
import { getAllPayments } from "../api/paymentApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    treks: 0,
    bookings: 0,
    reviews: 0,
    revenue: 0,
    loading: true,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingTrend, setBookingTrend] = useState([]);
  const [trekDistribution, setTrekDistribution] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [treksRes, bookingsRes, reviewsRes, paymentsRes] =
        await Promise.all([
          getTreks().catch(() => ({ data: [] })),
          getAllBookings().catch(() => ({ data: [] })),
          getReviews().catch(() => ({ data: [] })),
          getAllPayments().catch(() => ({ data: [] })),
        ]);

      const treksData = treksRes.data || treksRes || [];
      const bookingsData = bookingsRes?.data || bookingsRes || [];

      let reviewsData = [];
      if (Array.isArray(reviewsRes)) reviewsData = reviewsRes;
      else if (reviewsRes?.data) reviewsData = reviewsRes.data;
      else if (reviewsRes?.trekReviews) reviewsData = reviewsRes.trekReviews;

      const paymentsData = paymentsRes.data || paymentsRes || [];
      const totalRevenue = paymentsData.reduce(
        (sum, p) => sum + (p.totalAmount || p.amount || 0),
        0,
      );

      setStats({
        treks: treksData.length,
        bookings: bookingsData.length,
        reviews: reviewsData.length,
        revenue: totalRevenue,
        loading: false,
      });

      setRecentBookings(bookingsData.slice(0, 6));

      setBookingTrend([
        { name: "Jan", val: 12 },
        { name: "Feb", val: 25 },
        { name: "Mar", val: 18 },
        { name: "Apr", val: 32 },
      ]);

      setTrekDistribution([
        { name: "Easy", value: 35, color: "#10b981" },
        { name: "Moderate", value: 45, color: "#f59e0b" },
        { name: "Difficult", value: 20, color: "#ef4444" },
      ]);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      label: "Expeditions",
      value: stats.treks,
      icon: <FaMountain />,
      color: "from-blue-600 to-indigo-600",
    },
    {
      label: "Reservations",
      value: stats.bookings,
      icon: <FaTicketAlt />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Net Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <FaWallet />,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Advocacy",
      value: `${stats.reviews} ★`,
      icon: <FaStar />,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const allQuickLinks = [
    {
      label: "New Trek",
      path: "/treks/create",
      icon: <FaPlus />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Manage Treks",
      path: "/treks/manage",
      icon: <FaMountain />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Bookings",
      path: "/bookings/manage",
      icon: <FaTicketAlt />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Feedback",
      path: "/reviews/manage",
      icon: <FaStar />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    // {
    //   label: "Finances",
    //   path: "/payments/manage",
    //   icon: <FaWallet />,
    //   color: "text-rose-600",
    //   bg: "bg-rose-50",
    // },
    {
      label: "Media Hub",
      path: "/gallery/manage",
      icon: <FaImages />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fcfdfe] pb-20"
    >
      <div className="max-w-7xl mx-auto px-2 py-2 space-y-12">
        {/* 1. TOP HEADER */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 rounded-lg p-2">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white rotate-3 shadow-lg">
              <FaCompass size={24} className="animate-spin-slow" />
            </div>

            {/* Text */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                VATA<span className="text-emerald-600">DYA</span>
              </h1>
              <p className="text-slate-400 font-semibold text-[9px] uppercase tracking-[0.2em] mt-1 shrink-0">
                Adventure Hub • Explorer v1.0
              </p>
            </div>
          </div>
        </header>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl border border-slate-100 shadow-xl relative group"
            >
              <div className="flex items-start justify-between relative z-10">
                <div
                  className={`p-4 rounded-lg bg-linear-to-br ${card.color} text-white shadow-xl shadow-blue-100/50`}
                >
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">
                    {card.label}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {stats.loading ? "..." : card.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. QUICK LINKS ROW (Horizontal Section) */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h4 className="text-md font-black text-amber-600 uppercase tracking-[0.4em] flex items-center gap-3">
            <span className="w-2 h-2 bg-amber-600 rounded-full"></span> Quick
            Actions Hub
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allQuickLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="group bg-white p-6 rounded-[2.25rem] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-900/5 transition-all flex flex-col items-center gap-4 text-center"
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl ${link.bg} ${link.color} transition-transform group-hover:scale-110 shadow-sm`}
                >
                  {link.icon}
                </div>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 4. CHARTS SECTION (Area & Pie Below Links) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Momentum Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Booking Momentum
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Growth Progression Engine
                </p>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-700 uppercase">
                  Snapshot Mode
                </span>
              </div>
            </div>

            <div className="h-87.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingTrend}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontWeight: 700, fontSize: 10 }}
                    dy={15}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "24px",
                      border: "none",
                      shadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#6366f1"
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Expedition Mix Pie Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
          >
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 mb-8">
              Expedition Mix
            </h4>
            <div className="h-62.5 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trekDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {trekDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <FaHiking
                  size={32}
                  className="mx-auto mb-1 text-emerald-500 opacity-50"
                />
                <p className="text-2xl font-black">{stats.treks}</p>
                <p className="text-[8px] font-black uppercase text-slate-500">
                  Total Treks
                </p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              {trekDistribution.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: d.color }}
                    ></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {d.name}
                    </span>
                  </div>
                  <span className="text-xs font-black opacity-60">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 5. ACTIVITY TIMELINE */}
        {/* <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="p-5 bg-emerald-100 text-emerald-600 rounded-3xl shadow-lg shadow-emerald-50">
                <FaHistory size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Global Activity stream</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Live Reservation Engine Output</p>
              </div>
            </div>
            <Link to="/bookings/manage" className="px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-[2rem] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-300">Open Access Ledger</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBookings.length > 0 ? recentBookings.map((booking, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-slate-50/50 p-8 rounded-[3rem] border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase">{new Date(booking.createdAt).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-slate-900">{new Date(booking.createdAt).getDate()}</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Captured</div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-black text-slate-900 truncate">{booking.name || booking.user || "Expedition Member"}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                    <FaMountain className="text-emerald-500" /> {booking.trekId?.title || booking.trek}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fee</span>
                  <span className="text-xl font-black text-emerald-600">₹{(booking.totalAmount || booking.amount || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center opacity-20 italic font-black text-2xl uppercase tracking-[0.4em]">Engine Standby...</div>
            )}
          </div>
        </div> */}
      </div>
    </motion.div>
  );
}
