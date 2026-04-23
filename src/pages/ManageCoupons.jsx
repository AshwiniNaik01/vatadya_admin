import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllCoupons, deleteCoupon } from "../api/couponApi";
import DataTable from "../components/table/DataTable";
import Modal from "../components/modal/Modal";
import {
  FaTicketAlt,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaEye,
  FaTrashAlt,
  FaPercentage,
  FaUsers,
} from "react-icons/fa";

export default function ManageCoupons() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAllCoupons();
      setData(res || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate(`/coupons/edit/${row._id}`);
  };

  const handleView = (row) => {
    setSelectedCoupon(row);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete coupon "${row.name}"?`,
      )
    ) {
      try {
        setLoading(true);
        await deleteCoupon(row._id);
        alert("Coupon deleted successfully");
        fetchCoupons(); // Refresh data
      } catch (err) {
        console.error("Delete error:", err);
        alert(`Error deleting coupon: ${err.message || err}`);
        setLoading(false);
      }
    }
  };

  const rowActions = [
    {
      label: "View Details",
      icon: <FaEye />,
      onClick: handleView,
    },
    {
      label: "Edit Coupon",
      icon: <FaEdit />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <FaTrashAlt />,
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  const columns = [
    {
      label: "Coupon Code",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FaTicketAlt size={18} />
          </div>
          <div>
            <div className="font-black text-gray-900 leading-tight uppercase tracking-wider">
              {row.name}
            </div>
            <div className="text-[10px] text-gray-400 font-bold mt-0.5">
              Created: {new Date(row.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Discount",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 text-green-600 rounded-md">
            <FaPercentage size={12} />
          </div>
          <span className="font-black text-gray-700">{row.percentage}%</span>
        </div>
      ),
    },
    {
      label: "Min. Bookings",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
            <FaUsers size={12} />
          </div>
          <span className="font-bold text-gray-600">{row.noOfBookings} People</span>
        </div>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isActive ? (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-100">
              <FaCheckCircle size={10} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
              <FaTimesCircle size={10} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Inactive
              </span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <FaTicketAlt />
              </div>
              Manage Coupons
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Create and manage discount codes for your customers
            </p>
          </div>
          <Link
            to="/coupons/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 w-fit"
          >
            <FaPlus /> Create New Coupon
          </Link>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <FaTimesCircle />
            {error}
            <button onClick={fetchCoupons} className="ml-auto underline">
              Try Again
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowActions={rowActions}
        />
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Coupon Overview"
        size="md"
      >
        {selectedCoupon && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">
                Coupon Code
              </div>
              <h2 className="text-4xl font-black text-indigo-900 tracking-widest uppercase">
                {selectedCoupon.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Discount
                </div>
                <div className="text-2xl font-black text-green-600">
                  {selectedCoupon.percentage}% OFF
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Min. Bookings
                </div>
                <div className="text-2xl font-black text-blue-600">
                  {selectedCoupon.noOfBookings} People
                </div>
              </div>
            </div>

            {selectedCoupon.applicableTreks && selectedCoupon.applicableTreks.length > 0 && (
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Applicable Treks
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCoupon.applicableTreks.map((trek, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
                      {typeof trek === 'object' ? trek.title : 'Linked Trek'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Status</span>
                {selectedCoupon.isActive ? (
                  <span className="text-xs font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    Active
                  </span>
                ) : (
                  <span className="text-xs font-black text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedCoupon)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
              >
                <FaEdit size={14} /> Edit Coupon
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
