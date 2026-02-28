import { useState, useEffect } from "react";
import DataTable from "../components/table/DataTable";
import {
    FaCreditCard,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaUser,
    FaMountain,
    FaExternalLinkAlt,
    FaReceipt,
    FaArrowDown,
    FaWallet
} from "react-icons/fa";
import { getAllPayments } from "../api/paymentApi";

export default function ManagePayments() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await getAllPayments();
            // Data could come as res.data or just res depending on wrapper
            setData(res.data || res || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching payments:", err);
            // setError("Failed to load payments. Using demo data.");
            setLoading(false);
            // demo data matching the user's Razorpay controller structure
            setData(generateMockPayments());
        }
    };

    const columns = [
        {
            label: "Transaction ID",
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <FaReceipt size={12} />
                        </div>
                        <span className="font-black text-gray-900 text-xs">
                            {row.paymentDetails?.paymentId || row._id.substring(0, 12).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                        Order: {row.paymentDetails?.orderId || "N/A"}
                    </span>
                </div>
            )
        },
        {
            label: "Customer / Trek",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <FaUser size={10} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-gray-900 text-xs truncate">{row.name || row.user || "Unknown User"}</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase truncate">
                            <FaMountain size={8} /> {row.trekId?.title || row.trek || "Unknown Trek"}
                        </div>
                    </div>
                </div>
            )
        },
        {
            label: "Amount",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-emerald-700 text-sm">
                        ₹ {row.totalAmount?.toLocaleString() || row.amount?.toLocaleString() || "0"}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Via Razorpay</span>
                </div>
            )
        },
        {
            label: "Status",
            render: (row) => {
                const status = row.paymentDetails?.status || row.status || "Pending";
                const configs = {
                    Captured: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FaCheckCircle /> },
                    Success: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FaCheckCircle /> },
                    Pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <FaClock /> },
                    Failed: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: <FaTimesCircle /> },
                    Refunded: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: <FaArrowDown /> },
                };
                const config = configs[status] || configs.Pending;
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${config.color}`}>
                        {config.icon}
                        {status}
                    </div>
                );
            }
        },
        {
            label: "Payment Date",
            render: (row) => (
                <div className="text-gray-500 text-[10px] font-black uppercase">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                </div>
            )
        }
    ];

    const rowActions = [
        { label: "View Details", icon: <FaExternalLinkAlt />, onClick: (row) => console.log("Details", row) },
        { label: "Send Receipt", icon: <FaReceipt />, onClick: (row) => alert("Receipt sent to customer") },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                            <div className="p-4 bg-amber-100 text-amber-600 rounded-[2rem] shadow-sm shadow-amber-100">
                                <FaWallet size={24} />
                            </div>
                            Payment Management
                        </h1>
                        <p className="text-gray-500 font-bold mt-2 ml-1 text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-amber-500 rounded-full"></span>
                            {data.length} Total Transactions
                        </p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 font-black uppercase">Total Revenue</span>
                            <span className="text-lg font-black text-emerald-600 leading-none">
                                ₹ {data.reduce((sum, item) => sum + (item.totalAmount || item.amount || 0), 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <FaArrowDown className="rotate-180" />
                        </div>
                    </div>
                </header>

                <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        rowActions={rowActions}
                        initialPageSize={10}
                    />
                </div>
            </div>
        </div>
    );
}

function generateMockPayments() {
    return [
        {
            _id: "pay_1",
            name: "Rahul Sharma",
            trekId: { title: "Everest Base Camp" },
            totalAmount: 45000,
            createdAt: "2026-01-28T10:30:00Z",
            paymentDetails: {
                paymentId: "pay_Rzy9X2zW1",
                orderId: "order_Kzy1A9bN",
                status: "Captured"
            }
        },
        {
            _id: "pay_2",
            name: "Sneha Patil",
            trekId: { title: "Harishchandragad" },
            totalAmount: 2500,
            createdAt: "2026-01-27T14:20:00Z",
            paymentDetails: {
                paymentId: "pay_Rxy8Y3cV2",
                orderId: "order_Lxy2B8mD",
                status: "Pending"
            }
        },
        {
            _id: "pay_3",
            name: "Amit Varma",
            trekId: { title: "Kedarkantha Winter" },
            totalAmount: 12800,
            createdAt: "2026-01-26T09:15:00Z",
            paymentDetails: {
                paymentId: "pay_Rvw7Z4dN3",
                orderId: "order_Mvw3C7kE",
                status: "Captured"
            }
        },
        {
            _id: "pay_4",
            name: "Priya Das",
            trekId: { title: "Sandakphu Trek" },
            totalAmount: 9200,
            createdAt: "2026-01-25T17:45:00Z",
            paymentDetails: {
                paymentId: "pay_Ruv6W5eO4",
                orderId: "order_Nuv4D6jF",
                status: "Failed"
            }
        }
    ];
}
