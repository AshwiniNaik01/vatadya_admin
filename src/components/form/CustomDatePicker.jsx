import React from "react";
import { HiCalendar } from "react-icons/hi";

const CustomDatePicker = ({ startDate, endDate, onChange, placeholder = "Select date range" }) => {
    // We'll use two native date inputs for maximum compatibility without extra libraries
    // but wrap them in a nicely styled container.

    const handleStartChange = (e) => {
        const val = e.target.value ? new Date(e.target.value) : null;
        onChange([val, endDate]);
    };

    const handleEndChange = (e) => {
        const val = e.target.value ? new Date(e.target.value) : null;
        onChange([startDate, val]);
    };

    const formatDateForInput = (date) => {
        if (!date) return "";
        // If it's already a string in YYYY-MM-DD format, return it
        if (typeof date === "string") {
            return date.split("T")[0];
        }
        // If it's a Date object, use toISOString
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().split("T")[0];
        }
        return "";
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 border border-gray-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <div className="flex items-center gap-3 flex-1 w-full">
                <HiCalendar className="text-emerald-600 text-xl" />
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Start Date</span>
                    <input
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={handleStartChange}
                        className="w-full bg-transparent border-none outline-none text-gray-700 font-medium p-0 focus:ring-0"
                    />
                </div>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-gray-200 mx-2" />

            <div className="flex items-center gap-3 flex-1 w-full">
                <HiCalendar className="text-emerald-400 text-xl" />
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">End Date</span>
                    <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={handleEndChange}
                        className="w-full bg-transparent border-none outline-none text-gray-700 font-medium p-0 focus:ring-0"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomDatePicker;
