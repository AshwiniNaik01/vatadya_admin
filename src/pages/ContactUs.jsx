import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaHeading,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLink,
  FaGlobe,
  FaTag,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaMap,
  FaEdit,
} from "react-icons/fa";
import InputField from "../components/form/InputField";
import ImageUploader from "../components/form/ImageUploader";
import {
  ArrayBlock,
  AddButton,
  EmptyState,
} from "../components/form/SharedFormComponents";
import { AddContactUs, getContactUs, editContactUs } from "../api/contactUsApi";

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const Icon = type === "success" ? FaCheckCircle : FaExclamationCircle;
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ${styles[type]}`}
    >
      <Icon className={`text-sm shrink-0 ${iconColor}`} />
      <span className="text-sm font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-xs opacity-50 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-400/25 shrink-0">
        <Icon className="text-white text-sm" />
      </div>
      <div>
        <h3 className="text-md font-black text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ icon: Icon, label, gradient, children }) {
  return (
    <div className="bg-linear-to-br from-blue-50/70 to-slate-50 rounded-2xl border border-blue-100 p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${gradient}`}
        >
          <Icon className="text-white text-xs" />
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
const validationSchema = Yup.object({
  mainTitle: Yup.string().required("Main title is required"),
  contactInfo: Yup.object({
    callUs: Yup.object({ value: Yup.string().required("Phone is required") }),
    emailUs: Yup.object({
      value: Yup.string().email("Invalid email").required("Email is required"),
    }),
    visitUs: Yup.object({
      value: Yup.string().required("Address is required"),
    }),
  }),
  findUs: Yup.object({
    embeddedMapLocation: Yup.string().url("Must be a valid URL").nullable(),
  }),
});

// ─── Default / empty form values ─────────────────────────────────────────────
const emptyValues = {
  mainTitle: "",
  contactMainImage: null,
  contactOtherImages: [],
  contactInfo: {
    callUs: { value: "", subValue: "" },
    emailUs: { value: "", subValue: "" },
    visitUs: { value: "", subValue: "" },
  },
  findUs: { embeddedMapLocation: "" },
  connectWithUs: [],
};

function mapApiToForm(data) {
  return {
    mainTitle: data?.mainTitle ?? "",
    contactMainImage: data?.contactMainImage ?? null, // object is fine
    contactOtherImages: Array.isArray(data?.contactOtherImages)
      ? data.contactOtherImages.map((img) => img ?? null)
      : [],
    contactInfo: {
      callUs: {
        value: data?.contactInfo?.callUs?.value ?? "",
        subValue: data?.contactInfo?.callUs?.subValue ?? "",
      },
      emailUs: {
        value: data?.contactInfo?.emailUs?.value ?? "",
        subValue: data?.contactInfo?.emailUs?.subValue ?? "",
      },
      visitUs: {
        value: data?.contactInfo?.visitUs?.value ?? "",
        subValue: data?.contactInfo?.visitUs?.subValue ?? "",
      },
    },
    findUs: { embeddedMapLocation: data?.findUs?.embeddedMapLocation ?? "" },
    connectWithUs: Array.isArray(data?.connectWithUs) ? data.connectWithUs : [],
  };
}

function buildFormData(values) {
  const formData = new FormData();

  // ── Plain text fields ────────────────────────────────────────────────────────
  formData.append("mainTitle", values.mainTitle ?? "");

  // ── Nested objects → JSON strings ───────────────────────────────────────────
  formData.append("contactInfo", JSON.stringify(values.contactInfo ?? {}));
  formData.append("findUs", JSON.stringify(values.findUs ?? {}));
  formData.append("connectWithUs", JSON.stringify(values.connectWithUs ?? []));

  // ── ContactMainImage ─────────────────────────────────────────────────────────
  // ← Replace the old contactMainImage block with this:
  if (values.contactMainImage instanceof File) {
    formData.append("ContactMainImage", values.contactMainImage); // PascalCase
  } else if (values.contactMainImage?.cdnUrl) {
    formData.append("ContactMainImage", values.contactMainImage.cdnUrl);
  } else if (typeof values.contactMainImage === "string" && values.contactMainImage) {
    formData.append("ContactMainImage", values.contactMainImage);
  }

  // ── ContactOtherImages ───────────────────────────────────────────────────────
  if (Array.isArray(values.contactOtherImages)) {
    values.contactOtherImages.forEach((img) => {
      if (img instanceof File) {
        formData.append("ContactOtherImages", img); // PascalCase
      } else if (img?.cdnUrl) {
        formData.append("contactOtherImages", img.cdnUrl); // optional: for existing URLs
      } else if (typeof img === "string" && img) {
        formData.append("contactOtherImages", img);
      }
    });
  }

  return formData;
}

