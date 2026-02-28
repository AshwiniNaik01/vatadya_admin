import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiX } from "react-icons/hi";

const CustomSelect = ({ options, isMulti, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (isMulti) {
      const isSelected = value?.some((v) => v.value === option.value);
      if (isSelected) {
        onChange(value.filter((v) => v.value !== option.value));
      } else {
        onChange([...(value || []), option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };
  

  const removeOption = (e, option) => {
    e.stopPropagation();
    onChange(value.filter((v) => v.value !== option.value));
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="min-h-[42px] w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-2 items-center cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isMulti ? (
          <div className="flex flex-wrap gap-1 flex-1">
            {value && value.length > 0 ? (
              value.map((v) => (
                <span
                  key={v.value}
                  className="bg-emerald-100 text-emerald-800 text-sm px-2 py-0.5 rounded-md flex items-center gap-1 group"
                >
                  {v.label}
                  <HiX
                    className="cursor-pointer hover:text-emerald-900"
                    onClick={(e) => removeOption(e, v)}
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
        ) : (
          <div className="flex-1 text-gray-700">
            {value ? value.label : <span className="text-gray-400">{placeholder}</span>}
          </div>
        )}
        <HiChevronDown className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 cursor-pointer transition-colors hover:bg-emerald-50 ${
                (isMulti ? value?.some((v) => v.value === option.value) : value?.value === option.value)
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
