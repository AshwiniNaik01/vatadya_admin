// import { useState } from "react";
// import {
//   FiUser,
//   FiPhone,
//   FiMail,
//   FiCalendar,
//   FiMapPin,
//   FiUsers,
//   FiClock,
//   FiPlusCircle,
//   FiHeart,
//   FiAlertCircle,
//   FiCheckCircle,
// } from "react-icons/fi";

// import {
//   FaVenusMars,
//   FaTint,
//   FaUserShield,
//   FaBed,
//   FaIdCard,
// } from "react-icons/fa";

// // API Import
// import { createBooking } from "../api/bookingApi";

// // UI Components
// import InputField from "../components/form/InputField";
// import Checkbox from "../components/form/Checkbox";
// import RadioButton from "../components/form/RadioButton";
// import TagsInput from "../components/form/TagsInput";
// import ImageUploader from "../components/form/ImageUploader";
// import CustomSelect from "../components/form/CustomSelect";
// import CustomDatePicker from "../components/form/CustomDatePicker";
// import RichTextEditor from "../components/form/RichTextEditor";

// export default function TrekBookingForm() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     whatsappNumber: "",
//     email: "",
//     dateOfBirth: "",
//     gender: "",
//     pickupPoint: "",
//     bloodGroup: "",
//     medicalHistory: "",
//     emergencyNumber: "",
//     departureDate: "",
//     numberOfPeople: 1,
//     bookingTime: "",
//     needCoupleTent: false,
//     needPrivateRoom: false,
//   });

//   const [members, setMembers] = useState([{ name: "", whatsapp: "" }]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [bookingId, setBookingId] = useState("");

//   const genders = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//     { value: "Other", label: "Other" },
//   ];

//   const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

//   // Handle form field changes
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Clear error when user types
//     if (apiError) {
//       setApiError("");
//     }
//   };

//   // Handle checkbox changes
//   const handleCheckboxChange = (field) => {
//     setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   // Add member
//   const addMember = () => {
//     setMembers([...members, { name: "", whatsapp: "" }]);
//   };

//   // Remove member
//   const removeMember = (index) => {
//     setMembers(members.filter((_, i) => i !== index));
//   };

//   // Handle member change
//   const handleMemberChange = (index, field, value) => {
//     const updatedMembers = [...members];
//     updatedMembers[index][field] = value;
//     setMembers(updatedMembers);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setIsLoading(true);
//     setApiError("");
//     setSuccessMessage("");

//     try {
//       // Prepare booking data
//       const bookingData = {
//         fullName: formData.fullName,
//         whatsappNumber: formData.whatsappNumber,
//         email: formData.email,
//         dateOfBirth: formData.dateOfBirth,
//         gender: formData.gender,
//         pickupPoint: formData.pickupPoint,
//         bloodGroup: formData.bloodGroup,
//         medicalHistory: formData.medicalHistory,
//         emergencyNumber: formData.emergencyNumber,
//         departureDate: formData.departureDate,
//         numberOfPeople: parseInt(formData.numberOfPeople),
//         bookingTime: formData.bookingTime,
//         needCoupleTent: formData.needCoupleTent,
//         needPrivateRoom: formData.needPrivateRoom,
//         additionalMembers: members.filter((m) => m.name && m.whatsapp),
//       };

//       // Call API
//       const response = await createBooking(bookingData);

//       // Handle success
//       setSuccessMessage("Booking created successfully!");
//       setBookingId(response.booking?._id || response._id || "N/A");

//       // Reset form
//       setFormData({
//         fullName: "",
//         whatsappNumber: "",
//         email: "",
//         dateOfBirth: "",
//         gender: "",
//         pickupPoint: "",
//         bloodGroup: "",
//         medicalHistory: "",
//         emergencyNumber: "",
//         departureDate: "",
//         numberOfPeople: 1,
//         bookingTime: "",
//         needCoupleTent: false,
//         needPrivateRoom: false,
//       });
//       setMembers([{ name: "", whatsapp: "" }]);

