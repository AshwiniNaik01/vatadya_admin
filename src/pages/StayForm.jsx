import { useState, useRef, useEffect } from "react";
import * as Yup from "yup";

import {
  FaImage,
  FaInfoCircle,
  FaRupeeSign,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaChartBar,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaHiking,
  FaLink,
  FaBuilding,
  FaMap,
} from "react-icons/fa";

// UI Components — keep your existing imports
import InputField from "../components/form/InputField";
import TagsInput from "../components/form/TagsInput";
import ImageUploader from "../components/form/ImageUploader";
import CustomSelect from "../components/form/CustomSelect";
import CustomDatePicker from "../components/form/CustomDatePicker";
import RichTextEditor from "../components/form/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { createStay, getStayById, updateStay } from "../api/staysApi";

// ─── Validation Schema ──────────────────────────────────────────────────────
const stayValidationSchema = Yup.object().shape({
  title: Yup.string().required("Stay name is required"),
  duration: Yup.string().required("Duration is required"),
  groupSize: Yup.string().required("Group size is required"),
  category: Yup.string().nullable().required("Category is required"),
  bookingType: Yup.string().nullable().required("Booking type is required"),
  address: Yup.object().shape({
    address1: Yup.string().required("Address line 1 is required"),
    pincode: Yup.string()
      .matches(/^\d{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
  }),
  price: Yup.number().min(0, "Price cannot be negative"),
});

// ─── Static Options ─────────────────────────────────────────────────────────
const STATIC_CATEGORIES = [
  { value: "budget", label: "Budget" },
  { value: "bunglow", label: "Bunglow" },
  { value: "villa", label: "Villa" },
  { value: "luxury", label: "Luxury" },
  { value: "boutique", label: "Boutique" },
  { value: "resort", label: "Resort" },
  { value: "homestay", label: "Homestay" },
  { value: "hostel", label: "Hostel" },
];

const STATIC_BOOKING_TYPES = [
  { value: "instant", label: "Instant Booking" },
  { value: "request", label: "Request to Book" },
  { value: "enquiry", label: "Enquiry Only" },
];

const REGI_TYPES = [
  { value: "AC", label: "AC" },
  { value: "NON-AC", label: "NON-AC" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
].map((s) => ({ value: s, label: s }));

// ─── Default Form State ──────────────────────────────────────────────────────
const DEFAULT_FORM = {
  title: "",
  duration: "",
  groupSize: "",
  price: 0,
  featured: false,
  isActive: true,
  startTime: "",
  endTime: "",
  tags: [],
  description: "",
  highlight: "",
  reg_type: "AC",
  bookingType: "",
  category: null,
  startDate: null,
  endDate: null,
  mapUrl: "",
  address: {
    address1: "",
    address2: "",
    nearbyLocation: "",
    street: "",
    district: "",
    city: "",
    state: null,
    pincode: "",
    country: "India",
  },
  feeDetails: {
    basePrice: { amount: 0, description: "" },
    pricingType: { description: "" },
    weekendCharge: { amount: 0, description: "" },
    peakMultiplier: { value: 1, description: "" },
    mealPrice: { amount: 0, description: "" },
    extraBedPrice: { amount: 0, description: "" },
    discount: { value: 0, description: "" },
    gstPercent: { value: 5, description: "" },
  },
  addons: [],
  image: null,
  gallery: [],
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function StayForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const priceInputRef = useRef(null);
  const { id } = useParams();
  const isEditMode = !!id;
  // Add this useEffect after: const isEditMode = !!id;
  useEffect(() => {
    if (!isEditMode) return;

    const fetchStay = async () => {
      try {
        setLoading(true);
        const res = await getStayById(id);
        const stay = res.data || res;

        setFormData({
          title: stay.title || "",
          duration: stay.duration || "",
          groupSize: stay.groupSize || "",
          price: stay.price || 0,
          featured: stay.featured || false,
          isActive: stay.isActive !== undefined ? stay.isActive : true,
          startTime: stay.startTime || "",
          endTime: stay.endTime || "",
          tags: stay.tags || [],
          description: stay.description || "",
          highlight: stay.highlight || "",
          reg_type: stay.reg_type || "AC",
          bookingType: stay.bookingType || "",
          category: stay.category || null,
          startDate: stay.startDate ? new Date(stay.startDate) : null,
          endDate: stay.endDate ? new Date(stay.endDate) : null,
          mapUrl: stay.mapUrl || "",
          address: {
            address1: stay.address?.address1 || "",
            address2: stay.address?.address2 || "",
            nearbyLocation: stay.address?.nearbyLocation || "",
            street: stay.address?.street || "",
            district: stay.address?.district || "",
            city: stay.address?.city || "",
            state: stay.address?.state || null,
            pincode: stay.address?.pincode || "",
            country: stay.address?.country || "India",
          },
          feeDetails: {
            basePrice: stay.feeDetails?.basePrice || {
              amount: 0,
              description: "",
            },
            pricingType: stay.feeDetails?.pricingType || { description: "" },
            weekendCharge: stay.feeDetails?.weekendCharge || {
              amount: 0,
              description: "",
            },
            peakMultiplier: stay.feeDetails?.peakMultiplier || {
              value: 1,
              description: "",
            },
            mealPrice: stay.feeDetails?.mealPrice || {
              amount: 0,
              description: "",
            },
            extraBedPrice: stay.feeDetails?.extraBedPrice || {
              amount: 0,
              description: "",
            },
            discount: stay.feeDetails?.discount || {
              value: 0,
              description: "",
            },
            gstPercent: stay.feeDetails?.gstPercent || {
              value: 5,
              description: "",
            },
          },
          addons: stay.addons || [],
          // Keep existing image/gallery URLs as strings for display
          image: stay.image?.cdnUrl || stay.image || null,
          gallery: (stay.gallery || []).map((g) => g?.cdnUrl || g),
        });
      } catch (err) {
        setErrorMessage("Failed to load stay data for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchStay();
  }, [id, isEditMode]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaInfoCircle },
    { id: "address", label: "Address", icon: FaMapMarkerAlt },
    { id: "details", label: "Specifications", icon: FaChartBar },
    { id: "logistics", label: "Content", icon: FaCalendarAlt },
    { id: "fees", label: "Pricing", icon: FaRupeeSign },
    { id: "media", label: "Media", icon: FaImage },
  ];

  const getFieldsForTab = (tabId) =>
    ({
      basic: [
        "title",
        "duration",
        "groupSize",
        "reg_type",
        "category",
        "bookingType",
      ],
      address: ["address"],
      details: ["startTime", "endTime", "tags", "mapUrl"],
      logistics: ["startDate", "endDate", "description"],
      fees: ["price", "feeDetails", "links"],
      media: ["image", "gallery", "addons"],
    })[tabId] || [];

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const set = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const setAddress = (key, value) =>
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));

  const calculateFinalFee = (doc) => {
    const fd = doc.feeDetails || {};

    const getAmount = (obj) => Number(obj?.amount ?? 0);
    const getValue = (obj) => Number(obj?.value ?? 0);

    // Base price
    const base = getAmount(fd.basePrice);

    // Discount (on base)
    const discountPercent = getValue(fd.discount);
    const discountAmount = (base * discountPercent) / 100;
    const discountedBase = base - discountAmount;

    // Peak pricing (only if > 1)
    const peakMultiplier = getValue(fd.peakMultiplier);
    const peakAdjustedBase =
      peakMultiplier > 1 ? discountedBase * peakMultiplier : discountedBase;

    // Add-ons / optional charges
    const weekend = getAmount(fd.weekendCharge);
    const meal = getAmount(fd.mealPrice);
    const extraBed = getAmount(fd.extraBedPrice);

    // Dynamic addons
    const addonsTotal = (doc.addons || []).reduce(
      (sum, a) => sum + Number(a.price || 0),
      0,
    );

    // Subtotal before GST
    const subtotal = peakAdjustedBase + weekend + meal + extraBed + addonsTotal;

    // GST (on subtotal)
    const gstPercent = getValue(fd.gstPercent);
    const gstAmount = (subtotal * gstPercent) / 100;

    const finalAmount = subtotal + gstAmount;

    return Math.round(finalAmount);
  };
  const updateFeeDetails = (updatedFeeDetails) => {
    const updated = { ...formData, feeDetails: updatedFeeDetails };
    setFormData({ ...updated, price: calculateFinalFee(updated) });
  };

  const handleArrayChange = (index, field, value, section) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    const newData = { ...formData, [section]: updated };
    setFormData({ ...newData, price: calculateFinalFee(newData) });
  };

  const addArrayItem = (section, defaultObj) => {
    const newData = {
      ...formData,
      [section]: [...formData[section], defaultObj],
    };
    setFormData({ ...newData, price: calculateFinalFee(newData) });
  };

  const removeArrayItem = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    const newData = { ...formData, [section]: updated };
    setFormData({ ...newData, price: calculateFinalFee(newData) });
  };

  // ─── Navigation ────────────────────────────────────────────────────────────
  const handleNextTab = async () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      await stayValidationSchema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      const exclude = [
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "id",
        "image",
        "gallery",
        "startDate",
        "endDate",
      ];

      Object.keys(formData).forEach((key) => {
        if (exclude.includes(key)) return;
        const value = formData[key];

        if (["addons", "feeDetails", "links", "address"].includes(key)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      if (formData.startDate)
        formDataToSend.append(
          "startDate",
          new Date(formData.startDate).toISOString(),
        );
      if (formData.endDate)
        formDataToSend.append(
          "endDate",
          new Date(formData.endDate).toISOString(),
        );

      if (formData.image instanceof File) {
        formDataToSend.append("StayImage", formData.image);
      } else if (typeof formData.image === "string" && formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (Array.isArray(formData.gallery)) {
        formData.gallery.forEach((item) => {
          if (item instanceof File) formDataToSend.append("StayGallery", item);
          else if (typeof item === "string" && item)
            formDataToSend.append("gallery", item);
        });
      }
      // With:
      if (isEditMode) {
        await updateStay(id, formDataToSend);
      } else {
        await createStay(formDataToSend);
      }
      navigate("/stay/manage");
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((e) => (errors[e.path] = e.message));
        setFieldErrors(errors);
        setErrorMessage(
          err.inner.map((e) => `${e.path}: ${e.message}`).join("\n"),
        );
      } else {
        const apiMsg =
          err.response?.data?.message || err.message || "An error occurred.";
        setErrorMessage(apiMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Sub-components ────────────────────────────────────────────────────────
  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b pb-2">
      <Icon className="text-blue-600 text-xl" />
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-sm mt-1">{fieldErrors[name]}</p>
    ) : null;

  const NextBtn = () => (
    <div className="flex justify-end pt-6">
      <button
        type="button"
        onClick={handleNextTab}
        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
      >
        Next Step <FaChevronRight size={14} />
      </button>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Update Stay" : "Create New Stay"}
          </h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/stay/manage")}
              className="px-6 py-2 text-gray-500 font-bold hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : isEditMode ? (
                "Update Details"
              ) : (
                "Verify & Save Stay"
              )}
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-semibold whitespace-pre-line">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[600px]"
        >
          {/* ══ BASIC INFO ══════════════════════════════════════════════════ */}
          {activeTab === "basic" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaInfoCircle} title="Primary Details" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <InputField
                    label="Stay Name"
                    icon={FaHiking}
                    value={formData.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Enter official stay title"
                  />
                  <FieldError name="title" />
                </div>

                <div>
                  <InputField
                    label="Stay Duration (nights)"
                    icon={FaClock}
                    value={formData.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="E.g. 3 Nights / 4 Days"
                  />
                  <FieldError name="duration" />
                </div>

                <div>
                  <InputField
                    label="Target Group Size"
                    icon={FaUsers}
                    value={formData.groupSize}
                    onChange={(e) => set("groupSize", e.target.value)}
                    placeholder="E.g. 2-4 Guests"
                  />
                  <FieldError name="groupSize" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Registration Type
                  </label>
                  <CustomSelect
                    options={REGI_TYPES}
                    value={REGI_TYPES.find(
                      (s) => s.value === formData.reg_type,
                    )}
                    onChange={(val) => set("reg_type", val.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Stay Category
                  </label>
                  <CustomSelect
                    options={STATIC_CATEGORIES}
                    value={STATIC_CATEGORIES.find(
                      (c) => c.value === formData.category,
                    )}
                    onChange={(val) => set("category", val.value)}
                    placeholder="Select a category"
                  />
                  <FieldError name="category" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Booking Type
                  </label>
                  <CustomSelect
                    options={STATIC_BOOKING_TYPES}
                    value={
                      STATIC_BOOKING_TYPES.find(
                        (bt) => bt.value === formData.bookingType,
                      ) || null
                    }
                    onChange={(val) => set("bookingType", val.value)}
                    placeholder="Select a booking type"
                  />
                  <FieldError name="bookingType" />
                </div>
              </div>

              <NextBtn />
            </div>
          )}

          {/* ══ ADDRESS ═════════════════════════════════════════════════════ */}
          {activeTab === "address" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaMapMarkerAlt} title="Property Address" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <InputField
                    label="Address Line 1"
                    icon={FaBuilding}
                    value={formData.address.address1}
                    onChange={(e) => setAddress("address1", e.target.value)}
                    placeholder="Building name, flat/house no."
                  />
                  <FieldError name="address.address1" />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Address Line 2"
                    icon={FaBuilding}
                    value={formData.address.address2}
                    onChange={(e) => setAddress("address2", e.target.value)}
                    placeholder="Floor, wing, block (optional)"
                  />
                </div>

                <div>
                  <InputField
                    label="Street / Road"
                    icon={FaMap}
                    value={formData.address.street}
                    onChange={(e) => setAddress("street", e.target.value)}
                    placeholder="E.g. MG Road, Linking Road"
                  />
                </div>

                <div>
                  <InputField
                    label="Nearby Landmark / Location"
                    icon={FaMapMarkerAlt}
                    value={formData.address.nearbyLocation}
                    onChange={(e) =>
                      setAddress("nearbyLocation", e.target.value)
                    }
                    placeholder="E.g. Near XYZ Mall"
                  />
                </div>

                <div>
                  <InputField
                    label="City"
                    icon={FaBuilding}
                    value={formData.address.city}
                    onChange={(e) => setAddress("city", e.target.value)}
                    placeholder="E.g. Mumbai"
                  />
                </div>

                <div>
                  <InputField
                    label="District"
                    icon={FaMap}
                    value={formData.address.district}
                    onChange={(e) => setAddress("district", e.target.value)}
                    placeholder="E.g. Pune District"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    State
                  </label>
                  <CustomSelect
                    options={INDIAN_STATES}
                    value={
                      INDIAN_STATES.find(
                        (s) => s.value === formData.address.state,
                      ) || null
                    }
                    onChange={(val) => setAddress("state", val.value)}
                    placeholder="Select state"
                  />
                  <FieldError name="address.state" />
                </div>

                <div>
                  <InputField
                    label="Pincode"
                    icon={FaMap}
                    value={formData.address.pincode}
                    onChange={(e) => setAddress("pincode", e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  <FieldError name="address.pincode" />
                </div>

                <div>
                  <InputField
                    label="Country"
                    icon={FaMap}
                    value={formData.address.country}
                    onChange={(e) => setAddress("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <NextBtn />
            </div>
          )}

          {/* ══ SPECIFICATIONS ══════════════════════════════════════════════ */}
          {activeTab === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaChartBar} title="Stay Specifications" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <InputField
                    label="Check-in Time"
                    icon={FaClock}
                    value={formData.startTime}
                    onChange={(e) => set("startTime", e.target.value)}
                    placeholder="E.g. 02:00 PM"
                  />
                  <FieldError name="startTime" />
                </div>

                <div>
                  <InputField
                    label="Check-out Time"
                    icon={FaClock}
                    value={formData.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                    placeholder="E.g. 11:00 AM"
                  />
                  <FieldError name="endTime" />
                </div>

                <div className="md:col-span-2">
                  <TagsInput
                    label="Filter Tags"
                    value={formData.tags}
                    onChange={(tags) => set("tags", tags)}
                    placeholder="Type tag and press enter..."
                  />
                  <FieldError name="tags" />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Embedded Map URL"
                    icon={FaLink}
                    value={formData.mapUrl}
                    onChange={(e) => set("mapUrl", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <FieldError name="mapUrl" />
                </div>
              </div>

              <NextBtn />
            </div>
          )}

          {/* ══ CONTENT ═════════════════════════════════════════════════════ */}
          {activeTab === "logistics" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle
                icon={FaCalendarAlt}
                title="Descriptions & Availability"
              />

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Available Date Range
                  </label>
                  <CustomDatePicker
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onChange={(dates) =>
                      setFormData({
                        ...formData,
                        startDate: dates[0],
                        endDate: dates[1],
                      })
                    }
                  />
                  {(fieldErrors.startDate || fieldErrors.endDate) && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.startDate || fieldErrors.endDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Property Highlights (Brief Summary)
                  </label>
                  <RichTextEditor
                    value={formData.highlight}
                    onChange={(content) =>
                      setFormData({ ...formData, highlight: content })
                    }
                  />
                  {fieldErrors.highlight && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.highlight}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Property Description / Overview
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) => set("description", content)}
                  />
                  <FieldError name="description" />
                </div>
              </div>

              <NextBtn />
            </div>
          )}

          {/* ══ STAY PRICING ═════════════════════════════════════════════════════ */}
          {activeTab === "fees" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle
                icon={FaRupeeSign}
                title="Stay Commercial Configuration"
              />

              {/* 🔹 TOP INPUT STRIP */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { key: "nights", label: "Nights" },
                  { key: "guests", label: "Guests" },
                  { key: "rooms", label: "Rooms" },
                  { key: "extraGuests", label: "Extra Guests" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wide">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={formData[key] || 0}
                      onChange={(e) => set(key, Number(e.target.value))}
                      className="w-full mt-2 text-2xl font-black text-gray-800 outline-none bg-transparent"
                    />
                  </div>
                ))}
              </div> */}

              {/* 🔹 MAIN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 💰 FINAL PRICE CARD */}
                <div
                  className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 flex flex-col justify-center text-white relative overflow-hidden group cursor-pointer"
                  onClick={() => {
                    priceInputRef.current?.focus();
                    priceInputRef.current?.select();
                  }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:rotate-12 transition-transform">
                    <FaRupeeSign size={100} />
                  </div>

                  <label className="text-[10px] uppercase font-black text-blue-100 tracking-widest opacity-80">
                    Final Stay Price
                  </label>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-4xl font-black opacity-60">₹</span>
                    <input
                      ref={priceInputRef}
                      type="number"
                      value={formData.price}
                      onChange={(e) => set("price", Number(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      className="bg-transparent text-5xl font-black border-none outline-none w-full placeholder:text-blue-300"
                      placeholder="0"
                    />
                  </div>

                  {/* 🔥 Booking Summary */}
                  <div className="mt-6 text-xs text-blue-100 space-y-1">
                    <p>{formData.nights || 1} Nights</p>
                    <p>
                      {formData.guests || 1} Guests • {formData.rooms || 1}{" "}
                      Rooms
                    </p>
                  </div>
                </div>

                {/* 📦 FEE CARDS */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-6 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {
                      key: "basePrice",
                      label: "Base Price",
                      suffix: "(per night)",
                      amtKey: "amount",
                      prefix: "₹",
                    },
                    {
                      key: "pricingType",
                      label: "Pricing Type",
                      type: "select",
                      options: ["perRoom", "perPerson"],
                    },
                    {
                      key: "weekendCharge",
                      label: "Weekend Charge",
                      amtKey: "amount",
                      prefix: "₹",
                    },
                    {
                      key: "peakMultiplier",
                      label: "Peak Multiplier",
                      amtKey: "value",
                      prefix: "×",
                    },
                    {
                      key: "mealPrice",
                      label: "Meal Price",
                      amtKey: "amount",
                      prefix: "₹",
                    },
                    {
                      key: "extraBedPrice",
                      label: "Extra Bed",
                      amtKey: "amount",
                      prefix: "₹",
                    },
                    {
                      key: "discount",
                      label: "Discount",
                      suffix: "(%)",
                      amtKey: "value",
                      prefix: "%",
                    },
                    {
                      key: "gstPercent",
                      label: "GST",
                      suffix: "(%)",
                      amtKey: "value",
                      prefix: "%",
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="space-y-4">
                        {/* 🔹 TITLE */}
                        <p className="text-lg font-bold text-gray-800 border-b pb-2">
                          {field.label}
                          {field.suffix && (
                            <span className="text-sm text-gray-400 ml-1">
                              {field.suffix}
                            </span>
                          )}
                        </p>

                        {/* 🔹 INPUT / SELECT */}
                        {field.type === "select" ? (
                          <select
                            value={formData.feeDetails[field.key]?.value || ""}
                            onChange={(e) =>
                              updateFeeDetails({
                                ...formData.feeDetails,
                                [field.key]: {
                                  ...formData.feeDetails[field.key],
                                  value: e.target.value,
                                },
                              })
                            }
                            className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                            <span className="text-blue-600 font-black text-lg">
                              {field.prefix}
                            </span>
                            <input
                              type="number"
                              value={
                                formData.feeDetails[field.key]?.[
                                  field.amtKey
                                ] || 0
                              }
                              onChange={(e) =>
                                updateFeeDetails({
                                  ...formData.feeDetails,
                                  [field.key]: {
                                    ...formData.feeDetails[field.key],
                                    [field.amtKey]: Number(e.target.value),
                                  },
                                })
                              }
                              onFocus={(e) => e.target.select()}
                              className="w-full bg-transparent outline-none font-bold text-gray-800 text-lg"
                              placeholder="0"
                            />
                          </div>
                        )}

                        {/* 🔹 DESCRIPTION */}
                        <textarea
                          value={
                            formData.feeDetails[field.key]?.description || ""
                          }
                          onChange={(e) =>
                            updateFeeDetails({
                              ...formData.feeDetails,
                              [field.key]: {
                                ...formData.feeDetails[field.key],
                                description: e.target.value,
                              },
                            })
                          }
                          rows={2}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          placeholder={`Short description...`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADD-ONS */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add-on Services
                    </h3>
                    <p className="text-sm text-gray-500">
                      Optional services like meals, bonfire, pickup, etc.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("addons", {
                        name: "",
                        price: 0,
                        description: "",
                        type: "flat",
                      })
                    }
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                  >
                    <FaPlus size={14} />
                    Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.addons.map((addon, index) => (
                    <div
                      key={index}
                      className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => removeArrayItem("addons", index)}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="space-y-4">
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "name",
                              e.target.value,
                              "addons",
                            )
                          }
                          className="w-full text-lg font-bold text-gray-800 outline-none border-b border-gray-200 focus:border-blue-500 transition-colors"
                          placeholder="Service name"
                        />

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            <span className="text-blue-600 font-black">₹</span>
                            <input
                              type="number"
                              value={addon.price}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "price",
                                  Number(e.target.value),
                                  "addons",
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              className="w-full bg-transparent outline-none font-bold text-gray-700"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <textarea
                          value={addon.description}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "description",
                              e.target.value,
                              "addons",
                            )
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[90px]"
                          placeholder="Short description of this service..."
                        />
                        <select
                          value={addon.type}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "type",
                              e.target.value,
                              "addons",
                            )
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="flat">Flat Price</option>
                          <option value="perPerson">Per Person</option>
                          <option value="perNight">Per Night</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {formData.addons.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 space-y-3">
                      <FaHiking className="mx-auto text-5xl opacity-30" />
                      <p className="font-bold">No add-on services added</p>
                      <p className="text-sm">
                        Click "Add Service" to create optional offerings
                      </p>
                    </div>
                  )}
                </div>

                {fieldErrors.addons && (
                  <p className="text-red-500 text-sm mt-4">
                    {fieldErrors.addons}
                  </p>
                )}
              </div>

              <NextBtn />
            </div>
          )}

          {/* ══ MEDIA ═══════════════════════════════════════════════════════ */}
          {activeTab === "media" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaImage} title="Media Assets Management" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <ImageUploader
                    label="Hero Representation"
                    value={formData.image}
                    onChange={(img) => set("image", img)}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    This will be the primary display image
                  </p>
                  <FieldError name="image" />
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <ImageUploader
                    label="Property Gallery"
                    isMultiple
                    maxFiles={10}
                    value={formData.gallery}
                    onChange={(imgs) => set("gallery", imgs)}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Up to 10 images showing the stay experience
                  </p>
                  <FieldError name="gallery" />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
