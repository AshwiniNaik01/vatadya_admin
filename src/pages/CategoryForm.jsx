// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { createCategory, getCategoryById, updateCategory } from "../api/trekCategoriesApi";
// import { FaLayerGroup, FaImage, FaCheckCircle, FaTimesCircle, FaChevronRight, FaInfoCircle, FaTags, FaChartLine } from "react-icons/fa";
// import InputField from "../components/form/InputField";
// import ImageUploader from "../components/form/ImageUploader";
// import Checkbox from "../components/form/Checkbox";
// import CustomSelect from "../components/form/CustomSelect";
// import RichTextEditor from "../components/form/RichTextEditor";
// import TagsInput from "../components/form/TagsInput";

// /* Standardized Category Form */
// export default function CategoryForm() {
//     const [formData, setFormData] = useState({
//         categoryId: "",
//         title: "",
//         description: "",
//         tags: [], // Using array for UI
//         difficulty: "Easy",
//         catImage: "",
//         isActive: true,
//     });

//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const isEditMode = !!id;

//     const difficulties = [
//         { value: "Easy", label: "Easy" },
//         { value: "Moderate", label: "Moderate" },
//         { value: "Challenging", label: "Challenging" },
//         { value: "Difficult", label: "Difficult" },
//         { value: "Expert", label: "Expert" },
//     ];

//     useEffect(() => {
//         if (isEditMode) {
//             const fetchCategory = async () => {
//                 try {
//                     setLoading(true);
//                     const data = await getCategoryById(id);
//                     setFormData({
//                         categoryId: data.categoryId || "",
//                         title: data.title || "",
//                         description: data.description || "",
//                         tags: data.tag ? data.tag.split(",").map(t => t.trim()) : [],
//                         difficulty: data.difficulty || "Easy",
//                         catImage: data.catImage || "",
//                         isActive: data.isActive ?? true,
//                     });
//                     setLoading(false);
//                 } catch (err) {
//                     console.error("Fetch error:", err);
//                     setErrorMessage("Failed to load category details.");
//                     setLoading(false);
//                 }
//             };
//             fetchCategory();
//         }
//     }, [id]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrorMessage("");

//         try {
//             // Use FormData to match Multer expectation
//             const data = new FormData();

//             // Append all fields except the image and tags first
//             const { catImage, tags, ...otherData } = formData;
//             Object.keys(otherData).forEach(key => {
//                 data.append(key, otherData[key]);
//             });

//             // Handle tags: joining into a comma-separated string to match schema
//             data.append("tag", tags.join(", "));

//             // Append the image file with the field name expected by backend: 'TrekCategoryImage'
//             if (catImage) {
//                 // If it's a data URL (from imageCompression), we should convert it back to a file or handled as is if backend supports
//                 // But usually, ImageUploader provides a Base64/DataURL.
//                 // If the backend expects a multi-part file, we might need to blob it.
//                 data.append("TrekCategoryImage", catImage);
//             }

//             if (isEditMode) {
//                 await updateCategory(id, data);
//                 alert("Category updated successfully!");
//             } else {
//                 await createCategory(data);
//                 alert("Category created successfully!");
//             }
//             navigate("/categories/manage");
//         } catch (err) {
//             console.error("Submission error:", err);
//             setErrorMessage(err.message || "An error occurred while saving category.");
//             alert(`Error: ${err.message || "Failed to save category"}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const SectionTitle = ({ icon: Icon, title }) => (
//         <div className="flex items-center gap-2 mb-6 border-b pb-2">
//             <Icon className="text-blue-600 text-xl" />
//             <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
//         </div>
//     );

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
//                             <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
//                                 <FaLayerGroup />
//                             </div>
//                             {isEditMode ? "Update Category" : "Create Category"}
//                         </h1>
//                         <p className="text-gray-500 font-medium mt-1">
//                             {isEditMode ? `ID: ${id}` : "Define a new category for your trekking expeditions"}
//                         </p>
//                     </div>
//                 </header>

//                 <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                     <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50/50 p-8 md:p-10 space-y-10">

