import React from "react";

const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder, error, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-bold text-gray-700 ml-1">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={(e) => e.target.select()}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? "pl-11" : "px-4"} py-3 bg-white border ${error ? "border-red-400 bg-red-50" : "border-gray-200 group-hover:border-gray-300"
                        } rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
        </div>
    );
};

export default InputField;
