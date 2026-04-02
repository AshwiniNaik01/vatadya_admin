import React, { useState, useEffect } from "react";

const TimePickerDropdowns = ({ label, name, value, onChange, error }) => {
  // Function to parse HH:mm into 12h format
  const parseTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === "") {
      return { h: "12", m: "00", p: "AM" };
    }

    const parts = timeStr.split(":");
    if (parts.length !== 2) {
      return { h: "12", m: "00", p: "AM" };
    }

    let h24 = parseInt(parts[0], 10);
    let m = parts[1];

    let p = h24 >= 12 ? "PM" : "AM";
    let h12 = h24 % 12 || 12;

    return {
      h: h12.toString().padStart(2, "0"),
      m: m.padStart(2, "0"),
      p,
    };
  };

  const initialTime = parseTime(value);

  const [hour, setHour] = useState(initialTime.h);
  const [minute, setMinute] = useState(initialTime.m);
  const [period, setPeriod] = useState(initialTime.p);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Set default value if empty
    if (!value) {
      handleTimeChange("12", "00", "AM");
    }
  }, []);

  // Sync when value changes from parent
  useEffect(() => {
    const updatedTime = parseTime(value);
    setHour(updatedTime.h);
    setMinute(updatedTime.m);
    setPeriod(updatedTime.p);
  }, [value]);

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    let h24 = parseInt(newHour, 10);

    if (newPeriod === "PM" && h24 < 12) h24 += 12;
    if (newPeriod === "AM" && h24 === 12) h24 = 0;

    const cleanMinute = newMinute.toString().padStart(2, "0");
    const cleanHour = h24.toString().padStart(2, "0");
    const value24 = `${cleanHour}:${cleanMinute}`;

    if (onChange) {
      onChange(value24);
    }
  };

  const displayError = error;

  const selectClasses = `flex-1 px-2 py-2 rounded-lg border transition duration-300 outline-none bg-white
    ${
      displayError
        ? "border-red-500 focus:border-red-500"
        : "border-blue-400 focus:border-blue-500"
    }
    focus:ring-2 focus:ring-opacity-50
    ${displayError ? "focus:ring-red-300" : "focus:ring-blue-300"}
  `;

  if (!mounted) {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="flex gap-2 h-[42px]">
          <div className="flex-1 rounded-lg border border-blue-400 bg-white"></div>
          <div className="flex-1 rounded-lg border border-blue-400 bg-white"></div>
          <div className="flex-1 rounded-lg border border-blue-400 bg-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1 border border-blue-400 p-2 rounded-lg bg-blue-50">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        {/* Hour */}
        <select
          value={hour}
          onChange={(e) => {
            setHour(e.target.value);
            handleTimeChange(e.target.value, minute, period);
          }}
          className={selectClasses}
        >
          {Array.from({ length: 12 }, (_, i) =>
            (i + 1).toString().padStart(2, "0"),
          ).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Minute */}
        <select
          value={minute}
          onChange={(e) => {
            setMinute(e.target.value);
            handleTimeChange(hour, e.target.value, period);
          }}
          className={selectClasses}
        >
          {Array.from({ length: 60 }, (_, i) =>
            i.toString().padStart(2, "0"),
          ).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            handleTimeChange(hour, minute, e.target.value);
          }}
          className={selectClasses}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      {displayError && (
        <div className="text-red-500 text-xs font-medium">{displayError}</div>
      )}
    </div>
  );
};

export default TimePickerDropdowns;
