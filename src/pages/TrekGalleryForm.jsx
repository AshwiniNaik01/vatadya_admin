import { useState, useEffect } from "react";
import * as Yup from "yup";
import { FiUpload, FiImage, FiType, FiX, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// UI Components
import InputField from "../components/form/InputField";
import Checkbox from "../components/form/Checkbox";
import CustomSelect from "../components/form/CustomSelect";

// API
import { addGallery, updateGallery } from "../api/galleryApi";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================
const galleryValidationSchema = Yup.object().shape({
  // Uncomment to enable validation:
  // title: Yup.string().min(3).max(100).required("Title is required"),
  // month: Yup.string().required("Month is required"),
  // year: Yup.string().required("Year is required"),
  // experience: Yup.string().required("Experience is required"),
  // season: Yup.string().required("Season is required"),
  // region: Yup.string().required("Region is required"),
  // photo: Yup.mixed().nullable().test("fileRequired", "Photo is required", function (value) {
  //   const { isEditMode, hasExistingPhoto } = this.options.context || {};
  //   if (isEditMode && hasExistingPhoto) return true;
  //   return value !== null && value !== undefined;
  // }),
});

// ============================================================================
// DROPDOWN OPTIONS
// ============================================================================
const months = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

const years = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
];

const experiences = [
  { value: "Beginner", label: "Beginner" },
  { value: "Moderate", label: "Moderate" },
  { value: "Advanced", label: "Advanced" },
];

const seasons = [
  { value: "Winter", label: "Winter" },
  { value: "Spring", label: "Spring" },
  { value: "Summer", label: "Summer" },
  { value: "Autumn", label: "Autumn" },
];

const regions = [
  // ── North India ──────────────────────────────────────────
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jammu & Kashmir", label: "Jammu & Kashmir" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Punjab", label: "Punjab" },
  { value: "Haryana", label: "Haryana" },
  { value: "Delhi", label: "Delhi" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },

  // ── Northeast India ──────────────────────────────────────
  { value: "Sikkim", label: "Sikkim" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Manipur", label: "Manipur" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Tripura", label: "Tripura" },
  { value: "Assam", label: "Assam" },

  // ── East India ───────────────────────────────────────────
  { value: "West Bengal", label: "West Bengal" },
  { value: "Bihar", label: "Bihar" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Odisha", label: "Odisha" },

  // ── Central India ────────────────────────────────────────
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },

  // ── West India ───────────────────────────────────────────
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Goa", label: "Goa" },

  // ── South India ──────────────────────────────────────────
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Telangana", label: "Telangana" },

  // ── Union Territories ────────────────────────────────────
  { value: "Andaman & Nicobar", label: "Andaman & Nicobar" },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Dadra & Nagar Haveli", label: "Dadra & Nagar Haveli" },
  { value: "Daman & Diu", label: "Daman & Diu" },

  // ── Neighbouring Countries ───────────────────────────────
  { value: "Nepal", label: "Nepal" },
  { value: "Bhutan", label: "Bhutan" },
  { value: "Sri Lanka", label: "Sri Lanka" },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const ErrorMessage = ({ error }) =>
  error ? (
    <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
  ) : null;

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 shrink-0">
        <Icon size={11} color="white" />
      </span>
      <h3 className="text-md font-bold text-gray-900">{title}</h3>
    </div>
    <hr className="border-t border-gray-200" />
  </div>
);

