// import { useState, useEffect } from "react";

// import {
//   FaImage,
//   FaInfoCircle,
//   FaRupeeSign,
//   FaCalendarAlt,
//   FaPlus,
//   FaTrash,
//   FaChartBar,
//   FaFileAlt,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaClock,
//   FaHiking,
// } from "react-icons/fa";

// // UI Components
// import InputField from "../components/form/InputField";
// import Checkbox from "../components/form/Checkbox";
// import RadioButton from "../components/form/RadioButton";
// import TagsInput from "../components/form/TagsInput";
// import ImageUploader from "../components/form/ImageUploader";
// import CustomSelect from "../components/form/CustomSelect";
// import CustomDatePicker from "../components/form/CustomDatePicker";
// import RichTextEditor from "../components/form/RichTextEditor";
// // import RichTextEditor from "../components/form/RichTextEditor";
// import { useNavigate, useParams } from "react-router-dom";
// import { createTrek, getTrekById, updateTrek } from "../api/trekApi";
// import { FaChevronRight } from "react-icons/fa";
// import { getAllCategories } from "../api/trekCategoriesApi";

// export default function TrekForm() {
//   const [formData, setFormData] = useState({
//     title: "",
//     location: "",
//     difficulty: "Moderate",
//     category: null,
//     duration: "",
//     groupSize: "",
//     price: 0,
//     discount: 0,
//     featured: false,
//     isActive: true,
//     season: "",
//     altitude: "",
//     tags: [],
//     highlight: "",
//     bestFor: "",
//     description: "",
//     status: "Upcoming",
//     bookingType: "Trek",
//     startDate: null,
//     endDate: null,
//     feeDetails: {
//       baseFee: 0,
//       gstPercent: 5,
//       insurance: 180,
//       transport: 2800,
//     },
//     links: {
//       inclusions: "",
//       terms: "",
//       cancellation: "",
//       scholarships: "",
//     },
//     proTrekkerBenefit: "",
//     govtEligibility: "",
//     trekInfo: [
//       { title: "TREK DIFFICULTY", value: "" },
//       { title: "TREK DURATION", value: "" },
//       { title: "HIGHEST ALTITUDE", value: "" },
//       { title: "SUITABLE FOR", value: "" },
//     ],
//     addons: [],
//     months: [],
//     reviewsData: [],
//     image: "",
//     gallery: [],
//   });