//       // Scroll to top to see success message
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (error) {
//       console.error("Booking error:", error);

//       if (error.message) {
//         setApiError(error.message);
//       } else if (error.error) {
//         setApiError(error.error);
//       } else {
//         setApiError("Failed to create booking. Please try again.");
//       }

//       // Scroll to top to see error message
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-green-700">
//             Book Your Trek Adventure
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Fill in your details to confirm your TrekVede booking
//           </p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-2xl">
//             <div className="flex items-center gap-3">
//               <FiCheckCircle className="text-green-600 text-2xl" />
//               <div>
//                 <p className="text-green-700 font-semibold">{successMessage}</p>
//                 {bookingId && (
//                   <p className="text-green-600 text-sm mt-1">
//                     Your Booking ID:{" "}
//                     <span className="font-bold">{bookingId}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {apiError && (
//           <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl">
//             <div className="flex items-center gap-3">
//               <FiAlertCircle className="text-red-600 text-2xl" />
//               <p className="text-red-700 font-semibold">{apiError}</p>
//             </div>
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* ID - Display only if booking created */}
//           {bookingId && (
//             <div className="md:col-span-2">
//               <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//                 Booking ID
//               </label>
//               <input
//                 type="text"
//                 value={bookingId}
//                 disabled
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-semibold text-green-700"
//               />
//             </div>
//           )}

//           {/* Name */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Full Name *
//             </label>
//             <div className="relative">
//               <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(e) => handleChange("fullName", e.target.value)}
//                 placeholder="Your full name"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* WhatsApp */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               WhatsApp Number *
//             </label>
//             <div className="relative">
//               <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) => handleChange("whatsappNumber", e.target.value)}
//                 placeholder="+91 XXXXX XXXXX"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Email Address *
//             </label>
//             <div className="relative">
//               <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 placeholder="you@example.com"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* DOB */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Date of Birth *
//             </label>
//             <div className="relative">
//               <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 value={formData.dateOfBirth}
//                 onChange={(e) => handleChange("dateOfBirth", e.target.value)}
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Gender *
//             </label>
//             <div className="relative">
//               <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <select
//                 value={formData.gender}
//                 onChange={(e) => handleChange("gender", e.target.value)}
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
//               >
//                 <option value="">Select Gender</option>
//                 {genders.map((g) => (
//                   <option key={g.value} value={g.value}>
//                     {g.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Pickup Point */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Pickup Point *
//             </label>
//             <div className="relative">
//               <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={formData.pickupPoint}
//                 onChange={(e) => handleChange("pickupPoint", e.target.value)}
//                 placeholder="City / Location"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Blood Group */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Blood Group *
//             </label>
//             <div className="relative">
//               <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <select
//                 value={formData.bloodGroup}
//                 onChange={(e) => handleChange("bloodGroup", e.target.value)}
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
//               >
//                 <option value="">Select Blood Group</option>
//                 {bloodGroups.map((bg) => (
//                   <option key={bg} value={bg}>
//                     {bg}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Emergency Number */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Alternate / Emergency Number *
//             </label>
//             <div className="relative">
//               <FiAlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="tel"
//                 value={formData.emergencyNumber}
//                 onChange={(e) =>
//                   handleChange("emergencyNumber", e.target.value)
//                 }
//                 placeholder="+91 XXXXX XXXXX"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Departure Date */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Departure Date *
//             </label>
//             <div className="relative">
//               <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 value={formData.departureDate}
//                 onChange={(e) => handleChange("departureDate", e.target.value)}
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* No of People */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Number of People *
//             </label>
//             <div className="relative">
//               <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="number"
//                 value={formData.numberOfPeople}
//                 onChange={(e) => handleChange("numberOfPeople", e.target.value)}
//                 min="1"
//                 required
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Booking Time */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Booking Time
//             </label>
//             <div className="relative">
//               <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="time"
//                 value={formData.bookingTime}
//                 onChange={(e) => handleChange("bookingTime", e.target.value)}
//                 disabled={isLoading}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Medical History */}
//           <div className="w-full md:col-span-2">
//             <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//               Medical History
//             </label>
//             <textarea
//               value={formData.medicalHistory}
//               onChange={(e) => handleChange("medicalHistory", e.target.value)}
//               placeholder="Any medical conditions we should know about..."
//               rows="4"
//               disabled={isLoading}
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed resize-none"
//             />
//           </div>

