import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { deleteStay, getStays, updateStay } from "../api/staysApi";
import Modal from "../components/modal/Modal";
import {
  FaPlus,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaInfoCircle,
  FaBed,
  FaRupeeSign,
  FaSearch,
} from "react-icons/fa";
import TrekCard from "../components/cards/TrekCard";
import { FiImage, FiPlusCircle } from "react-icons/fi";

export default function ManageStays() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStay, setSelectedStay] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const res = await getStays();
      setData(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stays:", err);
      setError("Failed to load stays. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (stay) => navigate(`/stay/edit/${stay._id}`);

  const handleView = (stay) => {
    setSelectedStay(stay);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (stay) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${stay.title}"?`,
      )
    ) {
      try {
        setLoading(true);
        await deleteStay(stay._id);
        fetchStays();
      } catch (err) {
        console.error("Delete error:", err);
        alert(`Error deleting stay: ${err.message || err}`);
        setLoading(false);
      }
    }
  };

  const categoryOptions = [
    { id: "budget", name: "Budget" },
    { id: "bunglow", name: "Bunglow" },
    { id: "villa", name: "Villa" },
    { id: "luxury", name: "Luxury" },
    { id: "boutique", name: "Boutique" },
    { id: "resort", name: "Resort" },
    { id: "homestay", name: "Homestay" },
    { id: "hostel", name: "Hostel" },
  ];

  const filteredData = data.filter((stay) => {
    const matchesSearch =
      stay.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.address?.state?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || stay.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-[2rem] shadow-sm shadow-blue-100">
                <FaBed size={28} />
              </div>
              Manage Stays
            </h1>
            <p className="text-gray-500 font-bold mt-2 ml-1 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-500 rounded-full"></span>
              {data.length} Total Properties
            </p>
          </div>
          <Link
            to="/stay/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3.5 rounded-[1.25rem] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 w-fit"
          >
            <FaPlus /> Create New Stay
          </Link>
        </header>

        {/* Inline Filter Controls */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stays by name, city or state..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm font-semibold text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                x
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                categoryFilter === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              All Categories
            </button>
            {categoryOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setCategoryFilter(opt.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                  categoryFilter === opt.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
            <FaTimesCircle />
            {error}
            <button
              onClick={fetchStays}
              className="ml-auto underline font-black"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-[400px] border border-gray-100 animate-pulse flex flex-col"
              >
                <div className="h-48 bg-gray-100 rounded-t-3xl" />
                <div className="p-5 space-y-4 flex-1">
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-10 bg-gray-50 rounded-xl" />
                    <div className="h-10 bg-gray-50 rounded-xl" />
                  </div>
                  <div className="mt-auto h-12 bg-gray-50 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {filteredData.map((stay) => (
              <TrekCard
                key={stay._id}
                trek={stay}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="bg-blue-50 text-blue-500 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <FaBed size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              No Stays Found
            </h3>
            <p className="text-gray-500 font-bold max-w-sm mx-auto">
              {searchQuery
                ? `We couldn't find any stays matching "${searchQuery}".`
                : "You haven't added any stays to the catalog yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 text-blue-600 font-black hover:text-blue-700 transition-colors underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Stay Details"
        size="xl"
      >
        {selectedStay && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Hero */}
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                <img
                  src={
                    selectedStay.image?.cdnUrl ||
                    selectedStay.image ||
                    "https://tse1.mm.bing.net/th/id/OIP.dI22OgiQxCFyDNQ2PaNtvQHaE8?pid=Api&P=0&h=180"
                  }
                  alt={selectedStay.title || "Stay"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://tse1.mm.bing.net/th/id/OIP.dI22OgiQxCFyDNQ2PaNtvQHaE8?pid=Api&P=0&h=180";
                  }}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedStay.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                      {selectedStay.category}
                    </span>
                  )}
                  {selectedStay.bookingType && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                      {selectedStay.bookingType}
                    </span>
                  )}
                  {selectedStay.reg_type && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                      {selectedStay.reg_type}
                    </span>
                  )}
                  {selectedStay.featured && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold uppercase">
                      Featured
                    </span>
                  )}
                  {selectedStay.isActive === false && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase">
                      Inactive
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                  {selectedStay.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {(selectedStay.address?.city ||
                    selectedStay.address?.state) && (
                    <div className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-blue-500" />
                      {[selectedStay.address.city, selectedStay.address.state]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {selectedStay.duration && (
                    <div className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-amber-500" />
                      {selectedStay.duration}
                    </div>
                  )}
                  {selectedStay.price > 0 && (
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <FaRupeeSign className="text-green-500" />
                      {selectedStay.price?.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Group Size
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {selectedStay.adults || "N/A"} Adults &{" "}
                  {selectedStay.children || "N/A"} Children
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Check-in
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {selectedStay.startTime || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Check-out
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {selectedStay.endTime || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Base Fee
                </p>
                <p className="text-sm font-bold text-gray-800">
                  Rs. {selectedStay?.feeDetails?.basePrice?.amount || 0}
                </p>
              </div>
            </div>

            {/* Address */}
            {selectedStay.address && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Property Address
                </h4>
                <div className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100">
                  {[
                    selectedStay.address.address1,
                    selectedStay.address.address2,
                    selectedStay.address.street,
                    selectedStay.address.city,
                    selectedStay.address.district,
                    selectedStay.address.state,
                    selectedStay.address.pincode,
                    selectedStay.address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            )}

            {/* Highlights & Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" /> Highlights
              </h4>
              <div
                className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100"
                dangerouslySetInnerHTML={{
                  __html: selectedStay.highlight || "No Highlight provided.",
                }}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" /> Description
              </h4>
              <div
                className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedStay.description || "No description provided.",
                }}
              />
            </div>

            {/* Gallery */}
            {selectedStay.gallery?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiImage className="text-blue-500" /> Property Gallery
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedStay.gallery?.map((img, index) => (
                    <img
                      key={index}
                      src={img?.cdnUrl || img}
                      alt={`Gallery ${index}`}
                      className="w-full h-40 object-cover rounded-xl border border-gray-100 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add-on Services */}
            {selectedStay.addons?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiPlusCircle className="text-blue-500" /> Add-on Services
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStay.addons.map((addon, idx) => (
                    <div
                      key={addon._id || idx}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <p className="font-bold text-gray-800">{addon.name}</p>
                      <p className="text-sm text-gray-500">
                        {addon.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        Rs. {addon.price}
                        {addon.type && addon.type !== "flat" && (
                          <span className="text-gray-400 font-normal ml-1">
                            / {addon.type === "perPerson" ? "person" : "night"}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedStay)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
              >
                <FaEdit size={14} /> Edit Stay
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
