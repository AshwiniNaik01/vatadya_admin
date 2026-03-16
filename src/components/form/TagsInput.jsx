import React, { useState } from "react";
import { HiXMark, HiPlus } from "react-icons/hi2";

const TagsInput = ({ label, value = [], onChange, placeholder = "Type and press enter..." }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue("");
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-bold text-gray-700 ml-1">{label}</label>}
            <div className="flex flex-wrap gap-2 p-2 min-h-[50px] bg-white border border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                {value.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm border border-blue-100 animate-in fade-in zoom-in duration-200"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                            <HiXMark size={14} />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 font-medium px-2 py-1 placeholder:text-gray-400"
                />
            </div>
            <p className="text-[10px] text-gray-400 font-medium ml-1 uppercase tracking-wider">Press Enter to add tag</p>
        </div>
    );
};

export default TagsInput;
