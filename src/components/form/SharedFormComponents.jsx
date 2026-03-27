import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

// ─── ArrayBlock ───────────────────────────────────────────────────────────────
// Wraps a repeatable form item with a title bar and optional remove button
export function ArrayBlock({ title, onRemove, children, compact = false }) {
  return (
    <div
      className={`relative bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${compact ? "p-4" : "p-5"} mb-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full bg-linear-to-b from-blue-600 to-blue-400" />
          <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
            {title}
          </span>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all duration-200"
            title="Remove"
          >
            <FaTrash className="text-[10px]" />
          </button>
        )}
      </div>
      {/* Content */}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ─── AddButton ────────────────────────────────────────────────────────────────
// Dashed full-width button for adding new array items
export function AddButton({ label = "Add Item", onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-blue-200 text-blue-500 text-sm font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <FaPlus className="text-[9px] text-blue-500" />
      </div>
      {label}
    </button>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
// Shown when an array is empty
export function EmptyState({ Icon, message = "Nothing here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
        {Icon && <Icon className="text-blue-200 text-xl" />}
      </div>
      <p className="text-sm text-slate-400 font-medium text-center">
        {message}
      </p>
    </div>
  );
}
