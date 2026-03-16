import React from "react";

const RadioButton = ({ label, name, value, checked, onChange, id }) => {
    return (
        <label
            htmlFor={id}
            className="flex items-center gap-3 cursor-pointer group select-none"
        >
            <div className="relative">
                <input
                    type="radio"
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={(e) => onChange(e.target.value)}
                    className="peer sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded-full transition-all duration-200 flex items-center justify-center
          ${checked
                        ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-300 bg-white group-hover:border-blue-400"}`}
                >
                    {checked && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-in zoom-in duration-200" />
                    )}
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

export default RadioButton;
