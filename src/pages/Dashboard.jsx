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
        0
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
        { name: "May", val: 45 },
        { name: "Jun", val: 38 },
      ]);

      setTrekDistribution([
        { name: "Easy", value: 35, color: "#3b82f6" },
        { name: "Moderate", value: 45, color: "#2563eb" },
        { name: "Difficult", value: 20, color: "#1d4ed8" },
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
      color: "from-blue-600 to-blue-800",
    },
    {
      label: "Reservations",
      value: stats.bookings,
      icon: <FaTicketAlt />,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Net Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <FaWallet />,
      color: "from-blue-700 to-blue-900",
    },
    {
      label: "Advocacy",
      value: `${stats.reviews} ★`,
      icon: <FaStar />,
      color: "from-slate-700 to-slate-900",
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
      color: "text-blue-700",
      bg: "bg-blue-50/50",
    },
    {
      label: "Bookings",
      path: "/bookings/manage",
      icon: <FaTicketAlt />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Feedback",
      path: "/reviews/manage",
      icon: <FaStar />,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      label: "Media Hub",
      path: "/gallery/manage",
      icon: <FaImages />,
      color: "text-blue-800",
      bg: "bg-blue-50/80",
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
      className="min-h-screen bg-white pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* 1. TOP HEADER */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 rounded-2xl bg-slate-50 p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            {/* Icon */}
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <FaCompass size={28} className="animate-spin-slow" />
            </div>

            {/* Text */}
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                VATA<span className="text-blue-600">DYA</span>
              </h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1.5 shrink-0">
                Performance Dashboard • Explorer v2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-sm font-bold text-blue-600">All Nodes Active</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaChartLine size={20} />
            </div>
          </div>
        </header>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-transparent to-blue-50/30 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="flex items-start justify-between relative z-10">
                <div
                  className={`p-4 rounded-2xl bg-linear-to-br ${card.color} text-white shadow-2xl shadow-blue-200/50 group-hover:rotate-6 transition-transform`}
                >
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1.5">
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

        {/* 3. QUICK LINKS ROW */}
        <motion.div variants={itemVariants} className="space-y-8 bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>

          <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-4 relative z-10">
            <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
            Operational Command Center
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {allQuickLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="group bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all flex flex-col items-center gap-5 text-center"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white text-blue-600 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-xl`}
                >
                  {link.icon}
                </div>
                <span className="text-[11px] font-black text-white/80 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 4. CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Momentum Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Booking Momentum
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                  Growth Analytics Engine
                </p>
              </div>
              <div className="bg-blue-50 px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-blue-100">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-700 uppercase">
                  Real-time Sync
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingTrend}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.2}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontWeight: 800, fontSize: 10 }}
                    dy={15}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                      fontWeight: 800,
                      fontSize: "12px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#2563eb"
                    strokeWidth={6}
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
            className="lg:col-span-4 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group"
          >
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-10">
              Expedition Mix
            </h4>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trekDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {trekDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <FaHiking
                  size={36}
                  className="mx-auto mb-2 text-blue-600 opacity-20"
                />
                <p className="text-3xl font-black text-slate-900">{stats.treks}</p>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Active
                </p>
              </div>
            </div>
            <div className="space-y-3 mt-10">
              {trekDistribution.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: d.color }}
                    ></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {d.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
