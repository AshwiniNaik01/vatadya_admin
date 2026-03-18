import { useState } from "react";
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
  FaPlus,
  FaTimes,
  FaCheck,
  FaImage,
  FaChevronRight,
  FaChartBar,
  FaUsers,
  FaClock,
  FaRuler,
  FaMapMarkerAlt,
  FaFlag,
  FaTrash,
  FaListUl,
  FaSave,
} from "react-icons/fa";

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "hero", label: "Hero", Icon: FaHome },
  { key: "missionVision", label: "Mission & Vision", Icon: FaEye },
  { key: "howItWorks", label: "How It Works", Icon: FaCog },
  { key: "whyChooseUs", label: "Why Choose Us", Icon: FaThumbsUp },
  { key: "safetyStandards", label: "Safety Standards", Icon: FaShieldAlt },
  { key: "faq", label: "FAQ", Icon: FaQuestionCircle },
  { key: "features", label: "Features", Icon: FaStar },
];

const SECTION_META = {
  hero: { label: "Hero", sub: "Configure the main hero banner content", Icon: FaHome },
  missionVision: { label: "Mission & Vision", sub: "Define your mission values and key stats", Icon: FaEye },
  howItWorks: { label: "How It Works", sub: "Explain your process step by step", Icon: FaCog },
  whyChooseUs: { label: "Why Choose Us", sub: "Highlight your key differentiators", Icon: FaThumbsUp },
  safetyStandards: { label: "Safety Standards", sub: "Showcase your safety commitments", Icon: FaShieldAlt },
  faq: { label: "FAQ", sub: "Manage frequently asked questions", Icon: FaQuestionCircle },
  features: { label: "Features", sub: "List your product features and metrics", Icon: FaStar },
};

const STAT_ICONS = {
  peaksClimbed: FaMapMarkerAlt,
  totalDistance: FaRuler,
  avgAltitude: FaMapMarkerAlt,
  trekTime: FaClock,
  peaksConquered: FaFlag,
  expeditions: FaChartBar,
  happyTrekkers: FaUsers,
  yearsOfGlory: FaClock,
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initData = () => ({
  hero: { title: "", description: "", heroImage: "", peaksClimbed: "", totalDistance: "", avgAltitude: "", trekTime: "" },
  missionVision: { title: "", peaksConquered: "", expeditions: "", happyTrekkers: "", yearsOfGlory: "", missions: [] },
  howItWorks: [],
  whyChooseUs: { mainTitle: "", rating: "", safety: "", happyTrekkers: "", expeditions: "", image: "", items: [] },
  safetyStandards: { title: "", description: "", standards: [] },
  faq: [],
  features: [],
});

// ─── Field Components ─────────────────────────────────────────────────────────
function FieldGroup({ label, Icon, children }) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">
        {Icon && <Icon className="text-xs text-blue-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm px-4 py-2.5 rounded-xl border border-blue-100 bg-white text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm transition-all hover:border-blue-200";

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ""}
      className={inputCls}
    />
  );
}

function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ""}
      rows={3}
      className={`${inputCls} resize-y`}
    />
  );
}

function ImageInput({ value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-3">
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 hover:border-blue-400 transition-all">
        <FaImage className="text-sm" />
        Upload image
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {value && (
        <div className="relative">
          <img src={value} alt="preview" className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200 shadow" />
          <button
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
          >
            <FaTimes className="text-[9px]" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Layout Helpers ───────────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-transparent" />
      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.18em]">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-blue-100 to-transparent" />
    </div>
  );
}

function ArrayBlock({ title, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-blue-100 overflow-hidden mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500">
        <span className="text-xs font-bold text-white/90 tracking-wide">{title}</span>
        <button
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all"
        >
          <FaTrash className="text-[10px]" /> Remove
        </button>
      </div>
      <div className="p-4 bg-gradient-to-br from-white to-blue-50/20">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 text-blue-500 text-sm font-semibold hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 mt-1"
    >
      <FaPlus className="text-xs" /> {label}
    </button>
  );
}

function EmptyState({ Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
        <Icon className="text-2xl text-blue-200" />
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

// ─── Section Forms ────────────────────────────────────────────────────────────
function HeroForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const stats = [
    { key: "peaksClimbed", label: "Peaks Climbed", placeholder: "e.g. 120+" },
    { key: "totalDistance", label: "Total Distance", placeholder: "e.g. 5000 km" },
    { key: "avgAltitude", label: "Avg Altitude", placeholder: "e.g. 4200 m" },
    { key: "trekTime", label: "Trek Time", placeholder: "e.g. 7–14 days" },
  ];
  return (
    <>
      <FieldGroup label="Title">
        <TextInput value={data.title} onChange={(v) => set("title", v)} placeholder="Enter hero title" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextArea value={data.description} onChange={(v) => set("description", v)} placeholder="Hero description..." />
      </FieldGroup>
      <FieldGroup label="Hero Image">
        <ImageInput value={data.heroImage} onChange={(v) => set("heroImage", v)} />
      </FieldGroup>
      <Divider label="Stats" />
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ key, label, placeholder }) => (
          <FieldGroup key={key} label={label} Icon={STAT_ICONS[key]}>
            <TextInput value={data[key]} onChange={(v) => set(key, v)} placeholder={placeholder} />
          </FieldGroup>
        ))}
      </div>
    </>
  );
}

function MissionVisionForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const missions = data.missions || [];
  const addMission = () => set("missions", [...missions, { title: "", description: "" }]);
  const updateMission = (i, field, v) =>
    set("missions", missions.map((m, idx) => (idx === i ? { ...m, [field]: v } : m)));
  const removeMission = (i) => set("missions", missions.filter((_, idx) => idx !== i));
  const stats = [
    { key: "peaksConquered", label: "Peaks Conquered", placeholder: "e.g. 200+" },
    { key: "expeditions", label: "Expeditions", placeholder: "e.g. 50" },
    { key: "happyTrekkers", label: "Happy Trekkers", placeholder: "e.g. 10,000+" },
    { key: "yearsOfGlory", label: "Years Of Glory", placeholder: "e.g. 15" },
  ];
  return (
    <>
      <FieldGroup label="Title">
        <TextInput value={data.title} onChange={(v) => set("title", v)} placeholder="Section title" />
      </FieldGroup>
      <Divider label="Stats" />
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ key, label, placeholder }) => (
          <FieldGroup key={key} label={label} Icon={STAT_ICONS[key]}>
            <TextInput value={data[key]} onChange={(v) => set(key, v)} placeholder={placeholder} />
          </FieldGroup>
        ))}
      </div>
      <Divider label="Missions" />
      {missions.length === 0 && <EmptyState Icon={FaFlag} message="No missions yet. Add your first one." />}
      {missions.map((m, i) => (
        <ArrayBlock key={i} title={`Mission ${i + 1}`} onRemove={() => removeMission(i)}>
          <FieldGroup label="Title">
            <TextInput value={m.title} onChange={(v) => updateMission(i, "title", v)} placeholder="Mission title" />
          </FieldGroup>
          <FieldGroup label="Description">
            <TextArea value={m.description} onChange={(v) => updateMission(i, "description", v)} placeholder="Mission description..." />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add Mission" onClick={addMission} />
    </>
  );
}

function HowItWorksForm({ data, onChange }) {
  const items = Array.isArray(data) ? data : [];
  const add = () => onChange([...items, { title: "", description: "" }]);
  const update = (i, field, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <>
      {items.length === 0 && <EmptyState Icon={FaCog} message="No steps yet. Add your first one." />}
      {items.map((item, i) => (
        <ArrayBlock key={i} title={`Step ${i + 1}`} onRemove={() => remove(i)}>
          <FieldGroup label="Title">
            <TextInput value={item.title} onChange={(v) => update(i, "title", v)} placeholder="Step title" />
          </FieldGroup>
          <FieldGroup label="Description">
            <TextArea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Step description..." />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add Step" onClick={add} />
    </>
  );
}

function WhyChooseUsForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const items = data.items || [];
  const addItem = () => set("items", [...items, { title: "", description: "" }]);
  const updateItem = (i, field, v) =>
    set("items", items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const removeItem = (i) => set("items", items.filter((_, idx) => idx !== i));
  const stats = [
    { key: "rating", label: "Rating", placeholder: "e.g. 4.9/5" },
    { key: "safety", label: "Safety", placeholder: "e.g. 100%" },
    { key: "happyTrekkers", label: "Happy Trekkers", placeholder: "e.g. 10k+" },
    { key: "expeditions", label: "Expeditions", placeholder: "e.g. 500+" },
  ];
  return (
    <>
      <FieldGroup label="Main Title">
        <TextInput value={data.mainTitle} onChange={(v) => set("mainTitle", v)} placeholder="Why choose us heading" />
      </FieldGroup>
      <FieldGroup label="Section Image">
        <ImageInput value={data.image} onChange={(v) => set("image", v)} />
      </FieldGroup>
      <Divider label="Stats" />
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ key, label, placeholder }) => (
          <FieldGroup key={key} label={label}>
            <TextInput value={data[key]} onChange={(v) => set(key, v)} placeholder={placeholder} />
          </FieldGroup>
        ))}
      </div>
      <Divider label="Feature Items" />
      {items.length === 0 && <EmptyState Icon={FaListUl} message="No items yet. Add your first one." />}
      {items.map((it, i) => (
        <ArrayBlock key={i} title={`Item ${i + 1}`} onRemove={() => removeItem(i)}>
          <FieldGroup label="Title">
            <TextInput value={it.title} onChange={(v) => updateItem(i, "title", v)} placeholder="Item title" />
          </FieldGroup>
          <FieldGroup label="Description">
            <TextArea value={it.description} onChange={(v) => updateItem(i, "description", v)} placeholder="Item description..." />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add Item" onClick={addItem} />
    </>
  );
}

function SafetyStandardsForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const standards = data.standards || [];
  const add = () => set("standards", [...standards, { title: "", description: "", image: "" }]);
  const update = (i, field, v) =>
    set("standards", standards.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));
  const remove = (i) => set("standards", standards.filter((_, idx) => idx !== i));
  return (
    <>
      <FieldGroup label="Title">
        <TextInput value={data.title} onChange={(v) => set("title", v)} placeholder="Safety standards title" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextArea value={data.description} onChange={(v) => set("description", v)} placeholder="Overview description..." />
      </FieldGroup>
      <Divider label="Standards" />
      {standards.length === 0 && <EmptyState Icon={FaShieldAlt} message="No standards yet. Add your first one." />}
      {standards.map((s, i) => (
        <ArrayBlock key={i} title={`Standard ${i + 1}`} onRemove={() => remove(i)}>
          <FieldGroup label="Title">
            <TextInput value={s.title} onChange={(v) => update(i, "title", v)} placeholder="Standard title" />
          </FieldGroup>
          <FieldGroup label="Description">
            <TextArea value={s.description} onChange={(v) => update(i, "description", v)} placeholder="Standard description..." />
          </FieldGroup>
          <FieldGroup label="Image">
            <ImageInput value={s.image} onChange={(v) => update(i, "image", v)} />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add Standard" onClick={add} />
    </>
  );
}

function FaqForm({ data, onChange }) {
  const items = Array.isArray(data) ? data : [];
  const add = () => onChange([...items, { category: "", question: "", answer: "" }]);
  const update = (i, field, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <>
      {items.length === 0 && <EmptyState Icon={FaQuestionCircle} message="No FAQs yet. Add your first question." />}
      {items.map((it, i) => (
        <ArrayBlock key={i} title={`FAQ ${i + 1}`} onRemove={() => remove(i)}>
          <FieldGroup label="Category">
            <TextInput value={it.category} onChange={(v) => update(i, "category", v)} placeholder="e.g. pricing, safety" />
          </FieldGroup>
          <FieldGroup label="Question">
            <TextInput value={it.question} onChange={(v) => update(i, "question", v)} placeholder="What is...?" />
          </FieldGroup>
          <FieldGroup label="Answer">
            <TextArea value={it.answer} onChange={(v) => update(i, "answer", v)} placeholder="Answer text..." />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add FAQ" onClick={add} />
    </>
  );
}

function FeaturesForm({ data, onChange }) {
  const items = Array.isArray(data) ? data : [];
  const add = () =>
    onChange([...items, { title: "", description: "", statValue: "", statLabel: "", achievementMetric: "" }]);
  const update = (i, field, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <>
      {items.length === 0 && <EmptyState Icon={FaStar} message="No features yet. Add your first one." />}
      {items.map((it, i) => (
        <ArrayBlock key={i} title={`Feature ${i + 1}`} onRemove={() => remove(i)}>
          <FieldGroup label="Title">
            <TextInput value={it.title} onChange={(v) => update(i, "title", v)} placeholder="Feature title" />
          </FieldGroup>
          <FieldGroup label="Description">
            <TextArea value={it.description} onChange={(v) => update(i, "description", v)} placeholder="Feature description..." />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Stat Value">
              <TextInput value={it.statValue} onChange={(v) => update(i, "statValue", v)} placeholder="e.g. 99%" />
            </FieldGroup>
            <FieldGroup label="Stat Label">
              <TextInput value={it.statLabel} onChange={(v) => update(i, "statLabel", v)} placeholder="e.g. Success Rate" />
            </FieldGroup>
          </div>
          <FieldGroup label="Achievement Metric">
            <TextInput value={it.achievementMetric} onChange={(v) => update(i, "achievementMetric", v)} placeholder="e.g. Top Rated 2024" />
          </FieldGroup>
        </ArrayBlock>
      ))}
      <AddButton label="Add Feature" onClick={add} />
    </>
  );
}

const FORMS = {
  hero: HeroForm,
  missionVision: MissionVisionForm,
  howItWorks: HowItWorksForm,
  whyChooseUs: WhyChooseUsForm,
  safetyStandards: SafetyStandardsForm,
  faq: FaqForm,
  features: FeaturesForm,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ show, message }) {
//   return (
//     <div className={`fixed top-6 right-6 z-50 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
//       <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-blue-500/30">
//         <FaCheck className="text-xs flex-shrink-0" />
//         {message}
//       </div>
//     </div>
//   );
// }

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SectionManager() {
  const [current, setCurrent] = useState("hero");
  const [formData, setFormData] = useState(initData());
  // const [toast, setToast] = useState({ show: false, message: "" });

  // const showToast = (message) => {
  //   setToast({ show: true, message });
  //   setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  // };

  const updateSection = (val) => setFormData((prev) => ({ ...prev, [current]: val }));

  const handleSave = () => {
    console.log(`[Save] ${current}:`, JSON.stringify(formData[current], null, 2));
    // showToast(`${SECTION_META[current].label} saved!`);
  };

  const ActiveForm = FORMS[current];
  const meta = SECTION_META[current];
  const SectionIcon = meta.Icon;
  const isArray = Array.isArray(formData[current]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6">
      {/* <Toast {...toast} /> */}
      <div className="w-full max-w-6xl">

        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/30">
              <FaTh className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">User Insights</h1>
              <p className="text-slate-400 text-xs font-medium">Manage all website content sections</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium bg-white border border-blue-100 px-3 py-1.5 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {NAV.length} sections
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl overflow-hidden border border-blue-100/80 shadow-2xl shadow-blue-100/60 flex bg-white" style={{ minHeight: 600 }}>

          {/* Sidebar */}
          <div className="w-72 min-w-56 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
            <div className="px-5 pt-6 pb-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sections</p>
            </div>
            <nav className="flex-1 px-3 pb-4 space-y-0.5">
              {NAV.map(({ key, label, Icon }) => {
                const active = current === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCurrent(key)}
                    className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                      }`}
                  >
                    <Icon className="text-sm flex-shrink-0" />
                    <span className="leading-tight truncate">{label}</span>
                    {active && <FaChevronRight className="ml-auto text-xs flex-shrink-0 opacity-70" />}
                  </button>
                );
              })}
            </nav>
            <div className="px-4 py-4 border-t border-slate-700/40">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-slate-500">Changes saved locally</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Section Header */}
            <div className="px-8 pt-7 pb-5 border-b border-blue-50 bg-gradient-to-r from-blue-600/5 via-blue-50/20 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-500/30 flex-shrink-0">
                  <SectionIcon className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-800">{meta.label}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{meta.sub}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex-shrink-0 border ${isArray ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
                  {isArray ? "List" : "Object"}
                </span>
              </div>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <ActiveForm data={formData[current]} onChange={updateSection} />
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-blue-50 bg-gradient-to-r from-blue-50/40 to-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400 font-medium">Ready to save</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { console.log("Export:", JSON.stringify(formData, null, 2)); }}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
                >
                  <FaDownload className="text-xs" /> Export JSON
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 text-sm px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaSave className="text-xs" /> Save Section
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Data stored in component state · <strong>Export JSON</strong> to get the full payload
        </p>
      </div>
    </div>
  );
}