//   const [activeTab, setActiveTab] = useState("basic");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [categories, setCategories] = useState([]);

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = !!id;

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         // The API returns 'title' instead of 'name'
//         setCategories(
//           data.map((cat) => ({ value: cat._id, label: cat.title })),
//         );
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchTrekDetails = async () => {
//         try {
//           setLoading(true);
//           const trekData = await getTrekById(id);

//           // Map category object to ID if needed
//           const categoryId = trekData.category?._id || trekData.category;

//           // Map months object array to string array for TagsInput
//           const monthsList = Array.isArray(trekData.months)
//             ? trekData.months.map((m) => (typeof m === "object" ? m.month : m))
//             : [];

//           setFormData((prev) => ({
//             ...prev,
//             ...trekData,
//             category: categoryId,
//             months: monthsList,
//             // Deep merge nested objects to avoid losing defaults or partial data
//             feeDetails: { ...prev.feeDetails, ...(trekData.feeDetails || {}) },
//             links: { ...prev.links, ...(trekData.links || {}) },
//             // Preserve default trekInfo structure if API returns empty
//             trekInfo:
//               trekData.trekInfo && trekData.trekInfo.length > 0
//                 ? trekData.trekInfo
//                 : prev.trekInfo,
//             // Ensure dates are string format for inputs
//             startDate: trekData.startDate
//               ? trekData.startDate.split("T")[0]
//               : "",
//             endDate: trekData.endDate ? trekData.endDate.split("T")[0] : "",
//           }));
//           setLoading(false);
//         } catch (err) {
//           console.error("Failed to fetch trek details:", err);
//           setErrorMessage("Failed to load trek details for editing.");
//           setLoading(false);
//         }
//       };
//       fetchTrekDetails();
//     }
//   }, [id]);

//   const tabs = [
//     { id: "basic", label: "Basic Info", icon: FaInfoCircle },
//     { id: "details", label: "Specifications", icon: FaChartBar },
//     { id: "logistics", label: "Content", icon: FaCalendarAlt },
//     { id: "fees", label: "Pricing", icon: FaRupeeSign },
//     { id: "media", label: "Media", icon: FaImage },
//   ];

//   const handleNextTab = () => {
//     const currentIndex = tabs.findIndex((t) => t.id === activeTab);
//     if (currentIndex < tabs.length - 1) {
//       setActiveTab(tabs[currentIndex + 1].id);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   // Constants
//   const difficulties = [
//     "Easy",
//     "Moderate",
//     "Challenging",
//     "Difficult",
//     "Extreme",
//   ];

//   const statuses = [
//     { value: "Upcoming", label: "Upcoming" },
//     { value: "Ongoing", label: "Ongoing" },
//     { value: "Completed", label: "Completed" },
//   ];

//   const bookingTypes = [
//     { value: "Trek", label: "Trek" },
//     { value: "Trip", label: "Trip" },
//     { value: "Trek + Camping", label: "Trek + Camping" },
//   ];

//   const trekInfoTitles = [
//     "TREK DIFFICULTY",
//     "TREK DURATION",
//     "HIGHEST ALTITUDE",
//     "SUITABLE FOR",
//     "BASECAMP",
//     "ACCOMMODATION",
//     "FITNESS CRITERIA",
//     "PICKUP",
//     "DROPOFF",
//     "GEAR RENTAL",
//     "CLOAKROOM",
//     "OFFLOADING",
//   ];

//   const handleArrayChange = (index, field, value, section) => {
//     const updated = [...formData[section]];
//     updated[index][field] = value;
//     setFormData({ ...formData, [section]: updated });
//   };

//   const addArrayItem = (section, defaultObj) => {
//     setFormData({ ...formData, [section]: [...formData[section], defaultObj] });
//   };

//   const removeArrayItem = (section, index) => {
//     const updated = [...formData[section]];
//     updated.splice(index, 1);
//     setFormData({ ...formData, [section]: updated });
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     setLoading(true);
//     setErrorMessage("");

//     try {
//       if (isEditMode) {
//         await updateTrek(id, formData);
//         alert("Trek updated successfully!");
//       } else {
//         await createTrek(formData);
//         alert("Trek created successfully!");
//       }
//       navigate("/treks/manage");
//     } catch (err) {
//       console.error("Submission error:", err);
//       setErrorMessage(
//         err.message || "An error occurred while saving the trek.",
//       );
//       alert(`Failed to save trek: ${err.message || err}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const SectionTitle = ({ icon: Icon, title }) => (
//     <div className="flex items-center gap-2 mb-6 border-b pb-2">
//       <Icon className="text-emerald-600 text-xl" />
//       <h2 className="text-xl font-bold text-gray-800 tracking-tight">
//         {title}
//       </h2>
//     </div>
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//               {isEditMode ? "Update Trek" : "Create New Trek"}
//             </h1>
//             <p className="text-gray-500 font-medium italic">
//               {isEditMode
//                 ? `Editing ID: ${id}`
//                 : "Configure trek details as per the database schema"}
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/treks/manage")}
//               className="px-6 py-2 text-gray-500 font-bold hover:text-gray-800 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`${
//                 loading
//                   ? "bg-emerald-400 cursor-not-allowed"
//                   : "bg-emerald-600 hover:bg-emerald-700"
//               } text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2`}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   {isEditMode ? "Updating..." : "Saving..."}
//                 </>
//               ) : (
//                 <>{isEditMode ? "Update Details" : "Verify & Save Trek"}</>
//               )}
//             </button>
//           </div>
//         </header>

//         {/* Tab Navigation */}
//         <div className="flex flex-wrap gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all
//                 ${
//                   activeTab === tab.id
//                     ? "bg-white text-emerald-600 shadow-sm"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//               <tab.icon className="text-lg" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[600px]"
//         >
//           {/* --- BASIC INFO --- */}
//           {activeTab === "basic" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <SectionTitle icon={FaInfoCircle} title="Primary Details" />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="md:col-span-2">
//                   <InputField
//                     label="Trek Name"
//                     icon={FaHiking}
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     placeholder="Enter official trek title"
//                   />
//                 </div>

//                 <InputField
//                   label="Trek Location"
//                   icon={FaMapMarkerAlt}
//                   value={formData.location}
//                   onChange={(e) =>
//                     setFormData({ ...formData, location: e.target.value })
//                   }
//                   placeholder="Region, State (e.g. Ladakh, India)"
//                 />

//                 <InputField
//                   label="Trek Duration"
//                   icon={FaClock}
//                   value={formData.duration}
//                   onChange={(e) =>
//                     setFormData({ ...formData, duration: e.target.value })
//                   }
//                   placeholder="E.g. 10 Days / 9 Nights"
//                 />

//                 <InputField
//                   label="Target Group Size"
//                   icon={FaUsers}
//                   value={formData.groupSize}
//                   onChange={(e) =>
//                     setFormData({ ...formData, groupSize: e.target.value })
//                   }
//                   placeholder="E.g. 12-15 Base Campers"
//                 />

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Registration Status
//                   </label>
//                   <CustomSelect
//                     options={statuses}
//                     value={statuses.find((s) => s.value === formData.status)}
//                     onChange={(val) =>
//                       setFormData({ ...formData, status: val.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Trek Category
//                   </label>
//                   <CustomSelect
//                     options={categories}
//                     value={categories.find(
//                       (c) => c.value === formData.category,
//                     )}
//                     onChange={(val) =>
//                       setFormData({ ...formData, category: val.value })
//                     }
//                     placeholder="Select a category"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Booking Type
//                   </label>
//                   <CustomSelect
//                     options={bookingTypes}
//                     value={bookingTypes.find(
//                       (s) => s.value === formData.bookingType,
//                     )}
//                     onChange={(val) =>
//                       setFormData({ ...formData, bookingType: val.value })
//                     }
//                   />
//                 </div>

//                 <div className="md:col-span-2 space-y-3">
//                   <label className="block text-sm font-bold text-gray-700 ml-1">
//                     Complexity Level
//                   </label>
//                   <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                     {difficulties.map((level) => (
//                       <RadioButton
//                         key={level}
//                         id={`diff-${level}`}
//                         name="difficulty"
//                         label={level}
//                         value={level}
//                         checked={formData.difficulty === level}
//                         onChange={(val) =>
//                           setFormData({ ...formData, difficulty: val })
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <div className="md:col-span-2 flex items-center gap-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
//                   <Checkbox
//                     id="feat"
//                     label="Mark as Featured (Landing Page)"
//                     checked={formData.featured}
//                     onChange={(val) =>
//                       setFormData({ ...formData, featured: val })
//                     }
//                   />
//                   <Checkbox
//                     id="act"
//                     label="Publicly Visible"
//                     checked={formData.isActive}
//                     onChange={(val) =>
//                       setFormData({ ...formData, isActive: val })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="button"
//                   onClick={handleNextTab}
//                   className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
//                 >
//                   Next Step <FaChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* --- SPECIFICATIONS --- */}
//           {activeTab === "details" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <SectionTitle icon={FaChartBar} title="Technical Data" />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <InputField
//                   label="Peak Altitude"
//                   value={formData.altitude}
//                   onChange={(e) =>
//                     setFormData({ ...formData, altitude: e.target.value })
//                   }
//                   placeholder="E.g. 5,364m / 17,598ft"
//                 />

//                 <InputField
//                   label="Recommended Season"
//                   value={formData.season}
//                   onChange={(e) =>
//                     setFormData({ ...formData, season: e.target.value })
//                   }
//                   placeholder="E.g. June to September"
//                 />

//                 <div className="md:col-span-2">
//                   <TagsInput
//                     label="Filter Tags"
//                     value={formData.tags}
//                     onChange={(tags) => setFormData({ ...formData, tags })}
//                     placeholder="Type tag and press enter..."
//                   />
//                 </div>

//                 <div className="md:col-span-2 p-6 bg-gray-50 rounded-3xl border border-gray-100">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
//                       Trek Parameter Mapping
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         addArrayItem("trekInfo", {
//                           title: "TREK DIFFICULTY",
//                           value: "",
//                         })
//                       }
//                       className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
//                     >
//                       <FaPlus /> Add Parameter
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {formData.trekInfo.map((info, index) => (
//                       <div
//                         key={index}
//                         className="group relative bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                       >
//                         <select
//                           value={info.title}
//                           onChange={(e) =>
//                             handleArrayChange(
//                               index,
//                               "title",
//                               e.target.value,
//                               "trekInfo",
//                             )
//                           }
//                           className="w-full text-sm font-black text-emerald-600 bg-transparent border-none outline-none mb-2 focus:ring-0"
//                         >
//                           {trekInfoTitles.map((t) => (
//                             <option key={t} value={t}>
//                               {t}
//                             </option>
//                           ))}
//                         </select>
//                         <div className="flex gap-2 items-center">
//                           <input
//                             type="text"
//                             value={info.value}
//                             onChange={(e) =>
//                               handleArrayChange(
//                                 index,
//                                 "value",
//                                 e.target.value,
//                                 "trekInfo",
//                               )
//                             }
//                             className="flex-1 bg-gray-50 border-none rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
//                             placeholder="Data value..."
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeArrayItem("trekInfo", index)}
//                             className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//                           >
//                             <FaTrash size={14} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="button"
//                   onClick={handleNextTab}
//                   className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
//                 >
//                   Next Step <FaChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* --- CONTENT --- */}
//           {activeTab === "logistics" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <SectionTitle
//                 icon={FaCalendarAlt}
//                 title="Descriptions & Planning"
//               />

//               <div className="space-y-8">
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Trek Date Range
//                   </label>
//                   <CustomDatePicker
//                     startDate={formData.startDate}
//                     endDate={formData.endDate}
//                     onChange={(dates) =>
//                       setFormData({
//                         ...formData,
//                         startDate: dates[0],
//                         endDate: dates[1],
//                       })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Trek Highlights (Brief Summary)
//                   </label>
//                   <RichTextEditor
//                     value={formData.highlight}
//                     onChange={(content) =>
//                       setFormData({ ...formData, highlight: content })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                     Full Story / Itinerary Overview
//                   </label>
//                   <RichTextEditor
//                     value={formData.description}
//                     onChange={(content) =>
//                       setFormData({ ...formData, description: content })
//                     }
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <InputField
//                     label="Target Audience (Best For)"
//                     value={formData.bestFor}
//                     onChange={(e) =>
//                       setFormData({ ...formData, bestFor: e.target.value })
//                     }
//                     placeholder="E.g. Weekend Warriors, Pro Solos"
//                   />
//                   <InputField
//                     label="Pro-Trekker Incentives"
//                     value={formData.proTrekkerBenefit}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         proTrekkerBenefit: e.target.value,
//                       })
//                     }
//                     placeholder="Special perks for returning trekkers"
//                   />

//                   <InputField
//                     label="Govt. Eligibility / Certificate"
//                     value={formData.govtEligibility}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         govtEligibility: e.target.value,
//                       })
//                     }
//                     placeholder="Eligibility criteria for govt. benefits"
//                   />

//                   <div className="md:col-span-2">
//                     <TagsInput
//                       label="Available Months"
//                       value={formData.months}
//                       onChange={(months) =>
//                         setFormData({ ...formData, months })
//                       }
//                       placeholder="Type month and press enter..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="button"
//                   onClick={handleNextTab}
//                   className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
//                 >
//                   Next Step <FaChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* --- PRICING --- */}
//           {activeTab === "fees" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <SectionTitle
//                 icon={FaRupeeSign}
//                 title="Commercial Configuration"
//               />

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex flex-col justify-center text-white relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform group-hover:rotate-12 transition-transform">
//                     <FaRupeeSign size={100} />
//                   </div>
//                   <label className="block mb-2 text-[10px] uppercase font-black text-emerald-100 tracking-widest opacity-80">
//                     Base Platform Fee
//                   </label>
//                   <div className="flex items-center gap-3">
//                     <span className="text-4xl font-black opacity-60">₹</span>
//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           price: Number(e.target.value),
//                         })
//                       }
//                       className="bg-transparent text-5xl font-black border-none outline-none w-full focus:ring-0 placeholder:text-emerald-400/50"
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>

//                 <div className="lg:col-span-2 grid grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
//                   <InputField
//                     label="Base Fee (Excl. GST)"
//                     type="number"
//                     value={formData.feeDetails.baseFee}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         feeDetails: {
//                           ...formData.feeDetails,
//                           baseFee: Number(e.target.value),
//                         },
//                       })
//                     }
//                   />
//                   <InputField
//                     label="Discount Amount"
//                     type="number"
//                     value={formData.discount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         discount: Number(e.target.value),
//                       })
//                     }
//                     placeholder="₹ 0"
//                   />
//                   <InputField
//                     label="Group Insurance Cost"
//                     type="number"
//                     value={formData.feeDetails.insurance}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         feeDetails: {
//                           ...formData.feeDetails,
//                           insurance: Number(e.target.value),
//                         },
//                       })
//                     }
//                   />
//                   <InputField
//                     label="Expedition Transport"
//                     type="number"
//                     value={formData.feeDetails.transport}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         feeDetails: {
//                           ...formData.feeDetails,
//                           transport: Number(e.target.value),
//                         },
//                       })
//                     }
//                   />
//                   <div className="col-span-2">
//                     <InputField
//                       label="GST %"
//                       type="number"
//                       value={formData.feeDetails.gstPercent}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           feeDetails: {
//                             ...formData.feeDetails,
//                             gstPercent: Number(e.target.value),
//                           },
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-12 space-y-6">
//                 <SectionTitle icon={FaFileAlt} title="Resource Endpoints" />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <InputField
//                     label="Inclusions PDF"
//                     value={formData.links.inclusions}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         links: {
//                           ...formData.links,
//                           inclusions: e.target.value,
//                         },
//                       })
//                     }
//                     placeholder="https://..."
//                   />
//                   <InputField
//                     label="Terms & Conditions"
//                     value={formData.links.terms}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         links: { ...formData.links, terms: e.target.value },
//                       })
//                     }
//                     placeholder="https://..."
//                   />
//                   <InputField
//                     label="Cancellation Policy"
//                     value={formData.links.cancellation}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         links: {
//                           ...formData.links,
//                           cancellation: e.target.value,
//                         },
//                       })
//                     }
//                     placeholder="https://..."
//                   />
//                   <InputField
//                     label="Scholarship Details"
//                     value={formData.links.scholarships}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         links: {
//                           ...formData.links,
//                           scholarships: e.target.value,
//                         },
//                       })
//                     }
//                     placeholder="https://..."
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="button"
//                   onClick={handleNextTab}
//                   className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
//                 >
//                   Next Step <FaChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* --- MEDIA --- */}
//           {activeTab === "media" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <SectionTitle icon={FaImage} title="Media Assets Management" />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                 <div className="space-y-6">
//                   <ImageUploader
//                     label="Hero Representation (Single)"
//                     value={formData.image}
//                     onChange={(img) => setFormData({ ...formData, image: img })}
//                   />

//                   <div className="pt-4 border-t border-gray-100">
//                     <ImageUploader
//                       label="Expedition Gallery (Max 10)"
//                       isMultiple
//                       maxFiles={10}
//                       value={formData.gallery}
//                       onChange={(imgs) =>
//                         setFormData({ ...formData, gallery: imgs })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-800">
//                         Add-on Services
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Optional gear or porter services
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         addArrayItem("addons", {
//                           name: "",
//                           price: 0,
//                           description: "",
//                         })
//                       }
//                       className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
//                     >
//                       <FaPlus size={18} />
//                     </button>
//                   </div>

//                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                     {formData.addons.map((addon, index) => (
//                       <div
//                         key={index}
//                         className="group p-5 bg-white rounded-2xl border border-gray-200 relative animate-in zoom-in duration-300"
//                       >
//                         <button
//                           type="button"
//                           onClick={() => removeArrayItem("addons", index)}
//                           className="absolute -top-2 -right-2 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-100 shadow-sm"
//                         >
//                           <FaTrash size={12} />
//                         </button>
//                         <div className="space-y-4">
//                           <input
//                             type="text"
//                             value={addon.name}
//                             onChange={(e) =>
//                               handleArrayChange(
//                                 index,
//                                 "name",
//                                 e.target.value,
//                                 "addons",
//                               )
//                             }
//                             className="w-full bg-transparent font-bold text-gray-800 outline-none border-b border-gray-100 focus:border-emerald-500 transition-colors"
//                             placeholder="Service Name (e.g. Sleeping Bag Rental)"
//                           />
//                           <div className="flex gap-4 items-center">
//                             <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
//                               <span className="text-emerald-600 font-black">
//                                 ₹
//                               </span>
//                               <input
//                                 type="number"
//                                 value={addon.price}
//                                 onChange={(e) =>
//                                   handleArrayChange(
//                                     index,
//                                     "price",
//                                     Number(e.target.value),
//                                     "addons",
//                                   )
//                                 }
//                                 className="w-full bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300"
//                                 placeholder="0"
//                               />
//                             </div>
//                           </div>
//                           <textarea
//                             value={addon.description}
//                             onChange={(e) =>
//                               handleArrayChange(
//                                 index,
//                                 "description",
//                                 e.target.value,
//                                 "addons",
//                               )
//                             }
//                             className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
//                             placeholder="Service description..."
//                           />
//                         </div>
//                       </div>
//                     ))}
//                     {formData.addons.length === 0 && (
//                       <div className="py-20 text-center space-y-2 opacity-30">
//                         <FaHiking className="mx-auto text-4xl" />
//                         <p className="text-sm font-bold">
//                           No optional services added
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

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

// Yup Validation Schema
const trekValidationSchema = Yup.object().shape({
  // title: Yup.string()
  //   .required("Trek name is required")
  //   .min(3, "Trek name must be at least 3 characters")
  //   .max(100, "Trek name must be less than 100 characters"),

  // location: Yup.string()
  //   .required("Location is required")
  //   .min(3, "Location must be at least 3 characters"),

  // difficulty: Yup.string()
  //   .required("Difficulty level is required")
  //   .oneOf(
  //     ["Easy", "Moderate", "Challenging", "Difficult", "Extreme"],
  //     "Invalid difficulty level",
  //   ),

  // category: Yup.string().nullable().required("Category is required"),

  // duration: Yup.string().required("Duration is required"),

  // groupSize: Yup.string().required("Group size is required"),

  // price: Yup.number()
  //   .required("Price is required")
  //   .min(0, "Price must be a positive number"),

  // discount: Yup.number()
  //   .min(0, "Discount cannot be negative")
  //   .test(
  //     "discount-less-than-price",
  //     "Discount cannot exceed price",
  //     function (value) {
  //       return !value || value <= this.parent.price;
  //     },
  //   ),

  // altitude: Yup.string().required("Altitude is required"),

  // season: Yup.string().required("Season is required"),

  // tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),

  // highlight: Yup.string()
  //   .required("Trek highlights are required")
  //   .min(10, "Highlights must be at least 10 characters"),

  // description: Yup.string()
  //   .required("Description is required")
  //   .min(50, "Description must be at least 50 characters"),

  // status: Yup.string()
  //   .required("Status is required")
  //   .oneOf(["Upcoming", "Ongoing", "Completed"], "Invalid status"),

  // bookingType: Yup.string()
  //   .required("Booking type is required")
  //   .oneOf(["Trek", "Trip", "Trek + Camping"], "Invalid booking type"),

  // startDate: Yup.date().nullable().required("Start date is required"),

  // endDate: Yup.date()
  //   .nullable()
  //   .required("End date is required")
  //   .test(
  //     "end-date-after-start",
  //     "End date must be after start date",
  //     function (value) {
  //       const { startDate } = this.parent;
  //       if (!startDate || !value) return true;
  //       return new Date(value) >= new Date(startDate);
  //     },
  //   ),

  // feeDetails: Yup.object().shape({
  //   baseFee: Yup.number()
  //     .required("Base fee is required")
  //     .min(0, "Base fee must be positive"),
  //   gstPercent: Yup.number()
  //     .required("GST percentage is required")
  //     .min(0, "GST cannot be negative")
  //     .max(100, "GST cannot exceed 100%"),
  //   insurance: Yup.number()
  //     .required("Insurance cost is required")
  //     .min(0, "Insurance cost must be positive"),
  //   transport: Yup.number()
  //     .required("Transport cost is required")
  //     .min(0, "Transport cost must be positive"),
  // }),

  // links: Yup.object().shape({
  //   inclusions: Yup.string().url("Must be a valid URL"),
  //   terms: Yup.string().url("Must be a valid URL"),
  //   cancellation: Yup.string().url("Must be a valid URL"),
  //   scholarships: Yup.string().url("Must be a valid URL"),
  // }),

  // trekInfo: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       title: Yup.string().required("Title is required"),
  //       value: Yup.string().required("Value is required"),
  //     }),
  //   )
  //   .min(1, "At least one trek info parameter is required"),

  // addons: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required("Addon name is required"),
  //     price: Yup.number()
  //       .required("Addon price is required")
  //       .min(0, "Price must be positive"),
  //     description: Yup.string(),
  //   }),
  // ),

  // months: Yup.array().of(Yup.string()).min(1, "At least one month is required"),

  // image: Yup.string().required("Hero image is required"),

  // gallery: Yup.array()
  //   .of(Yup.string())
  //   .max(10, "Maximum 10 gallery images allowed"),
});

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
    featured: false,
    isActive: true,
    season: "",
    altitude: "",
    tags: [],
    highlight: "",
    bestFor: "",
    description: "",
    status: "Upcoming",
    bookingType: "Trek",
    startDate: null,
    endDate: null,
    feeDetails: {
      baseFee: 0,
      gstPercent: 5,
      insurance: 180,
      transport: 2800,
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
      { title: "SUITABLE FOR", value: "" },
    ],
    addons: [],
    months: [],
    reviewsData: [],
    image: null, // Changed from "" to null
    gallery: [], // Changed from [] to [] (still array, but will hold file objects)
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const priceInputRef = useRef(null);
  const { id } = useParams();
  const isEditMode = !!id;

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

  // useEffect(() => {
  //   if (isEditMode) {
  //     const fetchTrekDetails = async () => {
  //       try {
  //         setLoading(true);
  //         const trekData = await getTrekById(id);

  //         const categoryId = trekData.category?._id || trekData.category;

  //         const monthsList = Array.isArray(trekData.months)
  //           ? trekData.months.map((m) => (typeof m === "object" ? m.month : m))
  //           : [];

  //         setFormData((prev) => ({
  //           ...prev,
  //           ...trekData,
  //           category: categoryId,
  //           months: monthsList,
  //           feeDetails: { ...prev.feeDetails, ...(trekData.feeDetails || {}) },
  //           links: { ...prev.links, ...(trekData.links || {}) },
  //           trekInfo:
  //             trekData.trekInfo && trekData.trekInfo.length > 0
  //               ? trekData.trekInfo
  //               : prev.trekInfo,
  //           // startDate: trekData.startDate
  //           //   ? trekData.startDate.split("T")[0]
  //           //   : "",
  //           // endDate: trekData.endDate ? trekData.endDate.split("T")[0] : "",
  //           startDate: trekData.startDate ? new Date(trekData.startDate) : null,
  //           endDate: trekData.endDate ? new Date(trekData.endDate) : null,
  //         }));
  //         setLoading(false);
  //       } catch (err) {
  //         console.error("Failed to fetch trek details:", err);
  //         setErrorMessage("Failed to load trek details for editing.");
  //         setLoading(false);
  //       }
  //     };
  //     fetchTrekDetails();
  //   }
  // }, [id, isEditMode]);

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

          // For existing images, create file-like objects with URLs


          setFormData((prev) => ({
            ...prev,
            ...trekData,
            category: categoryId,
            months: monthsList,
            feeDetails: { ...prev.feeDetails, ...(trekData.feeDetails || {}) },
            links: { ...prev.links, ...(trekData.links || {}) },
            trekInfo: trekData.trekInfo && trekData.trekInfo.length > 0
              ? trekData.trekInfo
              : prev.trekInfo,
            startDate: trekData.startDate ? new Date(trekData.startDate) : null,
            endDate: trekData.endDate ? new Date(trekData.endDate) : null,
            image: trekData.image?.cdnUrl || trekData.image || null,
            gallery: trekData.gallery?.map(img => img.cdnUrl || img) || [],
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

  // Helper function to get nested values from formData
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Helper function to map tabs to their fields
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

  // const handleNextTab = async () => {
  //   // Validate current tab before moving to next
  //   const currentTabFields = getFieldsForTab(activeTab);
  //   let hasErrors = false;
  //   const newFieldErrors = {};

  //   for (const field of currentTabFields) {
  //     try {
  //       await Yup.reach(trekValidationSchema, field).validate(
  //         getNestedValue(formData, field),
  //       );
  //     } catch (err) {
  //       newFieldErrors[field] = err.message;
  //       hasErrors = true;
  //     }
  //   }

  //   setFieldErrors(newFieldErrors);

  //   if (!hasErrors) {
  //     const currentIndex = tabs.findIndex((t) => t.id === activeTab);
  //     if (currentIndex < tabs.length - 1) {
  //       setActiveTab(tabs[currentIndex + 1].id);
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //     }
  //   } else {
  //     alert("Please fix the errors before proceeding to the next step.");
  //   }
  // };

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

  const difficulties = [
    "Easy",
    "Moderate",
    "Challenging",
    "Difficult",
    "Extreme",
  ];

  const statuses = [
    { value: "Upcoming", label: "Upcoming" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Completed", label: "Completed" },
  ];

  const bookingTypes = [
    { value: "Trek", label: "Trek" },
    { value: "Trip", label: "Trip" },
    { value: "Trek + Camping", label: "Trek + Camping" },
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
    "CLOAKROOM",
    "OFFLOADING",
  ];

  const handleArrayChange = (index, field, value, section) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const addArrayItem = (section, defaultObj) => {
    setFormData({ ...formData, [section]: [...formData[section], defaultObj] });
  };

  const removeArrayItem = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };


  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // System / read-only fields to EXCLUDE
      const exclude = [
        "_id", "createdAt", "updatedAt", "__v", "id",
        "reviewsData", "rating", "reviews", "slots",
      ];

      Object.keys(formData).forEach(key => {
        if (exclude.includes(key)) return;
        if (key === "image" || key === "gallery") return; // handled below

        const value = formData[key];

        // 1. Category → send ID string only
        if (key === "category") {
          const catId = value?._id || value;
          if (catId) formDataToSend.append("category", String(catId));
        }
        // 2. Nested simple objects: feeDetails, links → bracket notation
        else if (key === "feeDetails" || key === "links") {
          if (value && typeof value === "object") {
            Object.keys(value).forEach(subKey => {
              if (value[subKey] !== null && value[subKey] !== undefined) {
                formDataToSend.append(`${key}[${subKey}]`, value[subKey]);
              }
            });
          }
        }
        // 3. Arrays of objects: trekInfo, addons → indexed bracket notation
        else if (key === "trekInfo" || key === "addons") {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((item, index) => {
              Object.keys(item).forEach(subKey => {
                if (item[subKey] !== null && item[subKey] !== undefined) {
                  formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
                }
              });
            });
          }
        }
        // 4. Simple string arrays: tags → multiple appends with same key
        else if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach(item => formDataToSend.append(key, item));
          }
        }
        // 5. Primitives (string, number, boolean, Date)
        else if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      // Hero Image — backend Multer expects field name: 'TrekImage'
      if (formData.image instanceof File) {
        formDataToSend.append("TrekImage", formData.image);
      } else if (typeof formData.image === "string" && formData.image) {
        formDataToSend.append("image", formData.image); // existing CDN URL in edit mode (text field)
      }

      // Gallery — backend Multer expects field name: 'TrekGallery'
      if (Array.isArray(formData.gallery)) {
        formData.gallery.forEach((item) => {
          if (item instanceof File) {
            formDataToSend.append("TrekGallery", item);
          } else if (typeof item === "string" && item) {
            formDataToSend.append("gallery", item); // existing CDN URL in edit mode (text field)
          }
        });
      }

      // Debug log - shows exactly what's being sent
      console.log("📦 TrekForm FormData fields being sent:");
      const debugFields = [];
      for (let [key, val] of formDataToSend.entries()) {
        debugFields.push(key);
        if (val instanceof File) {
          console.log(`  [FILE] ${key}: name="${val.name}", size=${val.size}b, type="${val.type}"`);
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
  // const handleSubmit = async (e) => {
  //   if (e) e.preventDefault();

  //   setLoading(true);
  //   setErrorMessage("");
  //   setFieldErrors({});

  //   try {
  //     // Validate entire form
  //     // await trekValidationSchema.validate(formData, { abortEarly: false });

  //     if (isEditMode) {
  //       await updateTrek(id, formData);
  //       alert("Trek updated successfully!");
  //     } else {
  //       await createTrek(formData);
  //       alert("Trek created successfully!");
  //     }
  //     navigate("/treks/manage");
  //   } catch (err) {
  //     if (err.name === "ValidationError") {
  //       // Yup validation errors
  //       const errors = {};
  //       err.inner.forEach((error) => {
  //         errors[error.path] = error.message;
  //       });
  //       setFieldErrors(errors);

  //       const errorMessages = err.inner
  //         .map((error) => `${error.path}: ${error.message}`)
  //         .join("\n");
  //       setErrorMessage(errorMessages);
  //       alert(`Validation failed:\n\n${errorMessages}`);
  //     } else {
  //       // API errors
  //       console.error("Submission error:", err);
  //       // setErrorMessage(
  //       //   err.message || "An error occurred while saving the trek.",
  //       // );
  //       // alert(`Failed to save trek: ${err.message || err}`);
  //       const apiMsg =
  //         err.response?.data?.message ||
  //         err.message ||
  //         "An error occurred while saving the trek.";

  //       setErrorMessage(apiMsg);
  //       alert(`Failed to save trek: ${apiMsg}`);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b pb-2">
      <Icon className="text-emerald-600 text-xl" />
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isEditMode ? "Update Trek" : "Create New Trek"}
            </h1>
            <p className="text-gray-500 font-medium italic">
              {isEditMode
                ? `Editing ID: ${id}`
                : "Configure trek details as per the database schema"}
            </p>
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
              className={`${loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
                } text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2`}
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
                ${activeTab === tab.id
                  ? "bg-white text-emerald-600 shadow-sm"
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
                    label="Trek Duration"
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                    Booking Type
                  </label>
                  <CustomSelect
                    options={bookingTypes}
                    value={bookingTypes.find(
                      (s) => s.value === formData.bookingType,
                    )}
                    onChange={(val) =>
                      setFormData({ ...formData, bookingType: val.value })
                    }
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
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
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
                      className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      <FaPlus /> Add Parameter
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.trekInfo.map((info, index) => (
                      <div
                        key={index}
                        className="group relative bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
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
                          className="w-full text-sm font-black text-emerald-600 bg-transparent border-none outline-none mb-2 focus:ring-0"
                        >
                          {trekInfoTitles.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={info.value}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                "value",
                                e.target.value,
                                "trekInfo",
                              )
                            }
                            className="flex-1 bg-gray-50 border-none rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="Data value..."
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("trekInfo", index)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
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
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Target Audience (Best For)"
                    value={formData.bestFor}
                    onChange={(e) =>
                      setFormData({ ...formData, bestFor: e.target.value })
                    }
                    placeholder="E.g. Weekend Warriors, Pro Solos"
                  />
                  <InputField
                    label="Pro-Trekker Incentives"
                    value={formData.proTrekkerBenefit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proTrekkerBenefit: e.target.value,
                      })
                    }
                    placeholder="Special perks for returning trekkers"
                  />

                  <InputField
                    label="Govt. Eligibility / Certificate"
                    value={formData.govtEligibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        govtEligibility: e.target.value,
                      })
                    }
                    placeholder="Eligibility criteria for govt. benefits"
                  />

                  <div className="md:col-span-2">
                    <TagsInput
                      label="Available Months"
                      value={formData.months}
                      onChange={(months) =>
                        setFormData({ ...formData, months })
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

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
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
                  className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex flex-col justify-center text-white relative overflow-hidden group cursor-pointer"
                  onClick={() => {
                    priceInputRef.current?.focus();
                    priceInputRef.current?.select();
                  }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform group-hover:rotate-12 transition-transform">
                    <FaRupeeSign size={100} />
                  </div>

                  <label className="block mb-2 text-[10px] uppercase font-black text-emerald-100 tracking-widest opacity-80">
                    Base Platform Fee
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black opacity-60">₹</span>

                    <input
                      ref={priceInputRef}
                      type="number"
                      value={formData.price}
                      onClick={(e) => e.stopPropagation()} // ⛔ prevent double click
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      onFocus={(e) => e.target.select()}
                      className="bg-transparent text-5xl font-black border-none outline-none w-full focus:ring-0 placeholder:text-emerald-400/50 cursor-pointer"
                      placeholder="0.00"
                    />
                  </div>

                  {fieldErrors.price && (
                    <p className="text-red-200 text-sm mt-2">
                      {fieldErrors.price}
                    </p>
                  )}
                </div>


                <div className="lg:col-span-2 grid grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
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
                      label="Group Insurance Cost"
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
                  <div>
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
                  </div>
                  <div className="col-span-2">
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
                  </div>
                </div>
              </div>

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

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
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

              {/* MEDIA UPLOADS */}
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
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.image}</p>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <ImageUploader
                    label="Expedition Gallery"
                    isMultiple
                    maxFiles={10}
                    value={formData.gallery}
                    onChange={(imgs) => setFormData({ ...formData, gallery: imgs })}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Up to 10 images showing the trek experience
                  </p>
                  {fieldErrors.gallery && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.gallery}</p>
                  )}
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
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all"
                  >
                    <FaPlus size={14} />
                    Add Service
                  </button>
                </div>

                {/* ADDONS LIST */}
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
                            handleArrayChange(index, "name", e.target.value, "addons")
                          }
                          className="w-full text-lg font-bold text-gray-800 outline-none border-b border-gray-200 focus:border-emerald-500 transition-colors"
                          placeholder="Service name"
                        />

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            <span className="text-emerald-600 font-black">₹</span>
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
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[90px]"
                          placeholder="Short description of this service..."
                        />
                      </div>
                    </div>
                  ))}

                  {/* EMPTY STATE */}
                  {formData.addons.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 space-y-3">
                      <FaHiking className="mx-auto text-5xl opacity-30" />
                      <p className="font-bold">No add-on services added</p>
                      <p className="text-sm">
                        Click “Add Service” to create optional offerings
                      </p>
                    </div>
                  )}
                </div>

                {fieldErrors.addons && (
                  <p className="text-red-500 text-sm mt-4">{fieldErrors.addons}</p>
                )}
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
