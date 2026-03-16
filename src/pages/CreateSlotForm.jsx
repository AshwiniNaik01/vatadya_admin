// import React, { useState, useEffect } from "react";
// import {
//   FiCalendar,
//   FiUsers,
//   FiAlertCircle,
//   FiCheck,
//   FiX,
//   FiMapPin,
//   FiLoader,
// } from "react-icons/fi";
// import { HiSparkles } from "react-icons/hi";
// import { addSlot, getAllSlots, updateSlot } from "../api/slotsApi";
// import { getTreks } from "../api/trekApi";
// import CustomSelect from "../components/form/CustomSelect";
// import InputField from "../components/form/InputField";
// import CustomDatePicker from "../components/form/CustomDatePicker";

// const CreateSlotForm = () => {
//   const [formData, setFormData] = useState({
//     trekId: "",
//     startDate: "",
//     endDate: "",
//     displayRange: "",
//     status: "AVBL",
//     totalSeats: 20,
//     bookedSeats: 0,
//   });

//   const [slots, setSlots] = useState([]);
//   const [treks, setTreks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [editingSlotId, setEditingSlotId] = useState(null);

//   useEffect(() => {
//     fetchSlots();
//     fetchTreks();
//   }, []);

//   const fetchSlots = async () => {
//     try {
//       const res = await getAllSlots();
//       setSlots(res.data || res || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchTreks = async () => {
//     try {
//       const res = await getTreks();
//       const data = res.data || res || [];
//       setTreks(
//         data.map((t) => ({
//           value: t._id,
//           label: t.title,
//         }))
//       );
//     } catch {
//       setError("Failed to fetch treks");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.trekId) {
//       setError("Please select a trek");
//       return;
//     }
//     if (!formData.startDate || !formData.endDate) {
//       setError("Please select both start and end dates");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Auto-generate displayRange from dates
//       const formatDateRange = (start, end) => {
//         const startDate = new Date(start);
//         const endDate = new Date(end);

//         const formatDay = (date) => {
//           const day = date.getDate();
//           const suffix = ["th", "st", "nd", "rd"][
//             day % 10 > 3 ? 0 : (((day % 100) - (day % 10) !== 10) * day) % 10
//           ];
//           const month = date.toLocaleDateString("en-US", { month: "short" });
//           return `${day}${suffix} ${month}`;
//         };

//         return `${formatDay(startDate)} - ${formatDay(endDate)}`;
//       };

//       const displayRange = formatDateRange(formData.startDate, formData.endDate);

//       const payload = {
//         ...formData,
//         displayRange,
//         totalSeats: Number(formData.totalSeats),
//         bookedSeats: Number(formData.bookedSeats),
//       };

//       editMode
//         ? await updateSlot(editingSlotId, payload)
//         : await addSlot(payload);