const Field = ({ label, required, error, children }) => (
  <div>
    {label && (
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    <ErrorMessage error={error} />
  </div>
);

// ============================================================================
// TREK GALLERY FORM
// ============================================================================
export default function TrekGalleryForm({
  onSubmit,
  initialData = null,
  isEditMode = false,
}) {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    month: "",
    year: "",
    experience: "Beginner",
    season: "Winter",
    region: "",
    photo: null,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // ── Populate form in edit mode ─────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode && initialData) {
      setForm({
        title: initialData.title || "",
        month: initialData.month || "",
        year: initialData.year || "",
        experience: initialData.experience || "Beginner",
        season: initialData.season || "Winter",
        region: initialData.region || "",
        photo: null,
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
      });
      if (initialData.photo?.cdnUrl) setPreviewImage(initialData.photo.cdnUrl);
      else if (typeof initialData.photo === "string")
        setPreviewImage(initialData.photo);
    } else {
      setForm({
        title: "",
        month: "",
        year: "",
        experience: "Beginner",
        season: "Winter",
        region: "",
        photo: null,
        isActive: true,
      });
      setPreviewImage(null);
    }
  }, [initialData, isEditMode]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n[fieldName];
        return n;
      });
    }
    if (apiError) setApiError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files?.[0]) {
      setForm({ ...form, [name]: files[0] });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(files[0]);
      clearFieldError("photo");
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
      clearFieldError(name);
    }
  };

  const handleSelectChange = (field, option) => {
    setForm((prev) => ({ ...prev, [field]: option?.value ?? "" }));
    clearFieldError(field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setValidationErrors({});
      setApiError("");

      await galleryValidationSchema.validate(form, {
        abortEarly: false,
        context: { isEditMode, hasExistingPhoto: !!previewImage },
      });

      const formData = new FormData();
      if (form.photo) formData.append("TrekGalleryImage", form.photo);
      formData.append("title", form.title);
      formData.append("month", form.month);
      formData.append("year", form.year);
      formData.append("experience", form.experience);
      formData.append("season", form.season);
      formData.append("region", form.region);
      formData.append("isActive", form.isActive);

      let response;
      if (isEditMode && initialData?._id) {
        response = await updateGallery(initialData._id, formData);
        alert("Trek gallery item updated successfully!");
      } else {
        response = await addGallery(formData);
        alert("Trek gallery item added successfully!");
      }

      if (onSubmit) onSubmit(response);

      if (!isEditMode) {
        setForm({
          title: "",
          month: "",
          year: "",
          experience: "Beginner",
          season: "Winter",
          region: "",
          photo: null,
          isActive: true,
        });
        setPreviewImage(null);
      }

      navigate("/gallery/manage");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.error("Failed to save gallery item:", error);
        setApiError(
          error?.message ||
            "Failed to save gallery item. Please check your connection and try again.",
        );
        alert(error?.message || "Failed to save gallery item");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* ── Page title ── */}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          {isEditMode ? "Edit Gallery Item" : "Add Gallery Item"}
        </h1>

        {/* ── Single card containing the entire form + footer buttons ── */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Scrollable body */}
            <div className="p-8 space-y-7">
              {/* API Error banner */}
              {apiError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-md font-medium text-red-700">{apiError}</p>
                </div>
              )}

              {/* Validation errors summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-md font-bold text-amber-800 mb-1.5">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {Object.entries(validationErrors).map(([field, err]) => (
                      <li key={field} className="text-xs text-amber-700">
                        <span className="font-semibold capitalize">
                          {field}:
                        </span>{" "}
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── SECTION: Trek Photo ── */}
              <div>
                <SectionHeader icon={FiImage} title="Trek Photo" />
                <label className="block cursor-pointer">
                  <div className="relative flex flex-col items-center justify-center h-[400px] rounded-xl overflow-hidden border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-fit-cover"
                      />
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-3">
                          <FiImage size={22} className="text-blue-600" />
                        </div>
                        <p className="text-md font-semibold text-blue-600">
                          Click to upload trek photo
                        </p>
                        <p className="text-xs text-blue-400 mt-0.5">
                          JPG, PNG · High resolution recommended
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                  {previewImage && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-green-600">
                      <FiCheck size={13} />
                      Image {isEditMode ? "loaded" : "selected"} — click to
                      replace
                    </p>
                  )}
                  <ErrorMessage error={validationErrors.photo} />
                </label>
              </div>

              {/* ── SECTION: Primary Details ── */}
              <div>
                <SectionHeader icon={FiType} title="Primary Details" />
                <div className="space-y-5">
                  {/* Title — full width */}
                  <Field label="Title" required error={validationErrors.title}>
                    <InputField
                      name="title"
                      placeholder="E.g. Harishchandragad Sunrise"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </Field>

                  {/* Month + Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field
                      label="Month"
                      required
                      error={validationErrors.month}
                    >
                      <CustomSelect
                        name="month"
                        options={months}
                        value={
                          months.find((m) => m.value === form.month) || null
                        }
                        onChange={(opt) => handleSelectChange("month", opt)}
                      />
                    </Field>
                    <Field label="Year" required error={validationErrors.year}>
                      <CustomSelect
                        name="year"
                        options={years}
                        value={years.find((y) => y.value === form.year) || null}
                        onChange={(opt) => handleSelectChange("year", opt)}
                      />
                    </Field>
                  </div>

                  {/* Experience + Season */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field
                      label="Experience Level"
                      required
                      error={validationErrors.experience}
                    >
                      <CustomSelect
                        name="experience"
                        options={experiences}
                        value={
                          experiences.find(
                            (e) => e.value === form.experience,
                          ) || null
                        }
                        onChange={(opt) =>
                          handleSelectChange("experience", opt)
                        }
                      />
                    </Field>
                    <Field
                      label="Season"
                      required
                      error={validationErrors.season}
                    >
                      <CustomSelect
                        name="season"
                        options={seasons}
                        value={
                          seasons.find((s) => s.value === form.season) || null
                        }
                        onChange={(opt) => handleSelectChange("season", opt)}
                      />
                    </Field>
                  </div>

                  {/* Region — half width */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field
                      label="Region"
                      required
                      error={validationErrors.region}
                    >
                      <CustomSelect
                        name="region"
                        options={regions}
                        value={
                          regions.find((r) => r.value === form.region) || null
                        }
                        onChange={(opt) => handleSelectChange("region", opt)}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* ── Active Status ── */}
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Checkbox
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-md font-semibold text-blue-800 leading-none">
                    Mark as Active
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Active items appear publicly in the gallery
                  </p>
                </div>
                {form.isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                    <FiCheck size={10} />
                    Active
                  </span>
                )}
              </div>
            </div>
            {/* end scrollable body */}

            {/* ── Footer action bar — pinned to bottom of card ── */}
            <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => navigate("/gallery/manage")}
                disabled={loading}
                className="flex items-center gap-1.5 h-9 px-5 text-md font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX size={14} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 h-9 px-5 text-md font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiUpload size={14} />
                {loading
                  ? isEditMode
                    ? "Updating…"
                    : "Saving…"
                  : isEditMode
                    ? "Verify & Update"
                    : "Verify & Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
