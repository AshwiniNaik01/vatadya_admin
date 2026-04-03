import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaHeading,
  FaInfoCircle,
  FaBullseye,
  FaChartBar,
  FaLayerGroup,
  FaStar,
  FaPlus,
  FaTrash,
  FaHashtag,
  FaSortNumericUp,
  FaAlignLeft,
  FaTag,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
  FaImage,
} from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import ImageUploader from "../form/ImageUploader";
import { ArrayBlock, EmptyState } from "../form/SharedFormComponents";
import { AddAboutUs, getAboutUs, editAboutUs } from "../../api/aboutUsApi";

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
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  onAdd,
  addLabel,
  disabled,
}) {
  return (
    <div className="pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-400/25 shrink-0">
            <Icon className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-md font-black text-gray-800">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {onAdd && !disabled && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <FaPlus className="text-[9px]" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
const validationSchema = Yup.object({
  aboutSection: Yup.object({
    mainTitle: Yup.string().required("Main title is required"),
  }),
});

// ─── Default / empty form values ─────────────────────────────────────────────
const emptyValues = {
  aboutSection: { mainTitle: "", subTitle: "", features: [] },
  missionSection: { title: "", description: "", subDescription: "" },
  infoBar: { mainTitle: "", stats: [] },
  operationalPillars: { mainTitle: "", pillars: [] },
  capabilities: { mainTitle: "", items: [] },
  MissionImage: null,
};

// ─── Map API response → form values ──────────────────────────────────────────
function mapApiToForm(data) {
  return {
    aboutSection: {
      mainTitle: data?.aboutSection?.mainTitle ?? "",
      subTitle: data?.aboutSection?.subTitle ?? "",
      features: Array.isArray(data?.aboutSection?.features)
        ? data.aboutSection.features
        : [],
    },
    missionSection: {
      title: data?.missionSection?.title ?? "",
      description: data?.missionSection?.description ?? "",
      subDescription: data?.missionSection?.subDescription ?? "",
    },
    infoBar: {
      mainTitle: data?.infoBar?.mainTitle ?? "",
      stats: Array.isArray(data?.infoBar?.stats) ? data.infoBar.stats : [],
    },
    operationalPillars: {
      mainTitle: data?.operationalPillars?.mainTitle ?? "",
      pillars: Array.isArray(data?.operationalPillars?.pillars)
        ? data.operationalPillars.pillars
        : [],
    },
    capabilities: {
      mainTitle: data?.capabilities?.mainTitle ?? "",
      items: Array.isArray(data?.capabilities?.items)
        ? data.capabilities.items
        : [],
    },
    MissionImage: data?.MissionImage ?? null,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AboutUsForm({ onChange, disabled }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  // Holds the _id from GET so Save calls editAboutUs(id, data) instead of AddAboutUs
  const aboutUsIdRef = React.useRef(null);

  const formik = useFormik({
    initialValues: emptyValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);

        const formData = new FormData();
        formData.append("aboutSection", JSON.stringify(values.aboutSection));
        formData.append(
          "missionSection",
          JSON.stringify(values.missionSection),
        );
        formData.append("infoBar", JSON.stringify(values.infoBar));
        formData.append(
          "operationalPillars",
          JSON.stringify(values.operationalPillars),
        );
        formData.append("capabilities", JSON.stringify(values.capabilities));

        if (values.MissionImage instanceof File) {
          formData.append("MissionImage", values.MissionImage);
        }

        if (aboutUsIdRef.current) {
          await editAboutUs(aboutUsIdRef.current, formData);
          setToast({
            message: "About Us updated successfully!",
            type: "success",
          });
          aboutUsIdRef.current = null;
          formik.resetForm();
          onChange?.(emptyValues);
        } else {
          const created = await AddAboutUs(formData);
          if (created?._id) aboutUsIdRef.current = created._id;
          setToast({
            message: "About Us saved successfully!",
            type: "success",
          });
          onChange?.(values);
        }
      } catch (err) {
        console.error("Failed to save About Us data:", err);
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
      const response = await getAboutUs();

      // API shape: { statusCode, success, data: { _id, aboutSection, ... } }
      const record = response?.data ?? response;
      aboutUsIdRef.current = record?._id ?? record?.id ?? null;

      await formik.setValues(mapApiToForm(record), true);
      setToast({ message: "Data loaded for editing.", type: "success" });
    } catch (err) {
      console.error("Failed to fetch About Us data:", err);
      setToast({
        message: err?.message || "Failed to load data. Please try again.",
        type: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const fv = formik.values;
  const sfv = formik.setFieldValue;

  // ─── Array helpers ────────────────────────────────────────────────────────
  const getArr = (path) => path.split(".").reduce((o, k) => o?.[k], fv) ?? [];
  const addItem = (path, item) => sfv(path, [...getArr(path), item]);
  const updateItem = (path, i, k, v) =>
    sfv(
      path,
      getArr(path).map((x, idx) => (idx === i ? { ...x, [k]: v } : x)),
    );
  const removeItem = (path, i) =>
    sfv(
      path,
      getArr(path).filter((_, idx) => idx !== i),
    );

  const addFeature = () =>
    sfv("aboutSection.features", [...fv.aboutSection.features, ""]);
  const updateFeature = (i, v) =>
    sfv(
      "aboutSection.features",
      fv.aboutSection.features.map((f, idx) => (idx === i ? v : f)),
    );
  const removeFeature = (i) =>
    sfv(
      "aboutSection.features",
      fv.aboutSection.features.filter((_, idx) => idx !== i),
    );

  const touchedError = (path) => {
    const keys = path.split(".");
    const t = keys.reduce((o, k) => o?.[k], formik.touched);
    const e = keys.reduce((o, k) => o?.[k], formik.errors);
    return t && e ? e : undefined;
  };

  const isDisabled = disabled || isSaving || isFetching;
  const isEditMode = !!aboutUsIdRef.current;

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
          {/* ─── Page Header ────────────────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/30">
                <FaInfoCircle className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  About Us
                </h1>
                <p className="text-slate-400 text-xs font-medium">
                  {isEditMode
                    ? "Editing existing about page content"
                    : "Manage your about page content and sections"}
                </p>
              </div>
            </div>

            {/* ─── Edit Button ─────────────────────────────────────────── */}
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

          {/* ─── Form Card ──────────────────────────────────────────────── */}
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50">
            {/* ═══ 1. ABOUT SECTION ═══ */}
            <SectionHeader
              icon={FaInfoCircle}
              title="About Section"
              subtitle="Main title, subtitle and feature highlights"
              onAdd={addFeature}
              addLabel="Add Feature"
              disabled={isDisabled}
            />
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Main Title"
                  icon={FaHeading}
                  value={fv.aboutSection.mainTitle}
                  onChange={(e) =>
                    sfv("aboutSection.mainTitle", e.target.value)
                  }
                  onBlur={() =>
                    formik.setFieldTouched("aboutSection.mainTitle", true)
                  }
                  placeholder="e.g. About VataDya"
                  disabled={isDisabled}
                  error={touchedError("aboutSection.mainTitle")}
                />
                <InputField
                  label="Sub Title"
                  icon={FaTag}
                  value={fv.aboutSection.subTitle}
                  onChange={(e) => sfv("aboutSection.subTitle", e.target.value)}
                  placeholder="e.g. Your Trusted Trekking Partner"
                  disabled={isDisabled}
                />
              </div>

              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  Features
                </p>
                {fv.aboutSection.features.length === 0 && (
                  <EmptyState
                    Icon={FaStar}
                    message="No features yet. Click 'Add Feature' above."
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fv.aboutSection.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1">
                        <InputField
                          label={`Feature ${i + 1}`}
                          icon={FaStar}
                          value={feature}
                          onChange={(e) => updateFeature(i, e.target.value)}
                          placeholder="e.g. Safety First Treks"
                          disabled={isDisabled}
                        />
                      </div>
                      {!isDisabled && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="mt-6 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all"
                        >
                          <FaTrash className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ 2. MISSION SECTION ═══ */}
            <SectionHeader
              icon={FaBullseye}
              title="Mission Section"
              subtitle="Title, main description and a supporting sub-description"
            />
            <div className="space-y-5">
              <InputField
                label="Title"
                icon={FaHeading}
                value={fv.missionSection.title}
                onChange={(e) => sfv("missionSection.title", e.target.value)}
                placeholder="e.g. Our Mission"
                disabled={isDisabled}
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                  Description
                </label>
                <RichTextEditor
                  value={fv.missionSection.description}
                  onChange={(v) => sfv("missionSection.description", v)}
                  disabled={isDisabled}
                />
              </div>
              <InputField
                label="Sub Description"
                icon={FaAlignLeft}
                value={fv.missionSection.subDescription}
                onChange={(e) =>
                  sfv("missionSection.subDescription", e.target.value)
                }
                placeholder="e.g. Building a community of passionate trekkers."
                disabled={isDisabled}
              />
            </div>

            {/* ═══ 3. INFO BAR ═══ */}
            <SectionHeader
              icon={FaChartBar}
              title="Info Bar"
              subtitle="Section title and achievement stats"
              onAdd={() => addItem("infoBar.stats", { title: "", value: "" })}
              addLabel="Add Stat"
              disabled={isDisabled}
            />
            <div className="space-y-5">
              <InputField
                label="Main Title"
                icon={FaHeading}
                value={fv.infoBar.mainTitle}
                onChange={(e) => sfv("infoBar.mainTitle", e.target.value)}
                placeholder="e.g. Our Achievements"
                disabled={isDisabled}
              />
              {fv.infoBar.stats.length === 0 && (
                <EmptyState
                  Icon={FaChartBar}
                  message="No stats yet. Click 'Add Stat' above."
                />
              )}
              {fv.infoBar.stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fv.infoBar.stats.map((stat, i) => (
                    <ArrayBlock
                      key={i}
                      title={`Stat ${i + 1}`}
                      onRemove={
                        isDisabled
                          ? undefined
                          : () => removeItem("infoBar.stats", i)
                      }
                    >
                      <InputField
                        label="Title"
                        icon={FaHashtag}
                        value={stat.title}
                        onChange={(e) =>
                          updateItem(
                            "infoBar.stats",
                            i,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Happy Trekkers"
                        disabled={isDisabled}
                      />
                      <InputField
                        label="Value"
                        icon={FaSortNumericUp}
                        value={stat.value}
                        onChange={(e) =>
                          updateItem(
                            "infoBar.stats",
                            i,
                            "value",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. 5000+"
                        disabled={isDisabled}
                      />
                    </ArrayBlock>
                  ))}
                </div>
              )}
            </div>

            {/* ═══ 4. OPERATIONAL PILLARS ═══ */}
            <SectionHeader
              icon={FaLayerGroup}
              title="Operational Pillars"
              subtitle="Section title and core pillars (title only)"
              onAdd={() => addItem("operationalPillars.pillars", { title: "" })}
              addLabel="Add Pillar"
              disabled={isDisabled}
            />
            <div className="space-y-5">
              <InputField
                label="Main Title"
                icon={FaHeading}
                value={fv.operationalPillars.mainTitle}
                onChange={(e) =>
                  sfv("operationalPillars.mainTitle", e.target.value)
                }
                placeholder="e.g. Operational Pillars"
                disabled={isDisabled}
              />
              {fv.operationalPillars.pillars.length === 0 && (
                <EmptyState
                  Icon={FaLayerGroup}
                  message="No pillars yet. Click 'Add Pillar' above."
                />
              )}
              {fv.operationalPillars.pillars.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fv.operationalPillars.pillars.map((p, i) => (
                    <ArrayBlock
                      key={i}
                      title={`Pillar ${i + 1}`}
                      onRemove={
                        isDisabled
                          ? undefined
                          : () => removeItem("operationalPillars.pillars", i)
                      }
                    >
                      <InputField
                        label="Title"
                        icon={FaLayerGroup}
                        value={p.title}
                        onChange={(e) =>
                          updateItem(
                            "operationalPillars.pillars",
                            i,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Safety First"
                        disabled={isDisabled}
                      />
                    </ArrayBlock>
                  ))}
                </div>
              )}
            </div>

            {/* ═══ 5. CAPABILITIES ═══ */}
            <SectionHeader
              icon={FaStar}
              title="Capabilities"
              subtitle="Section title and capability cards with title + description"
              onAdd={() =>
                addItem("capabilities.items", { title: "", description: "" })
              }
              addLabel="Add Capability"
              disabled={isDisabled}
            />
            <div className="space-y-5">
              <InputField
                label="Main Title"
                icon={FaHeading}
                value={fv.capabilities.mainTitle}
                onChange={(e) => sfv("capabilities.mainTitle", e.target.value)}
                placeholder="e.g. Our Capabilities"
                disabled={isDisabled}
              />
              {fv.capabilities.items.length === 0 && (
                <EmptyState
                  Icon={FaStar}
                  message="No capabilities yet. Click 'Add Capability' above."
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fv.capabilities.items.map((cap, i) => (
                  <ArrayBlock
                    key={i}
                    title={`Capability ${i + 1}`}
                    onRemove={
                      isDisabled
                        ? undefined
                        : () => removeItem("capabilities.items", i)
                    }
                  >
                    <div className="space-y-3">
                      <InputField
                        label="Title"
                        icon={FaHeading}
                        value={cap.title}
                        onChange={(e) =>
                          updateItem(
                            "capabilities.items",
                            i,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Guided Treks"
                        disabled={isDisabled}
                      />
                      <InputField
                        label="Description"
                        icon={FaAlignLeft}
                        value={cap.description}
                        onChange={(e) =>
                          updateItem(
                            "capabilities.items",
                            i,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Professional trek leaders guide you throughout the journey."
                        disabled={isDisabled}
                      />
                    </div>
                  </ArrayBlock>
                ))}
              </div>
            </div>

            {/* ====6. MissionImage === */}
            <SectionHeader
              icon={FaImage}
              title="Mission Image"
              subtitle="Upload the mission image"
            />

            <div>
              <ImageUploader
                label="Mission Image"
                value={fv.MissionImage || null}
                onChange={(file) => sfv("MissionImage", file ?? null)}
              />
            </div>
          </div>

          {/* ═══ SAVE / UPDATE BUTTON ═══ */}
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
                    {isEditMode ? "Update About Us" : "Save About Us"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
