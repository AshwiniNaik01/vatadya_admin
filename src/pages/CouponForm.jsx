import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCoupon, getCouponById, updateCoupon } from "../api/couponApi";
import { getTreks } from "../api/trekApi";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaInfoCircle,
  FaPercentage,
  FaUsers,
  FaMountain,
  FaChevronDown,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import InputField from "../components/form/InputField";
import Checkbox from "../components/form/Checkbox";

export default function CouponForm() {
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    noOfBookings: 1,
    isActive: true,
    applicableTreks: [],
  });

  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    fetchTreks();
    if (isEditMode) {
      fetchCoupon();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTreks = async () => {
    try {
      const res = await getTreks();
      const trekData = res?.data?.treks || res?.data || res || [];
      setTreks(trekData);
    } catch (err) {
      console.error("Error fetching treks:", err);
    }
  };

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const data = await getCouponById(id);
      setFormData({
        name: data.name || "",
        percentage: data.percentage || "",
        noOfBookings: data.noOfBookings || 1,
        isActive: data.isActive ?? true,
        applicableTreks: data.applicableTreks || [],
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Failed to load coupon details.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isEditMode) {
        await updateCoupon(id, formData);
        alert("Coupon updated successfully!");
      } else {
        await createCoupon(formData);
        alert("Coupon created successfully!");
      }
      navigate("/coupons/manage");
    } catch (err) {
      console.error("Submission error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while saving coupon.";
      setErrorMessage(msg);
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTrekToggle = (trekId) => {
    setFormData((prev) => {
      const current = prev.applicableTreks || [];
      if (current.includes(trekId)) {
        return {
          ...prev,
          applicableTreks: current.filter((id) => id !== trekId),
        };
      } else {
        return {
          ...prev,
          applicableTreks: [...current, trekId],
        };
      }
    });
  };

  const filteredTreks = treks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b pb-2">
      <Icon className="text-indigo-600 text-xl" />
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <FaTicketAlt />
              </div>
              {isEditMode ? "Update Coupon" : "Create Coupon"}
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {isEditMode
                ? `Editing coupon ID: ${id}`
                : "Set up a new discount code for bookings"}
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-indigo-50/50 p-8 md:p-10 space-y-10">
            {/* Coupon Details */}
            <div>
              <SectionTitle icon={FaInfoCircle} title="Coupon Configuration" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="Coupon Code"
                  placeholder="e.g., SUMMER50, GROUPDEAL"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value.toUpperCase() })
                  }
                  required
                />

                <InputField
                  label="Discount Percentage (%)"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, percentage: e.target.value })
                  }
                  min="0"
                  max="100"
                  required
                />

                <InputField
                  label="Min. No. of Bookings (People)"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.noOfBookings}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfBookings: e.target.value })
                  }
                  min="1"
                  required
                />

                <div className="flex flex-col justify-end pb-2">
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <Checkbox
                      id="coupon-active"
                      label="Active & Ready to Use"
                      checked={formData.isActive}
                      onChange={(val) =>
                        setFormData({ ...formData, isActive: val })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trek Linking */}
            <div>
              <SectionTitle icon={FaMountain} title="Applicable Treks" />
              <p className="text-sm text-gray-500 mb-6">
                Select specific treks where this coupon can be applied. If none
                selected, the coupon will be applicable to all treks.
              </p>

              <div className="relative max-w-lg" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-left"
                >
                  <span className={`block truncate ${formData.applicableTreks?.length === 0 ? "text-gray-500" : "text-gray-900 font-medium"}`}>
                    {formData.applicableTreks?.length === 0
                      ? "All Treks (Default)"
                      : `${formData.applicableTreks.length} Trek${formData.applicableTreks.length > 1 ? "s" : ""} Selected`}
                  </span>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                        <input
                          type="text"
                          className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          placeholder="Search treks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredTreks.length > 0 ? (
                        filteredTreks.map((trek) => {
                          const isSelected = formData.applicableTreks?.includes(trek._id);
                          return (
                            <div
                              key={trek._id}
                              onClick={() => handleTrekToggle(trek._id)}
                              className={`flex items-center px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 ${isSelected ? "bg-indigo-50/30" : ""}`}
                            >
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm ${isSelected ? "font-bold text-indigo-900" : "text-gray-700"}`}>
                                  {trek.title}
                                </span>
                                <span className="block text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                  {trek.duration} · {trek.location}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-4 py-6 text-sm text-center text-gray-500">
                          No treks found.
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, applicableTreks: [] })}
                        className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(false)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 bg-indigo-100/50 rounded-lg"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/coupons/manage")}
                className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : isEditMode ? "Update Coupon" : "Save Coupon"}
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm flex items-center gap-2">
            <FaTimesCircle /> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
