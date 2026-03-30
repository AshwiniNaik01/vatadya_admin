import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaEye,
  FaCog,
  FaThumbsUp,
  FaShieldAlt,
  FaQuestionCircle,
  FaStar,
  FaTh,
  FaDownload,
  FaTimes,
  FaCheck,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

import HeroForm from "../components/user-insights/HeroForm";
import MissionVisionForm from "../components/user-insights/MissionVisionForm";
import HowItWorksForm from "../components/user-insights/HowItWorksForm";
import WhyChooseUsForm from "../components/user-insights/WhyChooseUsForm";
import SafetyStandardsForm from "../components/user-insights/SafetyStandardsForm";
import FaqForm from "../components/user-insights/FaqForm";
import FeaturesForm from "../components/user-insights/FeaturesForm";
import FooterForm from "../components/user-insights/FooterForm";

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "hero", label: "Hero", Icon: FaHome },
  { key: "missionVision", label: "Mission & Vision", Icon: FaEye },
  { key: "howItWorks", label: "How It Works", Icon: FaCog },
  { key: "whyChooseUs", label: "Why Choose Us", Icon: FaThumbsUp },
  { key: "safetyStandards", label: "Safety Standards", Icon: FaShieldAlt },
  { key: "faq", label: "FAQ", Icon: FaQuestionCircle },
  { key: "features", label: "Features", Icon: FaStar },
  { key: "footer", label: "Footer", Icon: FaTh },
];

const SECTION_META = {
  hero: {
    label: "Hero",
    sub: "Configure the main hero banner content",
    Icon: FaHome,
  },
  missionVision: {
    label: "Mission & Vision",
    sub: "Define your mission values and key stats",
    Icon: FaEye,
  },
  howItWorks: {
    label: "How It Works",
    sub: "Explain your process step by step",
    Icon: FaCog,
  },
  whyChooseUs: {
    label: "Why Choose Us",
    sub: "Highlight your key differentiators",
    Icon: FaThumbsUp,
  },
  safetyStandards: {
    label: "Safety Standards",
    sub: "Showcase your safety commitments",
    Icon: FaShieldAlt,
  },
  faq: {
    label: "FAQ",
    sub: "Manage frequently asked questions",
    Icon: FaQuestionCircle,
  },
  features: {
    label: "Features",
    sub: "List your product features and metrics",
    Icon: FaStar,
  },
  footer: {
    label: "Footer",
    sub: "Edit footer content and links",
    Icon: FaTh,
  },
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initData = () => ({
  hero: {
    title: "",
    description: "",
    image: "",
    peaksClimbed: "",
    totalDistance: "",
    avgAltitude: "",
    trekTime: "",
  },
  missionVision: {
    title: "",
    peaksConquered: "",
    expeditions: "",
    happyTrekkers: "",
    yearsOfGlory: "",
    missions: [],
    image: "",
  },
  howItWorks: { title: "", description: "", phases: [] },
  whyChooseUs: {
    mainTitle: "",
    rating: "",
    safety: "",
    happyTrekkers: "",
    expeditions: "",
    image: "",
    whyUsItems: [],
  },
  safetyStandards: { title: "", description: "", standards: [] },
  faq: { mainTitle: "Frequently Asked Questions", faqs: [] },
  features: { mainTitle: "Our Features", features: [] },
  footer: {
    brand: { tagline: "", description: "" },
    socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "" },
    contact: {
      phone: "",
      email: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
    },
    footerBottom: { year: new Date().getFullYear(), companyName: "" },
  },
});

// ─── API Map ──────────────────────────────────────────────────────────────────
const API_URLS = {
  hero: "/hero",
  missionVision: "/mission-vision",
  howItWorks: "/how-we-work",
  whyChooseUs: "/why-choose-us",
  safetyStandards: "/safety-standards",
  faq: "/faqs",
  features: "/our-features",
  footer: "/footer",
};