//                         {/* Section: Basic Metadata */}
//                         <div>
//                             <SectionTitle icon={FaInfoCircle} title="Primary Details" />
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 <InputField
//                                     label="Category Unique ID"
//                                     placeholder="e.g., beginners, high-altitude"
//                                     value={formData.categoryId}
//                                     onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
//                                 />
//                                 <InputField
//                                     label="Category Title"
//                                     placeholder="e.g., Easy Walks"
//                                     value={formData.title}
//                                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                                 />
//                                 <div className="md:col-span-2 space-y-2">
//                                     <label className="block text-sm font-bold text-gray-700 ml-1">Brief Description</label>
//                                     <RichTextEditor
//                                         value={formData.description}
//                                         onChange={(content) => setFormData({ ...formData, description: content })}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Section: Filtering & Logic */}
//                         <div className="pt-2">
//                             <SectionTitle icon={FaTags} title="Expedition Logic & Media" />
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                                 <div className="space-y-6">
//                                     <TagsInput
//                                         label="Season Tags"
//                                         placeholder="Add tag (e.g. Summer, Monsoon)"
//                                         value={formData.tags}
//                                         onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
//                                     />
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-bold text-gray-700 ml-1">Ideal Difficulty</label>
//                                         <CustomSelect
//                                             options={difficulties}
//                                             value={difficulties.find(d => d.value === formData.difficulty)}
//                                             onChange={(val) => setFormData({ ...formData, difficulty: val.value })}
//                                         />
//                                     </div>
//                                     <div className="pt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
//                                         <Checkbox
//                                             id="cat-active"
//                                             label="Publicly Active Category"
//                                             checked={formData.isActive}
//                                             onChange={(val) => setFormData({ ...formData, isActive: val })}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-6">
//                                     <ImageUploader
//                                         label="Category Cover Image"
//                                         value={formData.catImage}
//                                         onChange={(img) => setFormData({ ...formData, catImage: img })}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Footer Actions */}
//                         <div className="flex items-center justify-between pt-8 border-t border-gray-100">
//                             <button
//                                 type="button"
//                                 onClick={() => navigate("/categories/manage")}
//                                 className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className={`flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                             >
//                                 {loading ? "Proccessing..." : isEditMode ? "Update Category" : "Save Category"}
//                                 <FaChevronRight size={12} />
//                             </button>
//                         </div>
//                     </div>
//                 </form>

//                 {errorMessage && (
//                     <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm flex items-center gap-2">
//                         <FaTimesCircle /> {errorMessage}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../api/trekCategoriesApi";
import {
  FaLayerGroup,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaInfoCircle,
  FaTags,
  FaChartLine,
} from "react-icons/fa";
import InputField from "../components/form/InputField";
import ImageUploader from "../components/form/ImageUploader";
import Checkbox from "../components/form/Checkbox";
import CustomSelect from "../components/form/CustomSelect";
import RichTextEditor from "../components/form/RichTextEditor";
import TagsInput from "../components/form/TagsInput";

// ============================================================================
// VALIDATION SCHEMA - Using Yup for form validation
// ============================================================================
const categoryValidationSchema = Yup.object().shape({
  // Category ID validation - must be unique, lowercase, no spaces
  // categoryId: Yup.string()
  //   .min(3, "Category ID must be at least 3 characters")
  //   .max(50, "Category ID must not exceed 50 characters")
  //   .matches(
  //     /^[a-z0-9-]+$/,
  //     "Category ID must be lowercase letters, numbers, and hyphens only (no spaces)",
  //   )
  //   .required("Category ID is required"),

  // // Title validation - display name for the category
  // title: Yup.string()
  //   .min(3, "Title must be at least 3 characters")
  //   .max(100, "Title must not exceed 100 characters")
  //   .required("Title is required"),

  // // Description validation - rich text content
  // description: Yup.string()
  //   .min(10, "Description must be at least 10 characters")
  //   .max(5000, "Description must not exceed 5000 characters")
  //   .required("Description is required"),

  // // Tags validation - array of season/characteristic tags
  // tags: Yup.array()
  //   .of(Yup.string())
  //   .min(1, "At least one tag is required")
  //   .max(10, "Maximum 10 tags allowed"),

  // // Difficulty validation - must be one of predefined values
  // difficulty: Yup.string()
  //   .oneOf(
  //     ["Easy", "Moderate", "Challenging", "Difficult", "Expert"],
  //     "Invalid difficulty level",
  //   )
  //   .required("Difficulty level is required"),

  // // Category image validation - optional but recommended
  // catImage: Yup.string().nullable().notRequired(),

  // // Active status validation
  // isActive: Yup.boolean().required("Active status is required"),
});