//           {/* Need Couple Tent */}
//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               id="coupleTent"
//               checked={formData.needCoupleTent}
//               onChange={() => handleCheckboxChange("needCoupleTent")}
//               disabled={isLoading}
//               className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//             <label
//               htmlFor="coupleTent"
//               className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"
//             >
//               <FaBed className="text-gray-400" />
//               Need Couple Tent?
//             </label>
//           </div>

//           {/* Need Private Room */}
//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               id="privateRoom"
//               checked={formData.needPrivateRoom}
//               onChange={() => handleCheckboxChange("needPrivateRoom")}
//               disabled={isLoading}
//               className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//             <label
//               htmlFor="privateRoom"
//               className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"
//             >
//               <FaBed className="text-gray-400" />
//               Need Private Room?
//             </label>
//           </div>
//         </form>

//         {/* Additional Members */}
//         <div className="mt-10">
//           <h2 className="text-sm font-bold text-gray-700 mb-4">
//             Additional Members
//           </h2>

//           {members.map((member, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
//             >
//               <div className="relative">
//                 <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={member.name}
//                   onChange={(e) =>
//                     handleMemberChange(index, "name", e.target.value)
//                   }
//                   placeholder="Member Name"
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>

//               <div className="relative">
//                 <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="tel"
//                   value={member.whatsapp}
//                   onChange={(e) =>
//                     handleMemberChange(index, "whatsapp", e.target.value)
//                   }
//                   placeholder="WhatsApp Number"
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>

//               {members.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeMember(index)}
//                   disabled={isLoading}
//                   className="text-red-600 font-medium hover:underline self-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addMember}
//             disabled={isLoading}
//             className="text-green-700 font-semibold hover:underline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <FiPlusCircle className="text-lg" />
//             Add Another Member
//           </button>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="w-full flex items-center justify-center gap-2 mt-10 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Creating Booking...
//             </>
//           ) : (
//             <>
//               <FiCheckCircle className="text-xl" />
//               Confirm Booking
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import * as Yup from "yup";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiPlusCircle,
  FiHeart,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  FaVenusMars,
  FaTint,
  FaUserShield,
  FaBed,
  FaIdCard,
} from "react-icons/fa";

// API Import
import { createBooking } from "../api/bookingApi";

// UI Components
// import InputField from "../components/form/InputField";
// import Checkbox from "../components/form/Checkbox";
// import RadioButton from "../components/form/RadioButton";
// import TagsInput from "../components/form/TagsInput";
// import ImageUploader from "../components/form/ImageUploader";
// import CustomSelect from "../components/form/CustomSelect";
// import CustomDatePicker from "../components/form/CustomDatePicker";
// import RichTextEditor from "../components/form/RichTextEditor";

// ============================================================================
// VALIDATION SCHEMA - Using Yup for form validation
// ============================================================================

// Member validation schema (for additional members)
const memberSchema = Yup.object().shape({
  // name: Yup.string()
  //   .nullable()
  //   .test(
  //     "name-required-if-whatsapp",
  //     "Member name is required when WhatsApp is provided",
  //     function (value) {
  //       const { whatsapp } = this.parent;
  //       if (whatsapp && whatsapp.trim().length > 0) {
  //         return value && value.trim().length >= 2;
  //       }
  //       return true;
  //     },
  //   )
  //   .test(
  //     "name-min-length",
  //     "Member name must be at least 2 characters",
  //     function (value) {
  //       if (value && value.trim().length > 0) {
  //         return value.trim().length >= 2;
  //       }
  //       return true;
  //     },
  //   )
  //   .test(
  //     "name-max-length",
  //     "Member name must not exceed 100 characters",
  //     function (value) {
  //       if (value && value.trim().length > 0) {
  //         return value.trim().length <= 100;
  //       }
  //       return true;
  //     },
  //   ),
  // whatsapp: Yup.string()
  //   .nullable()
  //   .test(
  //     "whatsapp-required-if-name",
  //     "WhatsApp number is required when name is provided",
  //     function (value) {
  //       const { name } = this.parent;
  //       if (name && name.trim().length > 0) {
  //         return value && /^[0-9]{10}$/.test(value);
  //       }
  //       return true;
  //     },
  //   )
  //   .test(
  //     "whatsapp-format",
  //     "WhatsApp number must be exactly 10 digits",
  //     function (value) {
  //       if (value && value.trim().length > 0) {
  //         return /^[0-9]{10}$/.test(value);
  //       }
  //       return true;
  //     },
  //   ),
});

