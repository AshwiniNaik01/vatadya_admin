import { FaTrash, FaPlus } from "react-icons/fa";

export const inputCls =
  "w-full text-sm px-4 py-2.5 rounded-xl border border-blue-100 bg-white text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm transition-all hover:border-blue-200";

export function FieldGroup({ label, Icon, children }) {
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

export function TextInput({ value, onChange, placeholder }) {
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

export function TextArea({ value, onChange, placeholder }) {
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

export function ImageInput({ value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange(file);
  };

  return <input type="file" accept="image/*" onChange={handleFile} />;
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-transparent" />
      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.18em]">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-blue-100 to-transparent" />
    </div>
  );
}

export function ArrayBlock({ title, onRemove, children }) {
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

export function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 text-blue-500 text-sm font-semibold hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 mt-1"
    >
      <FaPlus className="text-xs" /> {label}
    </button>
  );
}

export function EmptyState({ Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
        {Icon && <Icon className="text-2xl text-blue-200" />}
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}