// ============================================================================
// CATEGORY FORM COMPONENT
// ============================================================================
/* Standardized Category Form */
export default function CategoryForm() {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------

  // Form data state - stores all category field values
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    tags: [], // Array of tags for UI
    difficulty: "Easy",
    catImage: "",
    isActive: true,
  });

  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  // Error messages from API or validation
  const [errorMessage, setErrorMessage] = useState("");

  // Validation errors from Yup schema
  const [validationErrors, setValidationErrors] = useState({});

  // Navigation and route params
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id; // Boolean flag for edit vs create mode

  // Difficulty level options for select dropdown
  const difficulties = [
    { value: "Easy", label: "Easy" },
    { value: "Moderate", label: "Moderate" },
    { value: "Challenging", label: "Challenging" },
    { value: "Difficult", label: "Difficult" },
    { value: "Expert", label: "Expert" },
  ];

  // ----------------------------------------------------------------------------
  // EFFECT HOOKS
  // ----------------------------------------------------------------------------

  /**
   * Fetch existing category data when in edit mode
   * Runs once when component mounts or when id changes
   */
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const data = await getCategoryById(id);

          // Populate form with existing data
          setFormData({
            categoryId: data.categoryId || "",
            title: data.title || "",
            description: data.description || "",
            tags: data.tag ? data.tag.split(",").map((t) => t.trim()) : [],
            difficulty: data.difficulty || "Easy",
            catImage: data.catImage
              ? (data.catImage.cdnUrl || data.catImage.fullS3URL || data.catImage || null)
              : null,
            isActive: data.isActive ?? true,
          });
          setLoading(false);
        } catch (err) {
          console.error("Fetch error:", err);
          setErrorMessage("Failed to load category details.");
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode]);

  // ----------------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------------

  /**
   * Handle form submission with Yup validation
   * Validates all fields before making API call
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setValidationErrors({});

    try {
      // Step 1: Validate form data (optional check for schema defined)
      if (categoryValidationSchema.validate) {
        await categoryValidationSchema.validate(formData, { abortEarly: false });
      }

      // Step 2: Prepare FormData for API
      const data = new FormData();

      // System fields to EXCLUDE from the payload
      const exclude = ["_id", "createdAt", "updatedAt", "__v", "trekCount", "id"];

      Object.keys(formData).forEach((key) => {
        // Skip excluded fields and special ones
        if (exclude.includes(key)) return;
        if (key === "catImage" || key === "tags") return;

        const value = formData[key];
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Step 3: Handle tags - join array into comma-separated string
      if (Array.isArray(formData.tags) && formData.tags.length > 0) {
        data.append("tag", formData.tags.join(", "));
      }

      // Step 4: Handle image file
      // ImageUploader now returns either:
      //   - a raw File object (new upload)
      //   - a string URL (existing image loaded in edit mode)
      //   - null (no image)
      const catImageValue = formData.catImage;
      if (catImageValue instanceof File) {
        // New binary file — rename so Multer can identify extension
        const ext = catImageValue.type?.split("/")?.[1] || "jpg";
        const properName = `category_image.${ext === "jpeg" ? "jpg" : ext}`;
        const properFile = new File([catImageValue], properName, { type: catImageValue.type });
        data.append("TrekCategoryImage", properFile);
        console.log(`  [FILE appended] TrekCategoryImage: ${properName}, ${properFile.size}b`);
      } else if (catImageValue && catImageValue.file instanceof File) {
        // Legacy fallback: {file: File, preview: ..., url: ...}
        data.append("TrekCategoryImage", catImageValue.file);
      }
      // If catImageValue is a string URL (existing image), we don't send it— backend keeps existing.
      // Note: If no new file is provided, we don't send the catImage field at all.
      // This prevents Multer "Unexpected field" errors on some backend configurations.

      // === ENHANCED DEBUGGING ===
      console.group("🔍 CategoryForm handleSubmit");
      console.group("📋 Raw formData state:");
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        const type = Array.isArray(val) ? "Array" : typeof val;
        console.log(`  [${type}] ${key}:`, val);
      });
      console.groupEnd();
      console.group("📦 Exact fields being sent to backend:");
      const sentFields = [];
      for (let [key, value] of data.entries()) {
        sentFields.push(key);
        if (value instanceof File) {
          console.log(`  [FILE] ${key}: name="${value.name}", size=${value.size}b, type="${value.type}"`);
        } else {
          console.log(`  [TEXT] ${key}: "${value}"`);
        }
      }
      console.log("📤 All field names sent to backend:", sentFields);
      console.groupEnd();
      console.groupEnd();
      // === END DEBUGGING ===

      // Step 5: API Call
      let response;
      if (isEditMode) {
        response = await updateCategory(id, data);
        alert("Category updated successfully!");
      } else {
        response = await createCategory(data);
        alert("Category created successfully!");
      }

      console.log("✅ Success:", response);
      navigate("/categories/manage");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner?.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("❌ Submission error:", error);
        console.error("❌ Error response:", error.response);
        console.error("❌ Error response data:", error.response?.data);
        const apiMsg = error.message || error.response?.data?.message || "Failed to save category.";
        setErrorMessage(apiMsg);
        alert(`Error: ${apiMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear validation error for a specific field when user interacts with it
   */
  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // ----------------------------------------------------------------------------
  // HELPER COMPONENTS
  // ----------------------------------------------------------------------------

  /**
   * Reusable section title component with icon
   */
  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b pb-2">
      <Icon className="text-blue-600 text-xl" />
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );

  /**
   * Error message display component
   */
  const ErrorMessage = ({ error }) =>
    error ? (
      <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
        <FaTimesCircle size={12} />
        {error}
      </p>
    ) : null;

  // ----------------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FaLayerGroup />
              </div>
              {isEditMode ? "Update Category" : "Create Category"}
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {isEditMode
                ? `ID: ${id}`
                : "Define a new category for your trekking expeditions"}
            </p>
          </div>
        </header>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50/50 p-8 md:p-10 space-y-10">
            {/* Section: Basic Metadata */}
            <div>
              <SectionTitle icon={FaInfoCircle} title="Primary Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category ID Field */}
                <div id="categoryId">
                  <InputField
                    label="Category Unique ID"
                    placeholder="e.g., beginners, high-altitude"
                    value={formData.categoryId}
                    onChange={(e) => {
                      setFormData({ ...formData, categoryId: e.target.value });
                      clearFieldError("categoryId");
                    }}
                    error={validationErrors.categoryId}
                  />
                  <ErrorMessage error={validationErrors.categoryId} />
                </div>

                {/* Title Field */}
                <div id="title">
                  <InputField
                    label="Category Title"
                    placeholder="e.g., Easy Walks"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      clearFieldError("title");
                    }}
                    error={validationErrors.title}
                  />
                  <ErrorMessage error={validationErrors.title} />
                </div>

                {/* Description Field */}
                <div className="md:col-span-2 space-y-2" id="description">
                  <label className="block text-sm font-bold text-gray-700 ml-1">
                    Brief Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) => {
                      setFormData({ ...formData, description: content });
                      clearFieldError("description");
                    }}
                  />
                  <ErrorMessage error={validationErrors.description} />
                </div>
              </div>
            </div>

            {/* Section: Filtering & Logic */}
            <div className="pt-2">
              <SectionTitle icon={FaTags} title="Expedition Logic & Media" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  {/* Tags Field */}
                  <div id="tags">
                    <TagsInput
                      label="Season Tags"
                      placeholder="Add tag (e.g. Summer, Monsoon)"
                      value={formData.tags}
                      onChange={(newTags) => {
                        setFormData({ ...formData, tags: newTags });
                        clearFieldError("tags");
                      }}
                    />
                    <ErrorMessage error={validationErrors.tags} />
                  </div>

                  {/* Difficulty Field */}
                  <div className="space-y-2" id="difficulty">
                    <label className="block text-sm font-bold text-gray-700 ml-1">
                      Ideal Difficulty
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <CustomSelect
                      options={difficulties}
                      value={difficulties.find(
                        (d) => d.value === formData.difficulty,
                      )}
                      onChange={(val) => {
                        setFormData({ ...formData, difficulty: val.value });
                        clearFieldError("difficulty");
                      }}
                    />
                    <ErrorMessage error={validationErrors.difficulty} />
                  </div>

                  {/* Active Status Checkbox */}
                  <div className="pt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <Checkbox
                      id="cat-active"
                      label="Publicly Active Category"
                      checked={formData.isActive}
                      onChange={(val) =>
                        setFormData({ ...formData, isActive: val })
                      }
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-6" id="catImage">
                  <ImageUploader
                    label="Category Cover Image"
                    value={formData.catImage}
                    onChange={(img) => {
                      setFormData({ ...formData, catImage: img });
                      clearFieldError("catImage");
                    }}
                  />
                  <ErrorMessage error={validationErrors.catImage} />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/categories/manage")}
                className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? "Processing..."
                  : isEditMode
                    ? "Update Category"
                    : "Save Category"}
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </form>

        {/* Global Error Message Display */}
        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm flex items-center gap-2">
            <FaTimesCircle /> {errorMessage}
          </div>
        )}

        {/* Validation Errors Summary (Optional) */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200 font-medium text-sm">
            <div className="flex items-center gap-2 mb-2 font-bold">
              <FaInfoCircle /> Please fix the following errors:
            </div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field} className="text-xs">
                  <span className="font-semibold capitalize">{field}:</span>{" "}
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