// Main booking form validation schema
const bookingValidationSchema = Yup.object().shape({
  // Full name validation
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Full name should only contain letters and spaces",
    )
    .required("Full name is required"),

  // WhatsApp number validation - 10 digit Indian number
  whatsappNumber: Yup.string()
    .trim()
    .matches(
      /^[6-9][0-9]{9}$/,
      "WhatsApp number must be 10 digits and start with 6, 7, 8, or 9",
    )
    .required("WhatsApp number is required"),

  // Email validation
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .lowercase()
    .required("Email is required"),

  // Date of birth validation - must be at least 10 years old
  dateOfBirth: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      "You must be at least 10 years old",
    )
    .required("Date of birth is required")
    .typeError("Please enter a valid date"),

  // Gender validation
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection")
    .required("Gender is required"),

  // Pickup point validation
  pickupPoint: Yup.string()
    .trim()
    .min(3, "Pickup point must be at least 3 characters")
    .max(200, "Pickup point must not exceed 200 characters")
    .required("Pickup point is required"),

  // Blood group validation
  bloodGroup: Yup.string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      "Invalid blood group",
    )
    .required("Blood group is required"),

  // Medical history validation - optional but recommended
  medicalHistory: Yup.string()
    .max(1000, "Medical history must not exceed 1000 characters")
    .nullable(),

  // Emergency number validation
  emergencyNumber: Yup.string()
    .trim()
    .matches(
      /^[6-9][0-9]{9}$/,
      "Emergency number must be exactly 10 digits and start with 6, 7, 8, or 9",
    )
    .required("Emergency number is required"),

  // Departure date validation - must be future date
  departureDate: Yup.date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Departure date must be today or in the future",
    )
    .required("Departure date is required")
    .typeError("Please enter a valid date"),

  // Number of people validation
  numberOfPeople: Yup.number()
    .integer("Number of people must be a whole number")
    .min(1, "At least 1 person is required")
    .max(50, "Maximum 50 people allowed per booking")
    .required("Number of people is required")
    .typeError("Please enter a valid number"),

  // Booking time validation - optional
  bookingTime: Yup.string().nullable(),

  // Couple tent checkbox - boolean
  needCoupleTent: Yup.boolean(),

  // Private room checkbox - boolean
  needPrivateRoom: Yup.boolean(),
});