const FORMS = {
  hero: HeroForm,
  missionVision: MissionVisionForm,
  howItWorks: HowItWorksForm,
  whyChooseUs: WhyChooseUsForm,
  safetyStandards: SafetyStandardsForm,
  faq: FaqForm,
  features: FeaturesForm,
  footer: FooterForm,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ show, message, isError }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}
    >
      <div
        className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold 
      ${isError ? "bg-linear-to-r from-red-600 to-red-500 shadow-red-500/30" : "bg-linear-to-r from-blue-600 to-blue-500 shadow-blue-500/30"}`}
      >
        <FaCheck className={`text-xs shrink-0 ${isError ? "hidden" : ""}`} />
        <FaTimes className={`text-xs shrink-0 ${!isError ? "hidden" : ""}`} />
        {message}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SectionManager() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(tab && FORMS[tab] ? tab : "hero");
  const [formData, setFormData] = useState(initData());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });
  // ─── State Updates ─────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false); // edit mode toggle
  const [isViewing, setIsViewing] = useState(false); // view mode toggle

  // ─── Fetch Section Data ────────────────────────────────────────
  // const fetchSectionData = async (sectionKey) => {
  //   setIsLoading(true);
  //   try {
  //     const res = await axiosInstance.get(API_URLS[sectionKey], { timeout: 30000 });
  //     if (res.data) {
  //       setFormData((prev) => ({ ...prev, [sectionKey]: res.data?.data }));
  //     }
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //     showToast("Failed to fetch data from server", true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ─── Fetch Section Data ───────────────────────────────────────────────
  const fetchSectionData = async (sectionKey) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(API_URLS[sectionKey], {
        timeout: 30000,
      });

      if (res.data?.data) {
        // Data exists, set in state
        setFormData((prev) => ({ ...prev, [sectionKey]: res.data.data }));
      } else {
        // No data → initialize
        const emptyData = initData()[sectionKey];
        setFormData((prev) => ({ ...prev, [sectionKey]: emptyData }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Handle 404: section not yet created
      if (err.response?.status === 404) {
        const emptyData = initData()[sectionKey];
        setFormData((prev) => ({ ...prev, [sectionKey]: emptyData }));
      } else {
        showToast("Failed to fetch section data", true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // ─── Button Handlers ──────────────────────────────────────────
  const handleEdit = async () => {
    await fetchSectionData(current);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleView = async () => {
    await fetchSectionData(current);
    setIsViewing(true);
    setIsEditing(false);
  };

  // Sync state with URL params
  useEffect(() => {
    if (tab && FORMS[tab] && current !== tab) {
      setCurrent(tab);
    } else if (!tab) {
      navigate("/userInsights/hero", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabChange = (key) => {
    setCurrent(key);
    navigate(`/userInsights/${key}`);
  };

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  };

  const updateSection = (val) =>
    setFormData((prev) => ({ ...prev, [current]: val }));

  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     const data = formData[current];
  //     let payload;
  //     let headers = {};

  //     // Sections with files -> use FormData
  //     const requiresFormData = ["hero", "missionVision", "whyChooseUs", "safetyStandards"].includes(current);

  //     if (requiresFormData) {
  //       payload = new FormData();
  //       const exclude = ["_id", "createdAt", "updatedAt", "__v"];

  //       Object.keys(data).forEach((key) => {
  //         if (exclude.includes(key)) return;

  //         const value = data[key];
  //         if (value instanceof File) {
  //           // map HeroImage / WhyUsImage / SafetyImages
  //           let fieldName = key === "image" && current === "hero" ? "HeroImage" :
  //             key === "image" && current === "whyChooseUs" ? "WhyUsImage" :
  //               key;
  //           payload.append(fieldName, value);
  //         } else if (Array.isArray(value) || (value && typeof value === "object")) {
  //           payload.append(key, JSON.stringify(value));
  //         } else if (value !== null && value !== undefined) {
  //           payload.append(key, value);
  //         }
  //       });

  //       headers["Content-Type"] = "multipart/form-data";

  //     } else {
  //       // For FAQ, Features, HowItWorks -> send JSON
  //       payload = { ...data };
  //       headers["Content-Type"] = "application/json";
  //     }

  //     await axiosInstance.post(API_URLS[current], payload, { headers, timeout: 45000 });
  //     showToast("Saved successfully!");
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     if (err.code === "ECONNABORTED") {
  //       showToast("Request timed out. Please check backend.", true);
  //     } else if (err.response?.data?.message) {
  //       showToast(err.response.data.message, true);
  //     } else {
  //       showToast("An error occurred while saving. Please try again.", true);
  //     }
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     const data = formData[current];
  //     let payload;
  //     let headers = {};

  //     // Sections with files -> use FormData
  //     const requiresFormData = ["hero", "missionVision", "whyChooseUs", "safetyStandards"].includes(current);

  //     if (requiresFormData) {
  //       payload = new FormData();
  //       const exclude = ["_id", "createdAt", "updatedAt", "__v"];

  //       Object.keys(data).forEach((key) => {
  //         if (exclude.includes(key)) return;

  //         const value = data[key];
  //         if (value instanceof File) {
  //           let fieldName =
  //             key === "image" && current === "hero" ? "HeroImage" :
  //               key === "image" && current === "whyChooseUs" ? "WhyUsImage" :
  //                 key;
  //           payload.append(fieldName, value);
  //         } else if (Array.isArray(value) || (value && typeof value === "object")) {
  //           payload.append(key, JSON.stringify(value));
  //         } else if (value !== null && value !== undefined) {
  //           payload.append(key, value);
  //         }
  //       });

  //       headers["Content-Type"] = "multipart/form-data";

  //     } else {
  //       // For FAQ, Features, HowItWorks -> send JSON
  //       payload = { ...data };
  //       headers["Content-Type"] = "application/json";
  //     }

  //     await axiosInstance.post(API_URLS[current], payload, { headers, timeout: 45000 });

  //     showToast("Saved successfully!");

  //     // ✅ Reset the form after successful submission
  //     setFormData(initData());  // resets all sections to initial state
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     if (err.code === "ECONNABORTED") {
  //       showToast("Request timed out. Please check backend.", true);
  //     } else if (err.response?.data?.message) {
  //       showToast(err.response.data.message, true);
  //     } else {
  //       showToast("An error occurred while saving. Please try again.", true);
  //     }
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const data = formData[current] || initData()[current];

      const hasId = !!data._id; // ✅ check if update or create
      let payload;
      let headers = {};

      const requiresFormData = [
        "hero",
        "missionVision",
        "whyChooseUs",
        "safetyStandards",
      ].includes(current);

      if (requiresFormData) {
        payload = new FormData();
        const exclude = ["createdAt", "updatedAt", "__v"]; // keep _id

        Object.keys(data).forEach((key) => {
          if (exclude.includes(key)) return;

          const value = data[key];

          if (value instanceof File) {
            let fieldName =
              key === "image" && current === "hero"
                ? "HeroImage"
                : key === "image" && current === "whyChooseUs"
                  ? "WhyUsImage"
                  : key;

            payload.append(fieldName, value);
          } else if (
            Array.isArray(value) ||
            (value && typeof value === "object")
          ) {
            payload.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            payload.append(key, value);
          }
        });

        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = { ...data };
        headers["Content-Type"] = "application/json";
      }

      // ✅ Decide API method + URL
      const method = hasId ? "put" : "post";
      const url = hasId
        ? `${API_URLS[current]}` // update
        : API_URLS[current]; // create

      console.log("METHOD:", method);
      console.log("URL:", url);
      console.log("PAYLOAD:", payload);

      const res = await axiosInstance({
        method,
        url,
        data: payload,
        headers,
        timeout: 45000,
      });
      console.log("DATA:", data);
      console.log("PAYLOAD:", payload);
      console.log("HEADERS:", headers);
      // ✅ IMPORTANT: update state with backend response (keeps _id)
      if (res.data?.data) {
        setFormData((prev) => ({
          ...prev,
          [current]: res.data.data,
        }));
      }

      showToast(hasId ? "Updated successfully!" : "Created successfully!");
      // ✅ Reset ONLY current section (best approach)
      setFormData((prev) => ({
        ...prev,
        [current]: initData()[current],
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);

      if (err.code === "ECONNABORTED") {
        showToast("Request timed out. Please check backend.", true);
      } else if (err.response?.data?.message) {
        showToast(err.response.data.message, true);
      } else {
        showToast("An error occurred while saving. Please try again.", true);
      }
    } finally {
      setIsSaving(false);
    }
  };
  const ActiveForm = FORMS[current];
  const meta = SECTION_META[current];
  const SectionIcon = meta?.Icon || FaHome;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6">
      <Toast {...toast} />
      <div className="w-full max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/30">
              <FaTh className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                User Insights
              </h1>
              <p className="text-slate-400 text-xs font-medium">
                Manage all website content sections
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium bg-white border border-blue-100 px-3 py-1.5 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {NAV.length} sections
          </div>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl overflow-hidden border border-blue-100/80 shadow-2xl shadow-blue-100/60 flex bg-white"
          style={{ minHeight: 600 }}
        >
          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
            {/* Section Header */}
            <div className="px-8 pt-7 pb-5 border-b border-blue-50 bg-linear-to-r from-blue-600/5 via-blue-50/20 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                  <SectionIcon className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-800">
                    {meta?.label}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{meta?.sub}</p>
                </div>
                <span className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shrink-0 border">
                  Object
                </span>
              </div>
            </div>

            {/* Form Body */}
            {/* <div className="flex-1 overflow-y-auto px-8 py-6">
              {ActiveForm && <ActiveForm data={formData[current]} onChange={updateSection} />}
            </div> */}

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {ActiveForm && (
                <ActiveForm
                  data={formData[current]}
                  onChange={updateSection}
                  disabled={isViewing} // ✅ pass view mode here
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-blue-50 bg-linear-to-r from-blue-50/40 to-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400 font-medium">
                  Ready to save
                </span>
              </div>
              {/* <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { console.log("Export:", JSON.stringify(formData, null, 2)); }}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
                >
                  <FaDownload className="text-xs" /> Export JSON
                </button>
                <button
                  type="button"
                  disabled={isSaving || isLoading}
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 text-sm px-6 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FaSave className="text-xs" />
                  )}
                  {isSaving ? "Saving..." : "Save Section"}
                </button>
              </div> */}

              <div className="flex items-center gap-3">
                {/* <button
                  type="button"
                  onClick={handleView}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
                >
                  <FaEye className="text-xs" /> View
                </button> */}
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={isLoading || isEditing}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCog className="text-xs" /> Edit
                </button>
                <button
                  type="button"
                  disabled={isSaving || isLoading}
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 text-sm px-6 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FaSave className="text-xs" />
                  )}
                  {isSaving ? "Saving..." : "Save Section"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Data stored in component state · <strong>Export JSON</strong> to get
          the full payload
        </p>
      </div>
    </div>
  );
}