// function buildFormData(values) {
//   const formData = new FormData();

//   // ── Plain text fields ────────────────────────────────────────────────────────
//   formData.append("mainTitle", values.mainTitle ?? "");

//   // ── Nested objects → JSON strings ───────────────────────────────────────────
//   formData.append("contactInfo", JSON.stringify(values.contactInfo ?? {}));
//   formData.append("findUs", JSON.stringify(values.findUs ?? {}));
//   formData.append("connectWithUs", JSON.stringify(values.connectWithUs ?? []));

//   // ── ContactMainImage ─────────────────────────────────────────────────────────
//   if (values.contactMainImage instanceof File) {
//     // New upload — PascalCase matches Multer .fields() config
//     formData.append("contactMainImage", values.contactMainImage);
//   } else if (values.contactMainImage?.cdnUrl) {
//     // Existing image object from API (edit mode) — send URL string as text field
//     formData.append("contactMainImage", values.contactMainImage.cdnUrl);
//   } else if (
//     typeof values.contactMainImage === "string" &&
//     values.contactMainImage
//   ) {
//     // Already a plain URL string
//     formData.append("contactMainImage", values.contactMainImage);
//   }

//   // ── ContactOtherImages ───────────────────────────────────────────────────────
//   if (Array.isArray(values.contactOtherImages)) {
//     values.contactOtherImages.forEach((img) => {
//       if (img instanceof File) {
//         // New upload — PascalCase matches Multer .fields() config
//         formData.append("ContactOtherImages", img);
//       } else if (img?.cdnUrl) {
//         // Existing image object from API (edit mode) — send URL string as text field
//         formData.append("contactOtherImages", img.cdnUrl);
//       } else if (typeof img === "string" && img) {
//         // Already a plain URL string
//         formData.append("contactOtherImages", img);
//       }
//     });
//   }

