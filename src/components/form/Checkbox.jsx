import React from "react";
import { HiCheck } from "react-icons/hi2";

const Checkbox = ({ label, checked, onChange, id }) => {
    return (
        <label
            htmlFor={id}
            className="flex items-center gap-3 cursor-pointer group select-none"
        >
            <div className="relative">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-200 flex items-center justify-center
          ${checked
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 bg-white group-hover:border-blue-400"}`}
                >
                    {checked && <HiCheck className="text-white text-lg animate-in zoom-in duration-200" />}
                </div>
            </div>
            {label && (
                <span className={`text-sm font-bold transition-colors ${checked ? "text-blue-900" : "text-gray-600"}`}>
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