//       setSuccessMessage(editMode ? "Slot updated successfully!" : "Slot created successfully!");
//       setFormData({
//         trekId: "",
//         startDate: "",
//         endDate: "",
//         displayRange: "",
//         status: "AVBL",
//         totalSeats: 20,
//         bookedSeats: 0,
//       });
//       setEditMode(false);
//       fetchSlots();
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError(err?.message || "Operation failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto space-y-8">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//               Slot Management <HiSparkles className="text-amber-500" />
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Create and manage trek slots
//             </p>
//           </div>

//           <div className="bg-white px-5 py-3 rounded-xl border shadow-sm">
//             <span className="text-sm font-semibold text-gray-700">
//               {slots.length} Active Slots
//             </span>
//           </div>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
//             <FiAlertCircle className="text-red-600 mt-1" />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {successMessage && (
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//             <FiCheck className="text-blue-600 mt-1" />
//             <p className="text-sm text-blue-700">{successMessage}</p>
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl shadow border p-6 space-y-8"
//         >
//           <h2 className="text-xl font-semibold text-gray-800">
//             {editMode ? "Edit Slot" : "Create Slot"}
//           </h2>

//           {/* GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Date Picker (Full width) */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 Trek Date Range
//               </label>
//               <CustomDatePicker
//                 startDate={formData.startDate}
//                 endDate={formData.endDate}
//                 onChange={([start, end]) => {
//                   // Handle both Date objects and string values
//                   const formatDate = (date) => {
//                     if (!date) return "";
//                     if (typeof date === "string") return date.split("T")[0];
//                     if (date instanceof Date && !isNaN(date)) return date.toISOString().split("T")[0];
//                     return "";
//                   };

//                   setFormData(prev => ({
//                     ...prev,
//                     startDate: formatDate(start),
//                     endDate: formatDate(end),
//                   }));
//                 }}
//               />
//             </div>

//             {/* Trek Select */}
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-1">
//                 Trek
//               </label>
//               <CustomSelect
//                 options={treks}
//                 value={treks.find(t => t.value === formData.trekId) || null}
//                 onChange={(option) =>
//                   setFormData(prev => ({ ...prev, trekId: option?.value || "" }))
//                 }
//                 placeholder="Select trek"
//               />
//             </div>

//             {/* Total Seats */}
//             <InputField
//               label="Total Seats"
//               icon={FiUsers}
//               type="number"
//               value={formData.totalSeats}
//               onChange={handleInputChange}
//               name="totalSeats"
//               placeholder="Enter total seats"
//             />

//           </div>

//           {/* Action */}
//           <div className="pt-6 border-t flex justify-end">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition flex items-center gap-2 disabled:opacity-70"
//             >
//               {loading ? (
//                 <>
//                   <FiLoader className="animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <FiCheck />
//                   {editMode ? "Update Slot" : "Create Slot"}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

// };

// export default CreateSlotForm;

import { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  FiCalendar,
  FiUsers,
  FiAlertCircle,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { addSlot, getAllSlots, updateSlot } from "../api/slotsApi";
import { getTreks } from "../api/trekApi";
import CustomSelect from "../components/form/CustomSelect";
import CustomDatePicker from "../components/form/CustomDatePicker";
import InputField from "../components/form/InputField";

// ============================================================================
// VALIDATION SCHEMA - Using Yup for form validation
// ============================================================================
const slotValidationSchema = Yup.object().shape({
  // Trek ID validation - must select a trek
  // trekId: Yup.string().required("Please select a trek"),

  // // Start date validation - required and must be a valid date
  // startDate: Yup.date()
  //   .required("Start date is required")
  //   .typeError("Please enter a valid start date"),

  // // End date validation - must be after start date
  // endDate: Yup.date()
  //   .required("End date is required")
  //   .min(Yup.ref("startDate"), "End date must be after start date")
  //   .typeError("Please enter a valid end date"),

  // // Status validation - must be one of predefined values
  // status: Yup.string()
  //   .oneOf(["AVBL", "FULL", "CANCELLED"], "Invalid status")
  //   .required("Status is required"),

  // // Total seats validation - must be positive integer
  // totalSeats: Yup.number()
  //   .integer("Total seats must be a whole number")
  //   .min(1, "Total seats must be at least 1")
  //   .max(100, "Total seats cannot exceed 100")
  //   .required("Total seats is required"),

  // // Booked seats validation - cannot exceed total seats
  // bookedSeats: Yup.number()
  //   .integer("Booked seats must be a whole number")
  //   .min(0, "Booked seats cannot be negative")
  //   .test(
  //     "max-booked-seats",
  //     "Booked seats cannot exceed total seats",
  //     function (value) {
  //       const { totalSeats } = this.parent;
  //       return value <= totalSeats;
  //     },
  //   )
  //   .required("Booked seats is required"),

  // // Display range - auto-generated, optional validation
  // displayRange: Yup.string().nullable(),
});

// ============================================================================
// CREATE SLOT FORM COMPONENT
// ============================================================================
const CreateSlotForm = () => {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------

  // Form data state
  const [formData, setFormData] = useState({
    trekId: "",
    startDate: "",
    endDate: "",
    displayRange: "",
    status: "AVBL",
    totalSeats: 20,
    bookedSeats: 0,
  });

  // Slots list for display
  const [slots, setSlots] = useState([]);

  // Treks dropdown options
  const [treks, setTreks] = useState([]);

  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  // API error messages
  const [error, setError] = useState(null);

  // Success message after create/update
  const [successMessage, setSuccessMessage] = useState("");

  // Edit mode flag
  const [editMode, setEditMode] = useState(false);

  // ID of slot being edited
  const [editingSlotId, setEditingSlotId] = useState(null);

  // Validation errors from Yup schema
  const [validationErrors, setValidationErrors] = useState({});

  // ----------------------------------------------------------------------------
  // EFFECT HOOKS
  // ----------------------------------------------------------------------------

  /**
   * Fetch slots and treks on component mount
   */
  useEffect(() => {
    fetchSlots();
    fetchTreks();
  }, []);

  // ----------------------------------------------------------------------------
  // DATA FETCHING FUNCTIONS
  // ----------------------------------------------------------------------------

  /**
   * Fetch all slots from API
   */
  const fetchSlots = async () => {
    try {
      const res = await getAllSlots();
      setSlots(res.data || res || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  /**
   * Fetch all treks from API and format for dropdown
   */
  const fetchTreks = async () => {
    try {
      const res = await getTreks();
      const data = res.data || res || [];
      // Map treks to select options format
      setTreks(
        data.map((t) => ({
          value: t._id,
          label: t.title,
        })),
      );
    } catch (err) {
      console.error("Error fetching treks:", err);
      setError("Failed to fetch treks");
    }
  };

  // ----------------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------------

  /**
   * Handle input field changes
   * Updates form data and clears validation errors
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // Clear validation error for this field
    clearFieldError(name);
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
    if (error) {
      setError(null);
    }
  };

  /**
   * Format date range for display
   * Example: "5th Jan - 10th Jan"
   */
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatDay = (date) => {
      const day = date.getDate();
      const suffix = ["th", "st", "nd", "rd"][
        day % 10 > 3 ? 0 : (((day % 100) - (day % 10) !== 10) * day) % 10
      ];
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return `${day}${suffix} ${month}`;
    };

    return `${formatDay(startDate)} - ${formatDay(endDate)}`;
  };

  /**
   * Handle form submission with Yup validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Step 1: Validate form data using Yup schema
      await slotValidationSchema.validate(formData, {
        abortEarly: false,
      });

      // Step 2: Auto-generate displayRange from dates
      const displayRange = formatDateRange(
        formData.startDate,
        formData.endDate,
      );

      // Step 3: Prepare payload for API
      const payload = {
        ...formData,
        displayRange,
        totalSeats: Number(formData.totalSeats),
        bookedSeats: Number(formData.bookedSeats),
      };

      // Step 4: Call appropriate API based on mode
      if (editMode) {
        await updateSlot(editingSlotId, payload);
        setSuccessMessage("Slot updated successfully!");
      } else {
        await addSlot(payload);
        setSuccessMessage("Slot created successfully!");
      }

      // Step 5: Reset form and refresh slots list
      setFormData({
        trekId: "",
        startDate: "",
        endDate: "",
        displayRange: "",
        status: "AVBL",
        totalSeats: 20,
        bookedSeats: 0,
      });
      setEditMode(false);
      setEditingSlotId(null);
      fetchSlots();

      // Step 6: Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // Handle Yup validation errors
      if (err.name === "ValidationError") {
        // Create error object with field names as keys
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);

        // Scroll to top to see errors
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Handle API errors
        console.error("Submit error:", err);
        setError(err?.message || "Operation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper component to display validation errors
   */
  const ErrorMessage = ({ error }) =>
    error ? (
      <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
    ) : null;

  // ----------------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Slot Management <HiSparkles className="text-amber-500" />
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage trek slots
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl border shadow-sm">
            <span className="text-sm font-semibold text-gray-700">
              {slots.length} Active Slots
            </span>
          </div>
        </div>

        {/* API Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <FiAlertCircle className="text-red-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <FiCheck className="text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-blue-700">{successMessage}</p>
          </div>
        )}

        {/* Validation Errors Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-700 text-sm font-bold mb-2 flex items-center gap-2">
              <FiAlertCircle />
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
            </ul>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border p-6 space-y-8"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {editMode ? "Edit Slot" : "Create Slot"}
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trek Select */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Trek <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={treks}
                value={treks.find((t) => t.value === formData.trekId) || null}
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    trekId: option?.value || "",
                  }));
                  clearFieldError("trekId");
                }}
                placeholder="Select trek"
              />
              <ErrorMessage error={validationErrors.trekId} />
            </div>

            {/* Date Picker */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Trek Date Range <span className="text-red-500">*</span>
              </label>
              <CustomDatePicker
                startDate={formData.startDate}
                endDate={formData.endDate}
                onChange={([start, end]) => {
                  // Handle both Date objects and string values
                  const formatDate = (date) => {
                    if (!date) return "";
                    if (typeof date === "string") return date.split("T")[0];
                    if (date instanceof Date && !isNaN(date))
                      return date.toISOString().split("T")[0];
                    return "";
                  };

                  setFormData((prev) => ({
                    ...prev,
                    startDate: formatDate(start),
                    endDate: formatDate(end),
                  }));

                  clearFieldError("startDate");
                  clearFieldError("endDate");
                }}
              />
              <ErrorMessage
                error={validationErrors.startDate || validationErrors.endDate}
              />
            </div>

            {/* Total Seats */}
            <div>
              <InputField
                label="Total Seats"
                icon={FiUsers}
                type="number"
                value={formData.totalSeats}
                onChange={handleInputChange}
                name="totalSeats"
                placeholder="Enter total seats"
              />
              <ErrorMessage error={validationErrors.totalSeats} />
            </div>

            {/* Booked Seats */}
            <div>
              <InputField
                label="Booked Seats"
                icon={FiUsers}
                type="number"
                value={formData.bookedSeats}
                onChange={handleInputChange}
                name="bookedSeats"
                placeholder="Enter booked seats"
              />
              <ErrorMessage error={validationErrors.bookedSeats} />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              >
                <option value="AVBL">Available</option>
                <option value="FULL">Full</option>
                {/* <option value="CANCELLED">Cancelled</option> */}
              </select>
              <ErrorMessage error={validationErrors.status} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t flex justify-end gap-3">
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditingSlotId(null);
                  setFormData({
                    trekId: "",
                    startDate: "",
                    endDate: "",
                    displayRange: "",
                    status: "AVBL",
                    totalSeats: 20,
                    bookedSeats: 0,
                  });
                  setValidationErrors({});
                }}
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck />
                  {editMode ? "Update Slot" : "Create Slot"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlotForm;