//   return formData;
// }

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ContactUsForm({ onChange, disabled }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const contactUsIdRef = React.useRef(null);

  const formik = useFormik({
    initialValues: emptyValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);

        const payload = buildFormData(values);

        if (contactUsIdRef.current) {
          // Edit mode: PUT /contact-us/:id
          await editContactUs(contactUsIdRef.current, payload);
          setToast({
            message: "Contact Us updated successfully!",
            type: "success",
          });
          contactUsIdRef.current = null;
          formik.resetForm();
          onChange?.(emptyValues);
        } else {
          // Create mode: POST /contact-us
          const created = await AddContactUs(payload);
          if (created?._id) contactUsIdRef.current = created._id;
          setToast({
            message: "Contact Us saved successfully!",
            type: "success",
          });
          onChange?.(values);
        }
      } catch (err) {
        console.error("Failed to save Contact Us data:", err);
        setToast({
          message: err?.message || "Failed to save. Please try again.",
          type: "error",
        });
      } finally {
        setIsSaving(false);
      }
    },
  });

  // Sync to parent on every change
  React.useEffect(() => {
    onChange?.(formik.values);
  }, [formik.values]);

  // ─── Edit: fetch existing record and populate form ────────────────────────
  const handleEdit = async () => {
    try {
      setIsFetching(true);
      const response = await getContactUs();
      const record = response?.data ?? response;
      contactUsIdRef.current = record?._id ?? record?.id ?? null;
      await formik.setValues(mapApiToForm(record), true);
      setToast({ message: "Data loaded for editing.", type: "success" });
    } catch (err) {
      console.error("Failed to fetch Contact Us data:", err);
      setToast({
        message: err?.message || "Failed to load data. Please try again.",
        type: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  // ─── Social link helpers ──────────────────────────────────────────────────
  const links = formik.values.connectWithUs;

  const addLink = () =>
    formik.setFieldValue("connectWithUs", [...links, { name: "", value: "" }]);

  const updateLink = (i, k, v) =>
    formik.setFieldValue(
      "connectWithUs",
      links.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)),
    );

  const removeLink = (i) =>
    formik.setFieldValue(
      "connectWithUs",
      links.filter((_, idx) => idx !== i),
    );

  // ─── Touch + error helper ─────────────────────────────────────────────────
  const touchedError = (path) => {
    const keys = path.split(".");
    const t = keys.reduce((o, k) => o?.[k], formik.touched);
    const e = keys.reduce((o, k) => o?.[k], formik.errors);
    return t && e ? e : undefined;
  };

  const isDisabled = disabled || isSaving || isFetching;
  const isEditMode = !!contactUsIdRef.current;
  // console.log(formik.values);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ── Page Header ──────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/30">
                <FaEnvelope className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Contact Us
                </h1>
                <p className="text-slate-400 text-xs font-medium">
                  {isEditMode
                    ? "Editing existing contact page content"
                    : "Manage your contact information and social links"}
                </p>
              </div>
            </div>

            {/* ── Edit Button ──────────────────────────────────── */}
            {!disabled && (
              <button
                type="button"
                onClick={handleEdit}
                disabled={isFetching || isSaving || isEditMode}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-600 text-sm font-bold shadow-sm hover:bg-blue-50 hover:border-blue-400 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isFetching ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" /> Loading…
                  </>
                ) : (
                  <>
                    <FaEdit className="text-xs" /> Edit
                  </>
                )}
              </button>
            )}
          </div>

          {/* ── Main Content ─────────────────────────────────── */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50">
            {/* ── Main Title ───────────────────────────────────── */}
            <InputField
              label="Main Title"
              icon={FaHeading}
              value={formik.values.mainTitle}
              onChange={formik.handleChange("mainTitle")}
              onBlur={formik.handleBlur("mainTitle")}
              placeholder="e.g. Get In Touch With Us"
              disabled={isDisabled}
              error={touchedError("mainTitle")}
            />

            {/* ── Images ──────────────────────────────────────── */}
            <div className="pt-6 border-t border-gray-100">
              <SectionHeader
                icon={FaGlobe}
                title="Section Images"
                subtitle="Main banner and additional gallery images"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <ImageUploader
                    label="Contact Main Image"
                    value={formik.values.contactMainImage || null}
                    onChange={(file) =>
                      formik.setFieldValue("contactMainImage", file ?? null)
                    }
                  />
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <ImageUploader
                    label="Other Images"
                    isMultiple
                    // value={formik.values.contactOtherImages ?? []}
                    value={
                      Array.isArray(formik.values.contactOtherImages)
                        ? formik.values.contactOtherImages.map((img) =>
                            typeof img === "string" ? img : img?.cdnUrl || img,
                          )
                        : []
                    }
                    onChange={(files) =>
                      formik.setFieldValue("contactOtherImages", files ?? [])
                    }
                  />
                </div>
              </div>
            </div>

            {/* ── Contact Info ─────────────────────────────────── */}
            <div className="pt-6 border-t border-gray-100">
              <SectionHeader
                icon={FaPhone}
                title="Contact Information"
                subtitle="Phone, email and address details with sub-labels"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Call Us */}
                <ContactCard
                  icon={FaPhone}
                  label="Call Us"
                  gradient="bg-linear-to-br from-blue-600 to-blue-400"
                >
                  <InputField
                    label="Value"
                    value={formik.values.contactInfo.callUs.value}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.callUs.value",
                        e.target.value,
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched("contactInfo.callUs.value", true)
                    }
                    placeholder="+91 9876543210"
                    disabled={isDisabled}
                    error={touchedError("contactInfo.callUs.value")}
                  />
                  <InputField
                    label="Sub Value"
                    value={formik.values.contactInfo.callUs.subValue}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.callUs.subValue",
                        e.target.value,
                      )
                    }
                    placeholder="Mon - Fri, 9AM - 6PM"
                    disabled={isDisabled}
                  />
                </ContactCard>

                {/* Email Us */}
                <ContactCard
                  icon={FaEnvelope}
                  label="Email Us"
                  gradient="bg-linear-to-br from-indigo-600 to-indigo-400"
                >
                  <InputField
                    label="Value"
                    value={formik.values.contactInfo.emailUs.value}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.emailUs.value",
                        e.target.value,
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched("contactInfo.emailUs.value", true)
                    }
                    placeholder="support@example.com"
                    disabled={isDisabled}
                    error={touchedError("contactInfo.emailUs.value")}
                  />
                  <InputField
                    label="Sub Value"
                    value={formik.values.contactInfo.emailUs.subValue}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.emailUs.subValue",
                        e.target.value,
                      )
                    }
                    placeholder="We reply within 24 hours"
                    disabled={isDisabled}
                  />
                </ContactCard>

                {/* Visit Us */}
                <ContactCard
                  icon={FaMapMarkerAlt}
                  label="Visit Us"
                  gradient="bg-linear-to-br from-sky-600 to-sky-400"
                >
                  <InputField
                    label="Value"
                    value={formik.values.contactInfo.visitUs.value}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.visitUs.value",
                        e.target.value,
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched("contactInfo.visitUs.value", true)
                    }
                    placeholder="123 Business Park Pune"
                    disabled={isDisabled}
                    error={touchedError("contactInfo.visitUs.value")}
                  />
                  <InputField
                    label="Sub Value"
                    value={formik.values.contactInfo.visitUs.subValue}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contactInfo.visitUs.subValue",
                        e.target.value,
                      )
                    }
                    placeholder="Near IT Park"
                    disabled={isDisabled}
                  />
                </ContactCard>
              </div>
            </div>

            {/* ── Find Us ──────────────────────────────────────── */}
            <div className="pt-6 border-t border-gray-100">
              <SectionHeader
                icon={FaMap}
                title="Find Us"
                subtitle="Embed a Google Maps or any map URL for your location"
              />
              <InputField
                label="Embedded Map Location URL"
                icon={FaLink}
                value={formik.values.findUs.embeddedMapLocation}
                onChange={(e) =>
                  formik.setFieldValue(
                    "findUs.embeddedMapLocation",
                    e.target.value,
                  )
                }
                onBlur={() =>
                  formik.setFieldTouched("findUs.embeddedMapLocation", true)
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
                disabled={isDisabled}
                error={touchedError("findUs.embeddedMapLocation")}
              />
            </div>

            {/* ── Connect With Us ──────────────────────────────── */}
            <div className="pt-6 border-t border-gray-100">
              <SectionHeader
                icon={FaLink}
                title="Connect With Us"
                subtitle="Social media links — each has a name and a URL value"
              />

              {links.length === 0 && (
                <EmptyState
                  Icon={FaLink}
                  message="No social links yet. Add your first one."
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link, i) => (
                  <ArrayBlock
                    key={i}
                    title={`Link ${i + 1}`}
                    onRemove={isDisabled ? undefined : () => removeLink(i)}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Name"
                        icon={FaTag}
                        value={link.name}
                        onChange={(e) => updateLink(i, "name", e.target.value)}
                        placeholder="e.g. Facebook"
                        disabled={isDisabled}
                      />
                      <InputField
                        label="Value (URL)"
                        icon={FaLink}
                        value={link.value}
                        onChange={(e) => updateLink(i, "value", e.target.value)}
                        placeholder="https://facebook.com/page"
                        disabled={isDisabled}
                      />
                    </div>
                  </ArrayBlock>
                ))}
              </div>

              {!isDisabled && (
                <div className="mt-4">
                  <AddButton label="Add Social Link" onClick={addLink} />
                </div>
              )}
            </div>

            {/* ── Save / Update Button ─────────────────────────── */}
            {!disabled && (
              <div className="flex justify-end pt-4 pb-8">
                <button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  disabled={isSaving || !formik.isValid}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" /> Saving…
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xs" />
                      {isEditMode ? "Update Contact Us" : "Save Contact Us"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