// ============================================================================
// TREK BOOKING FORM COMPONENT
// ============================================================================
export default function TrekBookingForm() {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------

  // Main form data state
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    pickupPoint: "",
    bloodGroup: "",
    medicalHistory: "",
    emergencyNumber: "",
    departureDate: "",
    numberOfPeople: 1,
    bookingTime: "",
    needCoupleTent: false,
    needPrivateRoom: false,
  });

  // Additional members array
  const [members, setMembers] = useState([{ name: "", whatsapp: "" }]);

  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);

  // API error messages
  const [apiError, setApiError] = useState("");

  // Success message after booking
  const [successMessage, setSuccessMessage] = useState("");

  // Booking ID returned from API
  const [bookingId, setBookingId] = useState("");

  // Validation errors from Yup schema
  const [validationErrors, setValidationErrors] = useState({});

  // Member validation errors
  const [memberErrors, setMemberErrors] = useState({});

  // Dropdown options
  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // ----------------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------------

  /**
   * Handle form field changes
   * Updates form data state and clears validation errors
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    clearFieldError(field);
  };

  /**
   * Handle checkbox changes (couple tent, private room)
   */
  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /**
   * Add a new member to the additional members list
   */
  const addMember = () => {
    setMembers([...members, { name: "", whatsapp: "" }]);
  };

  /**
   * Remove a member from the additional members list
   */
  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));

    // Clear validation errors for this member
    setMemberErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  /**
   * Handle member field changes
   */
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);

    // Clear validation error for this member field
    if (memberErrors[index]?.[field]) {
      setMemberErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  /**
   * Clear validation error for a specific field
   */
  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    if (apiError) {
      setApiError("");
    }
  };

  /**
   * Handle form submission with Yup validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");
    setValidationErrors({});
    setMemberErrors({});

    try {
      // Step 1: Validate main form data using Yup schema
      await bookingValidationSchema.validate(formData, {
        abortEarly: false,
      });

      // Step 2: Validate additional members
      const validMembers = members.filter((m) => m.name || m.whatsapp);
      const memberValidationErrors = {};

      for (let i = 0; i < validMembers.length; i++) {
        try {
          await memberSchema.validate(validMembers[i], { abortEarly: false });
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            memberValidationErrors[i] = {};
            error.inner.forEach((err) => {
              memberValidationErrors[i][err.path] = err.message;
            });
          }
        }
      }

      // If there are member validation errors, throw them
      if (Object.keys(memberValidationErrors).length > 0) {
        setMemberErrors(memberValidationErrors);
        throw new Error("Please fix validation errors in additional members");
      }

      // Step 3: Prepare booking data for API
      const bookingData = {
        fullName: formData.fullName.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        pickupPoint: formData.pickupPoint.trim(),
        bloodGroup: formData.bloodGroup,
        medicalHistory: formData.medicalHistory.trim(),
        emergencyNumber: formData.emergencyNumber.trim(),
        departureDate: formData.departureDate,
        numberOfPeople: parseInt(formData.numberOfPeople),
        bookingTime: formData.bookingTime,
        needCoupleTent: formData.needCoupleTent,
        needPrivateRoom: formData.needPrivateRoom,
        additionalMembers: members.filter((m) => m.name && m.whatsapp),
      };

      // Step 4: Call API
      const response = await createBooking(bookingData);

      // Step 5: Handle success
      setSuccessMessage("Booking created successfully!");
      setBookingId(response.booking?._id || response._id || "N/A");

      // Step 6: Reset form
      setFormData({
        fullName: "",
        whatsappNumber: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        pickupPoint: "",
        bloodGroup: "",
        medicalHistory: "",
        emergencyNumber: "",
        departureDate: "",
        numberOfPeople: 1,
        bookingTime: "",
        needCoupleTent: false,
        needPrivateRoom: false,
      });
      setMembers([{ name: "", whatsapp: "" }]);

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      // Handle Yup validation errors
      if (error.name === "ValidationError") {
        // Create error object with field names as keys
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);

        // Scroll to top to see errors
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Handle API errors
        console.error("Booking error:", error);

        if (error.message) {
          setApiError(error.message);
        } else if (error.error) {
          setApiError(error.error);
        } else {
          setApiError("Failed to create booking. Please try again.");
        }

        // Scroll to top to see error message
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper component to display validation errors
   */
  const ErrorMessage = ({ error }) =>
    error ? (
      <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
        <FiAlertCircle className="text-sm" />
        {error}
      </p>
    ) : null;

  // ----------------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            Book Your Trek Adventure
          </h1>
          <p className="text-gray-500 mt-2">
            Fill in your details to confirm your Vatadya booking
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-2xl">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-green-600 text-2xl" />
              <div>
                <p className="text-green-700 font-semibold">{successMessage}</p>
                {bookingId && (
                  <p className="text-green-600 text-sm mt-1">
                    Your Booking ID:{" "}
                    <span className="font-bold">{bookingId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-red-600 text-2xl" />
              <p className="text-red-700 font-semibold">{apiError}</p>
            </div>
          </div>
        )}

        {/* Validation Errors Summary */}
        {(Object.keys(validationErrors).length > 0 ||
          Object.keys(memberErrors).length > 0) && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 text-xl mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-700 text-sm font-bold mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field} className="text-amber-600 text-xs">
                        <span className="font-semibold capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}:
                        </span>{" "}
                        {error}
                      </li>
                    ))}
                    {Object.entries(memberErrors).map(([index, errors]) =>
                      Object.entries(errors).map(([field, error]) => (
                        <li
                          key={`member-${index}-${field}`}
                          className="text-amber-600 text-xs"
                        >
                          <span className="font-semibold">
                            Member {parseInt(index) + 1} - {field}:
                          </span>{" "}
                          {error}
                        </li>
                      )),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.fullName
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.fullName} />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="XXXXXXXXXX"
                maxLength="10"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.whatsappNumber
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.whatsappNumber} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.email
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.email} />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 10),
                  )
                    .toISOString()
                    .split("T")[0]
                }
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.dateOfBirth
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.dateOfBirth} />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.gender
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <ErrorMessage error={validationErrors.gender} />
          </div>

          {/* Pickup Point */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Pickup Point <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.pickupPoint}
                onChange={(e) => handleChange("pickupPoint", e.target.value)}
                placeholder="e.g., Kashmiri Gate, Delhi"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.pickupPoint
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.pickupPoint} />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleChange("bloodGroup", e.target.value)}
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.bloodGroup
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <ErrorMessage error={validationErrors.bloodGroup} />
          </div>

          {/* Emergency Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Alternate / Emergency Number{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiAlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.emergencyNumber}
                onChange={(e) =>
                  handleChange("emergencyNumber", e.target.value)
                }
                placeholder="XXXXXXXXXX"
                maxLength="10"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.emergencyNumber
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.emergencyNumber} />
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Departure Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => handleChange("departureDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.departureDate
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.departureDate} />
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Number of People <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.numberOfPeople}
                onChange={(e) => handleChange("numberOfPeople", e.target.value)}
                min="1"
                max="50"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.numberOfPeople
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-green-500"
                  }`}
              />
            </div>
            <ErrorMessage error={validationErrors.numberOfPeople} />
          </div>

          {/* Booking Time */}
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Booking Time
            </label>
            <div className="relative">
              <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                value={formData.bookingTime}
                onChange={(e) => handleChange("bookingTime", e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="w-full md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
              Medical History
            </label>
            <textarea
              value={formData.medicalHistory}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
              placeholder="Any medical conditions we should know about..."
              rows="4"
              disabled={isLoading}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed resize-none ${validationErrors.medicalHistory
                ? "border-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-200 focus:border-green-500"
                }`}
            />
            <ErrorMessage error={validationErrors.medicalHistory} />
          </div>

          {/* Need Couple Tent */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="coupleTent"
              checked={formData.needCoupleTent}
              onChange={() => handleCheckboxChange("needCoupleTent")}
              disabled={isLoading}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="coupleTent"
              className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"
            >
              <FaBed className="text-gray-400" />
              Need Couple Tent?
            </label>
          </div>

          {/* Need Private Room */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="privateRoom"
              checked={formData.needPrivateRoom}
              onChange={() => handleCheckboxChange("needPrivateRoom")}
              disabled={isLoading}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="privateRoom"
              className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"
            >
              <FaBed className="text-gray-400" />
              Need Private Room?
            </label>
          </div>
        </form>

        {/* Additional Members */}
        <div className="mt-10">
          <h2 className="text-sm font-bold text-gray-700 mb-4">
            Additional Members
          </h2>

          {members.map((member, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      placeholder="Member Name"
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${memberErrors[index]?.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                        }`}
                    />
                  </div>
                  {memberErrors[index]?.name && (
                    <ErrorMessage error={memberErrors[index].name} />
                  )}
                </div>

                <div>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={member.whatsapp}
                      onChange={(e) =>
                        handleMemberChange(index, "whatsapp", e.target.value)
                      }
                      placeholder="WhatsApp Number"
                      maxLength="10"
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${memberErrors[index]?.whatsapp
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                        }`}
                    />
                  </div>
                  {memberErrors[index]?.whatsapp && (
                    <ErrorMessage error={memberErrors[index].whatsapp} />
                  )}
                </div>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    disabled={isLoading}
                    className="text-red-600 font-medium hover:underline self-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMember}
            disabled={isLoading}
            className="text-green-700 font-semibold hover:underline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlusCircle className="text-lg" />
            Add Another Member
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 mt-10 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating Booking...
            </>
          ) : (
            <>
              <FiCheckCircle className="text-xl" />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
