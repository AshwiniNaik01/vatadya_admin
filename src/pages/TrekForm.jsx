import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";

import {
  FaImage,
  FaInfoCircle,
  FaRupeeSign,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaChartBar,
  FaFileAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaHiking,
} from "react-icons/fa";

// UI Components
import InputField from "../components/form/InputField";
import Checkbox from "../components/form/Checkbox";
import RadioButton from "../components/form/RadioButton";
import TagsInput from "../components/form/TagsInput";
import ImageUploader from "../components/form/ImageUploader";
import CustomSelect from "../components/form/CustomSelect";
import CustomDatePicker from "../components/form/CustomDatePicker";
import RichTextEditor from "../components/form/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { createTrek, getTrekById, updateTrek } from "../api/trekApi";
import { FaChevronRight } from "react-icons/fa";
import { getAllCategories } from "../api/trekCategoriesApi";
import { getAllBookingTypes } from "../api/bookingType";

// Yup Validation Schema
const trekValidationSchema = Yup.object().shape({});

export default function TrekForm() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    difficulty: "Moderate",
    category: null,
    duration: "",
    groupSize: "",
    price: 0,
    discount: 0,
    discountDescription: "",
    featured: false,
    isActive: true,
    season: "",
    altitude: "",
    tags: [],
    highlight: "",
    bestFor: "",
    description: "",
    status: "Upcoming",
    bookingType: "",
    startDate: null,
    endDate: null,
    feeDetails: {
      baseFee: { amount: 0, description: "" },
      discount: { value: 0, description: "" }, // % discount
      gstPercent: { value: 5, description: "" },
      insurance: { amount: 180, description: "" },
      transport: { amount: 0, description: "" },
    },
    links: {
      inclusions: "",
      terms: "",
      cancellation: "",
      scholarships: "",
    },
    proTrekkerBenefit: "",
    govtEligibility: "",
    trekInfo: [
      { title: "TREK DIFFICULTY", value: "" },
      { title: "TREK DURATION", value: "" },
      { title: "HIGHEST ALTITUDE", value: "" },
      { title: "SUITABLE FOR", value: [""] },
    ],
    addons: [],
    months: [],
    reviewsData: [],
    image: null,
    gallery: [],
    inclusions: [],
    exclusions: [],
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [bookingTypes, setBookingTypes] = useState([]);

  const navigate = useNavigate();
  const priceInputRef = useRef(null);
  const { id } = useParams();
  const isEditMode = !!id;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(
          data.map((cat) => ({ value: cat._id, label: cat.title })),
        );
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch booking types dynamically
  useEffect(() => {
    const fetchBookingTypes = async () => {
      try {
        const res = await getAllBookingTypes();
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setBookingTypes(
          list
            .filter((bt) => bt.isActive)
            .map((bt) => ({ value: bt._id, label: bt.name })),
        );
      } catch (err) {
        console.error("Failed to fetch booking types:", err);
      }
    };
    fetchBookingTypes();
  }, []);

  // Fetch trek details in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchTrekDetails = async () => {
        try {
          setLoading(true);
          const trekData = await getTrekById(id);

          const categoryId = trekData.category?._id || trekData.category;

          const monthsList = Array.isArray(trekData.months)
            ? trekData.months.map((m) => (typeof m === "object" ? m.month : m))
            : [];

          setFormData((prev) => ({
            ...prev,
            ...trekData,
            category: categoryId,
            months: monthsList,
            feeDetails: { ...prev.feeDetails, ...(trekData.feeDetails || {}) },
            links: { ...prev.links, ...(trekData.links || {}) },
            trekInfo: (() => {
              const raw = trekData.trekInfo;
              if (!raw || raw.length === 0) return prev.trekInfo;
              // ✅ Normalize on load — move value:[] into values:[]
              return raw.map((info) => {
                const isMulti = multiValueTitles.includes(info.title);
                if (isMulti) {
                  return {
                    title: info.title,
                    values: info.values?.length
                      ? info.values
                      : Array.isArray(info.value)
                        ? info.value
                        : [""],
                  };
                }
                return {
                  title: info.title,
                  value: typeof info.value === "string" ? info.value : "",
                };
              });
            })(),
            startDate: trekData.startDate ? new Date(trekData.startDate) : null,
            endDate: trekData.endDate ? new Date(trekData.endDate) : null,
            image: trekData.image?.cdnUrl || trekData.image || null,
            gallery: trekData.gallery?.map((img) => img.cdnUrl || img) || [],
          }));
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch trek details:", err);
          setErrorMessage("Failed to load trek details for editing.");
          setLoading(false);
        }
      };
      fetchTrekDetails();
    }
  }, [id, isEditMode]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaInfoCircle },
    { id: "details", label: "Specifications", icon: FaChartBar },
    { id: "logistics", label: "Content", icon: FaCalendarAlt },
    { id: "fees", label: "Pricing", icon: FaRupeeSign },
    { id: "media", label: "Media", icon: FaImage },
  ];

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const getFieldsForTab = (tabId) => {
    const fieldMap = {
      basic: [
        "title",
        "location",
        "duration",
        "groupSize",
        "status",
        "category",
        "bookingType",
        "difficulty",
      ],
      details: ["altitude", "season", "tags", "trekInfo"],
      logistics: ["startDate", "endDate", "highlight", "description", "months"],
      fees: ["price", "discount", "feeDetails", "links"],
      media: ["image", "gallery", "addons"],
    };
    return fieldMap[tabId] || [];
  };

  const handleNextTab = async () => {
    const currentTabFields = getFieldsForTab(activeTab);

    try {
      const partialSchema = trekValidationSchema.pick(currentTabFields);
      await partialSchema.validate(formData, { abortEarly: false });

      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((e) => (errors[e.path] = e.message));
        setFieldErrors(errors);
        alert("Please fix the errors before proceeding.");
      }
    }
  };

  const difficulties = ["Easy", "Moderate", "Difficult"];

  const statuses = [
    { value: "Upcoming", label: "Upcoming" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Completed", label: "Completed" },
  ];

  const trekInfoTitles = [
    "TREK DIFFICULTY",
    "TREK DURATION",
    "HIGHEST ALTITUDE",
    "SUITABLE FOR",
    "BASECAMP",
    "ACCOMMODATION",
    "FITNESS CRITERIA",
    "PICKUP",
    "DROPOFF",
    "GEAR RENTAL",
  ];

  const multiValueTitles = [
    "SUITABLE FOR",
    "ACCOMMODATION",
    "PICKUP",
    "DROPOFF",
  ];

  // const handleArrayChange = (index, field, value, section) => {
  //   const updated = [...formData[section]];
  //   updated[index][field] = value;
  //   const newData = { ...formData, [section]: updated };
  //   setFormData({ ...newData, price: calculateFinalFee(newData) });
  // };

  const handleArrayChange = (index, field, value, section) => {
    const updated = [...formData[section]];

    if (section === "trekInfo" && field === "title") {
      const isMulti = multiValueTitles.includes(value);
      updated[index] = {
        title: value,
        ...(isMulti ? { values: [""] } : { value: "" }),
      };
    } else {
      updated[index][field] = value;
    }

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();

      const exclude = [
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "id",
        "reviewsData",
        "rating",
        "reviews",
        "slots",
        "image",
        "gallery",
      ];

      Object.keys(formData).forEach((key) => {
        if (exclude.includes(key)) return;

        const value = formData[key];

        if (key === "trekInfo") {
          // ✅ Normalize before sending — fix values/value mismatch
          const normalizedTrekInfo = formData.trekInfo.map((info) => {
            const isMulti = multiValueTitles.includes(info.title);
            if (isMulti) {
              return {
                title: info.title,
                values:
                  info.values?.filter((v) => v !== "") ||
                  (Array.isArray(info.value)
                    ? info.value.filter((v) => v !== "")
                    : []),
              };
            }
            return {
              title: info.title,
              value: info.value ?? "",
            };
          });
          formDataToSend.append("trekInfo", JSON.stringify(normalizedTrekInfo));
        } else if (
          key === "addons" ||
          key === "feeDetails" ||
          key === "links"
        ) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // 🔥 Handle availableMonths (NOT months)
          if (key === "availableMonths") {
            const hasAll = value.some((m) => m?.trim().toLowerCase() === "all");

            const ALL_MONTHS = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            const finalMonths = hasAll ? ALL_MONTHS : value;

            formDataToSend.append(key, JSON.stringify(finalMonths));
          } else {
            formDataToSend.append(key, JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Hero Image
      if (formData.image instanceof File) {
        formDataToSend.append("TrekImage", formData.image);
      } else if (typeof formData.image === "string" && formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Gallery
      if (Array.isArray(formData.gallery)) {
        formData.gallery.forEach((item) => {
          if (item instanceof File) {
            formDataToSend.append("TrekGallery", item);
          } else if (typeof item === "string" && item) {
            formDataToSend.append("gallery", item);
          }
        });
      }

      console.log("📦 TrekForm FormData fields being sent:");
      const debugFields = [];
      for (let [key, val] of formDataToSend.entries()) {
        debugFields.push(key);
        if (val instanceof File) {
          console.log(
            `  [FILE] ${key}: name="${val.name}", size=${val.size}b, type="${val.type}"`,
          );
        } else {
          console.log(`  [TEXT] ${key}: "${val}"`);
        }
      }
      console.log("📤 All field names:", debugFields);

      if (isEditMode) {
        await updateTrek(id, formDataToSend);
        alert("Trek updated successfully!");
      } else {
        await createTrek(formDataToSend);
        alert("Trek created successfully!");
      }
      navigate("/treks/manage");
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setFieldErrors(errors);

        const errorMessages = err.inner
          .map((error) => `${error.path}: ${error.message}`)
          .join("\n");
        setErrorMessage(errorMessages);
        alert(`Validation failed:\n\n${errorMessages}`);
      } else {
        console.error("Submission error:", err);
        const apiMsg =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while saving the trek.";
        setErrorMessage(apiMsg);
        alert(`Failed to save trek: ${apiMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b pb-2">
      <Icon className="text-blue-600 text-xl" />
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );

  const calculateFinalFee = (doc) => {
    const feeDetails = doc.feeDetails || {};

    const getVal = (field, key) => {
      if (field === undefined || field === null) return null;
      if (typeof field === "object" && field !== null) {
        const val =
          field[key] !== undefined && field[key] !== null
            ? Number(field[key])
            : null;
        return val;
      }
      return Number(field);
    };

    const base = getVal(feeDetails.baseFee, "amount") ?? 0;
    const discountPercent = getVal(feeDetails.discount, "value") ?? 0;
    const discountAmount = (base * discountPercent) / 100;
    const baseAfterDiscount = base - discountAmount;

    const gstPercent = getVal(feeDetails.gstPercent, "value") ?? 0;
    const gst = (baseAfterDiscount * gstPercent) / 100;
    const insurance = getVal(feeDetails.insurance, "amount") ?? 0;
    const transport = getVal(feeDetails.transport, "amount") ?? 0;

    const addonsTotal = (doc.addons || []).reduce(
      (sum, addon) => sum + Number(addon.price || 0),
      0,
    );

    // ROUND TO NEAREST INTEGER
    return Math.round(
      baseAfterDiscount + gst + insurance + transport + addonsTotal,
    );
  };

  // Helper to update feeDetails and recalculate price atomically
  const updateFeeDetails = (updatedFeeDetails) => {
    const updated = { ...formData, feeDetails: updatedFeeDetails };
    setFormData({ ...updated, price: calculateFinalFee(updated) });
  };

  const handleTrekInfoValueChange = (infoIndex, valueIndex, newVal) => {
    const updated = [...formData.trekInfo];
    updated[infoIndex].values[valueIndex] = newVal;
    setFormData({ ...formData, trekInfo: updated });
  };

  const addTrekInfoValue = (infoIndex) => {
    const updated = [...formData.trekInfo];
    updated[infoIndex].values = [...(updated[infoIndex].values || [""]), ""];
    setFormData({ ...formData, trekInfo: updated });
  };

  const removeTrekInfoValue = (infoIndex, valueIndex) => {
    const updated = [...formData.trekInfo];
    updated[infoIndex].values.splice(valueIndex, 1);
    setFormData({ ...formData, trekInfo: updated });
  };

  const ALL_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isEditMode ? "Update Trek" : "Create New Trek"}
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/treks/manage")}
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
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{isEditMode ? "Update Details" : "Verify & Save Trek"}</>
              )}
            </button>
          </div>
        </header>

        {/* Error Message Display */}
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all
                ${
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
          {/* --- BASIC INFO --- */}
          {activeTab === "basic" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaInfoCircle} title="Primary Details" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <InputField
                    label="Trek Name"
                    icon={FaHiking}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter official trek title"
                  />
                  {fieldErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label="Trek Location"
                    icon={FaMapMarkerAlt}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Region, State (e.g. Ladakh, India)"
                  />
                  {fieldErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label="Trek Duration (days)"
                    icon={FaClock}
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="E.g. 10 Days / 9 Nights"
                  />
                  {fieldErrors.duration && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label="Target Group Size"
                    icon={FaUsers}
                    value={formData.groupSize}
                    onChange={(e) =>
                      setFormData({ ...formData, groupSize: e.target.value })
                    }
                    placeholder="E.g. 12-15 Base Campers"
                  />
                  {fieldErrors.groupSize && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.groupSize}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Registration Status
                  </label>
                  <CustomSelect
                    options={statuses}
                    value={statuses.find((s) => s.value === formData.status)}
                    onChange={(val) =>
                      setFormData({ ...formData, status: val.value })
                    }
                  />
                  {fieldErrors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.status}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Trek Category
                  </label>
                  <CustomSelect
                    options={categories}
                    value={categories.find(
                      (c) => c.value === formData.category,
                    )}
                    onChange={(val) =>
                      setFormData({ ...formData, category: val.value })
                    }
                    placeholder="Select a category"
                  />
                  {fieldErrors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.category}
                    </p>
                  )}
                </div>

                {/* ── Booking Type — dynamic from API ── */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Booking Type
                  </label>
                  <CustomSelect
                    options={bookingTypes}
                    value={
                      bookingTypes.find(
                        (bt) => bt.value === formData.bookingType,
                      ) || null
                    }
                    onChange={(val) =>
                      setFormData({ ...formData, bookingType: val.value })
                    }
                    placeholder={
                      bookingTypes.length === 0
                        ? "Loading booking types..."
                        : "Select a booking type"
                    }
                    isDisabled={bookingTypes.length === 0}
                  />
                  {fieldErrors.bookingType && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.bookingType}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-bold text-gray-700 ml-1">
                    Complexity Level
                  </label>
                  <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {difficulties.map((level) => (
                      <RadioButton
                        key={level}
                        id={`diff-${level}`}
                        name="difficulty"
                        label={level}
                        value={level}
                        checked={formData.difficulty === level}
                        onChange={(val) =>
                          setFormData({ ...formData, difficulty: val })
                        }
                      />
                    ))}
                  </div>
                  {fieldErrors.difficulty && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.difficulty}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Next Step <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* --- SPECIFICATIONS --- */}
          {activeTab === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaChartBar} title="Technical Data" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <InputField
                    label="Peak Altitude"
                    value={formData.altitude}
                    onChange={(e) =>
                      setFormData({ ...formData, altitude: e.target.value })
                    }
                    placeholder="E.g. 5,364m / 17,598ft"
                  />
                  {fieldErrors.altitude && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.altitude}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label="Recommended Season"
                    value={formData.season}
                    onChange={(e) =>
                      setFormData({ ...formData, season: e.target.value })
                    }
                    placeholder="E.g. June to September"
                  />
                  {fieldErrors.season && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.season}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <TagsInput
                    label="Filter Tags"
                    value={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                    placeholder="Type tag and press enter..."
                  />
                  {fieldErrors.tags && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.tags}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                      Trek Parameter Mapping
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("trekInfo", {
                          title: "TREK DIFFICULTY",
                          value: "",
                        })
                      }
                      className="flex items-center gap-1.5 text-xs font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FaPlus /> Add Parameter
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.trekInfo.map((info, index) => {
                      const isMulti = multiValueTitles.includes(info.title);

                      return (
                        <div
                          key={index}
                          className="group relative bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Title select + delete card button */}
                          <div className="flex items-center justify-between mb-3">
                            <select
                              value={info.title}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "title",
                                  e.target.value,
                                  "trekInfo",
                                )
                              }
                              className="flex-1 text-sm font-black text-blue-600 bg-transparent border-none outline-none focus:ring-0"
                            >
                              {trekInfoTitles.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("trekInfo", index)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-2"
                            >
                              <FaTrash size={13} />
                            </button>
                          </div>

                          {/* Single value */}
                          {!isMulti && (
                            <input
                              type="text"
                              value={info.value ?? ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "value",
                                  e.target.value,
                                  "trekInfo",
                                )
                              }
                              className="w-full bg-gray-50 border-none rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
                              placeholder="Data value..."
                            />
                          )}

                          {/* Multi value */}
                          {isMulti && (
                            <div className="space-y-2">
                              {(info.values?.length ? info.values : [""]).map(
                                (val, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={val}
                                      onChange={(e) =>
                                        handleTrekInfoValueChange(
                                          index,
                                          vIdx,
                                          e.target.value,
                                        )
                                      }
                                      className="flex-1 bg-gray-50 border-none rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
                                      placeholder={`Value ${vIdx + 1}...`}
                                    />
                                    {(info.values?.length ?? 1) > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeTrekInfoValue(index, vIdx)
                                        }
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                                      >
                                        <FaTrash size={11} />
                                      </button>
                                    )}
                                  </div>
                                ),
                              )}
                              <button
                                type="button"
                                onClick={() => addTrekInfoValue(index)}
                                className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                <FaPlus size={9} /> Add Value
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {fieldErrors.trekInfo && (
                    <p className="text-red-500 text-sm mt-2">
                      {fieldErrors.trekInfo}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Next Step <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* --- CONTENT --- */}
          {activeTab === "logistics" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle
                icon={FaCalendarAlt}
                title="Descriptions & Planning"
              />

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Trek Date Range
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
                    Trek Highlights (Brief Summary)
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
                    Full Story / Itinerary Overview
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) =>
                      setFormData({ ...formData, description: content })
                    }
                  />
                  {fieldErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                <div className="">
                  <InputField
                    label="Target Audience (Best For)"
                    value={formData.bestFor}
                    onChange={(e) =>
                      setFormData({ ...formData, bestFor: e.target.value })
                    }
                    placeholder="E.g. Weekend Warriors, Pro Solos"
                  />

                  <div className="md:col-span-2 mt-6">
                    <TagsInput
                      label="Available Months"
                      value={formData.availableMonths}
                      onChange={(months) =>
                        setFormData({ ...formData, availableMonths: months })
                      }
                      placeholder="Type month and press enter..."
                    />
                    {fieldErrors.months && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.months}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Inclusions & Exclusions */}
              <div className="mt-8">
                <h3 className="text-lg font-black text-gray-800 mb-1">
                  Inclusions &amp; Exclusions
                </h3>
                <p className="text-sm text-gray-400 mb-5">
                  Define what's covered and what's not for this trek
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      key: "inclusions",
                      label: "Included in trek",
                      cls: "blue",
                      placeholder: "E.g. Tents, guide fees, meals...",
                      icon: (
                        <svg
                          className="w-3.5 h-3.5 stroke-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ),
                      iconBg: "bg-blue-100",
                      badgeBg: "bg-blue-100 text-blue-700",
                      headBg: "from-blue-50 to-white",
                      border: "border-blue-100 hover:border-blue-200",
                      addBtn: "bg-blue-600 hover:bg-blue-700 text-white",
                      numBg: "bg-blue-100 text-blue-700",
                      inputFocus:
                        "focus:border-blue-400 focus:ring-blue-400/20",
                      dot: "bg-blue-500",
                    },
                    {
                      key: "exclusions",
                      label: "Not included",
                      cls: "red",
                      placeholder: "E.g. Flights, insurance, gear...",
                      icon: (
                        <svg
                          className="w-3.5 h-3.5 stroke-red-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      ),
                      iconBg: "bg-red-100",
                      badgeBg: "bg-red-100 text-red-600",
                      headBg: "from-red-50 to-white",
                      border: "border-blue-100 hover:border-blue-200",
                      addBtn: "bg-red-500 hover:bg-red-600 text-white",
                      numBg: "bg-red-100 text-red-600",
                      inputFocus: "focus:border-red-400 focus:ring-red-400/20",
                      dot: "bg-red-400",
                    },
                  ].map(
                    ({
                      key,
                      label,
                      placeholder,
                      icon,
                      iconBg,
                      badgeBg,
                      headBg,
                      border,
                      addBtn,
                      numBg,
                      inputFocus,
                      dot,
                    }) => (
                      <div
                        key={key}
                        className={`bg-white rounded-2xl border-[1.5px] overflow-hidden transition-all ${border}`}
                      >
                        {/* Card Header */}
                        <div
                          className={`bg-gradient-to-br ${headBg} px-5 py-4 border-b border-blue-50
                         flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}
                            >
                              {icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-700 leading-none">
                                {label}
                              </p>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeBg}`}
                              >
                                {formData[key].length} item
                                {formData[key].length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]: [...prev[key], ""],
                              }))
                            }
                            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2
                         rounded-xl transition-all active:scale-95 ${addBtn}`}
                          >
                            <FaPlus size={9} /> Add item
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-5">
                          {formData[key].length === 0 ? (
                            <div className="py-6 text-center text-gray-300 text-sm font-medium">
                              No items yet — click "Add item" to begin
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {formData[key].map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5"
                                >
                                  <span
                                    className={`w-[22px] h-[22px] rounded-[7px] flex items-center
                                    justify-center text-[10px] font-bold flex-shrink-0 ${numBg}`}
                                  >
                                    {idx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                      const updated = [...formData[key]];
                                      updated[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        [key]: updated,
                                      });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setFormData((prev) => ({
                                          ...prev,
                                          [key]: [...prev[key], ""],
                                        }));
                                      }
                                    }}
                                    className={`flex-1 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl
                                text-sm font-medium text-gray-700 px-3 py-2 outline-none
                                focus:ring-[3px] transition-all ${inputFocus}`}
                                    placeholder={placeholder}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData[key]];
                                      updated.splice(idx, 1);
                                      setFormData({
                                        ...formData,
                                        [key]: updated,
                                      });
                                    }}
                                    className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center
                               text-gray-300 hover:text-red-400 hover:bg-red-50
                               transition-all flex-shrink-0"
                                  >
                                    <FaTrash size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Footer summary */}
                <div
                  className="mt-4 px-5 py-3.5 bg-white rounded-2xl border-[1.5px] border-blue-100
                  flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-semibold text-gray-600">
                        {formData.inclusions.length} included
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-xs font-semibold text-gray-600">
                        {formData.exclusions.length} excluded
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-300 font-medium">
                    Press Enter to add a new item
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Next Step <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* --- PRICING --- */}
          {activeTab === "fees" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle
                icon={FaRupeeSign}
                title="Commercial Configuration"
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div
                  className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 flex flex-col justify-center text-white relative overflow-hidden group cursor-pointer"
                  onClick={() => {
                    priceInputRef.current?.focus();
                    priceInputRef.current?.select();
                  }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform group-hover:rotate-12 transition-transform">
                    <FaRupeeSign size={100} />
                  </div>

                  <label className="block mb-2 text-[10px] uppercase font-black text-blue-100 tracking-widest opacity-80">
                    Base Platform Fee
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black opacity-60">₹</span>
                    <input
                      ref={priceInputRef}
                      type="number"
                      value={formData.price}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      onFocus={(e) => e.target.select()}
                      className="bg-transparent text-5xl font-black border-none outline-none w-full focus:ring-0 placeholder:text-blue-400/50 cursor-pointer"
                      placeholder="0.00"
                    />
                  </div>

                  {fieldErrors.price && (
                    <p className="text-red-200 text-sm mt-2">
                      {fieldErrors.price}
                    </p>
                  )}
                </div>

                {/* <div className="lg:col-span-2 grid grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                  <div>
                    <InputField
                      label="Base Fee (Excl. GST)"
                      type="number"
                      value={formData.feeDetails.baseFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          feeDetails: {
                            ...formData.feeDetails,
                            baseFee: Number(e.target.value),
                          },
                        })
                      }
                    />
                    {fieldErrors["feeDetails.baseFee"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["feeDetails.baseFee"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Discount Amount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: Number(e.target.value),
                        })
                      }
                      placeholder="₹ 0"
                    />
                    {fieldErrors.discount && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.discount}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Insurance Cost"
                      type="number"
                      value={formData.feeDetails.insurance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          feeDetails: {
                            ...formData.feeDetails,
                            insurance: Number(e.target.value),
                          },
                        })
                      }
                    />
                    {fieldErrors["feeDetails.insurance"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["feeDetails.insurance"]}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <InputField
                      label="Expedition Transport"
                      type="number"
                      value={formData.feeDetails.transport}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          feeDetails: {
                            ...formData.feeDetails,
                            transport: Number(e.target.value),
                          },
                        })
                      }
                    />
                    {fieldErrors["feeDetails.transport"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["feeDetails.transport"]}
                      </p>
                    )}
                  </div> */}
                {/* <div className="col-span-1">
                  <InputField
                    label="GST %"
                    type="number"
                    value={formData.feeDetails.gstPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        feeDetails: {
                          ...formData.feeDetails,
                          gstPercent: Number(e.target.value),
                        },
                      })
                    }
                  />
                  {fieldErrors["feeDetails.gstPercent"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors["feeDetails.gstPercent"]}
                    </p>
                  )}
                </div> */}
                {/* </div> */}

                <div className="lg:col-span-2 grid grid-cols-2 gap-6 max-h-135 overflow-y-auto pr-2 custom-scrollbar">
                  {/* Base Fee Card */}
                  <div className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        Base Fee{" "}
                        <span className="text-sm font-normal text-gray-400">
                          (Excl. GST)
                        </span>
                      </p>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="text-blue-600 font-black">₹</span>
                        <input
                          type="number"
                          value={formData.feeDetails.baseFee.amount}
                          onChange={(e) =>
                            updateFeeDetails({
                              ...formData.feeDetails,
                              baseFee: {
                                ...formData.feeDetails.baseFee,
                                amount: Number(e.target.value),
                              },
                            })
                          }
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent outline-none font-bold text-gray-700"
                          placeholder="0"
                        />
                      </div>
                      <textarea
                        value={formData.feeDetails.baseFee.description}
                        onChange={(e) =>
                          updateFeeDetails({
                            ...formData.feeDetails,
                            baseFee: {
                              ...formData.feeDetails.baseFee,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        placeholder="Short description of the base fee..."
                      />
                    </div>
                  </div>

                  {/* Discount Card */}
                  <div className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        Discount{" "}
                        <span className="text-sm font-normal text-gray-400">
                          (%)
                        </span>
                      </p>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="text-blue-600 font-black">%</span>
                        <input
                          type="number"
                          value={formData.feeDetails.discount.value}
                          onChange={(e) =>
                            updateFeeDetails({
                              ...formData.feeDetails,
                              discount: {
                                ...formData.feeDetails.discount,
                                value: Number(e.target.value),
                              },
                            })
                          }
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent outline-none font-bold text-gray-700"
                          placeholder="0"
                        />
                      </div>
                      <textarea
                        value={formData.feeDetails.discount.description}
                        onChange={(e) =>
                          updateFeeDetails({
                            ...formData.feeDetails,
                            discount: {
                              ...formData.feeDetails.discount,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        placeholder="Short description of the discount..."
                      />
                    </div>
                  </div>

                  {/* Insurance Card */}
                  <div className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        Insurance Cost
                      </p>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="text-blue-600 font-black">₹</span>
                        <input
                          type="number"
                          value={formData.feeDetails.insurance.amount}
                          onChange={(e) =>
                            updateFeeDetails({
                              ...formData.feeDetails,
                              insurance: {
                                ...formData.feeDetails.insurance,
                                amount: Number(e.target.value),
                              },
                            })
                          }
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent outline-none font-bold text-gray-700"
                          placeholder="0"
                        />
                      </div>
                      <textarea
                        value={formData.feeDetails.insurance.description}
                        onChange={(e) =>
                          updateFeeDetails({
                            ...formData.feeDetails,
                            insurance: {
                              ...formData.feeDetails.insurance,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        placeholder="Short description of the insurance cost..."
                      />
                    </div>
                  </div>

                  {/* GST Card */}
                  <div className="relative group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        GST
                      </p>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="text-blue-600 font-black">%</span>
                        <input
                          type="number"
                          value={formData.feeDetails.gstPercent.value}
                          onChange={(e) =>
                            updateFeeDetails({
                              ...formData.feeDetails,
                              gstPercent: {
                                ...formData.feeDetails.gstPercent,
                                value: Number(e.target.value),
                              },
                            })
                          }
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent outline-none font-bold text-gray-700"
                          placeholder="0"
                        />
                      </div>
                      <textarea
                        value={formData.feeDetails.gstPercent.description}
                        onChange={(e) =>
                          updateFeeDetails({
                            ...formData.feeDetails,
                            gstPercent: {
                              ...formData.feeDetails.gstPercent,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        placeholder="Short description of the GST..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Endpoints */}
              {/* <div className="mt-12 space-y-6">
                <SectionTitle icon={FaFileAlt} title="Resource Endpoints" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputField
                      label="Inclusions PDF"
                      value={formData.links.inclusions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            inclusions: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.inclusions"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.inclusions"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Terms & Conditions"
                      value={formData.links.terms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, terms: e.target.value },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.terms"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.terms"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Cancellation Policy"
                      value={formData.links.cancellation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            cancellation: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.cancellation"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.cancellation"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Scholarship Details"
                      value={formData.links.scholarships}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            scholarships: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.scholarships"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.scholarships"]}
                      </p>
                    )}
                  </div>
                </div>
              </div> */}

              {/* ADD-ONS */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add-on Services
                    </h3>
                    <p className="text-sm text-gray-500">
                      Optional gear, porter, or premium services
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("addons", {
                        name: "",
                        price: 0,
                        description: "",
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

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Next Step <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* --- MEDIA --- */}
          {activeTab === "media" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle icon={FaImage} title="Media Assets Management" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <ImageUploader
                    label="Hero Representation"
                    value={formData.image}
                    onChange={(img) => setFormData({ ...formData, image: img })}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    This will be the primary display image
                  </p>
                  {fieldErrors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.image}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <ImageUploader
                    label="Expedition Gallery"
                    isMultiple
                    maxFiles={10}
                    value={formData.gallery}
                    onChange={(imgs) =>
                      setFormData({ ...formData, gallery: imgs })
                    }
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Up to 10 images showing the trek experience
                  </p>
                  {fieldErrors.gallery && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.gallery}
                    </p>
                  )}
                </div>
              </div>

              {/* ADD-ONS
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add-on Services
                    </h3>
                    <p className="text-sm text-gray-500">
                      Optional gear, porter, or premium services
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("addons", {
                        name: "",
                        price: 0,
                        description: "",
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
              </div> */}

              {/* Resource Endpoints */}
              <div className="mt-12 space-y-6">
                <SectionTitle icon={FaFileAlt} title="Resource Endpoints" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputField
                      label="Inclusions PDF"
                      value={formData.links.inclusions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            inclusions: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.inclusions"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.inclusions"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Terms & Conditions"
                      value={formData.links.terms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, terms: e.target.value },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.terms"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.terms"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Cancellation Policy"
                      value={formData.links.cancellation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            cancellation: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.cancellation"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.cancellation"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Scholarship Details"
                      value={formData.links.scholarships}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: {
                            ...formData.links,
                            scholarships: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                    {fieldErrors["links.scholarships"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors["links.scholarships"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
