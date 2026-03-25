import React from "react";
import {
  FaFlag,
  FaChartBar,
  FaUsers,
  FaClock,
  FaHeading,
} from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import ImageUploader from "../form/ImageUploader";
import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

const STAT_ICONS = {
  peaksConquered: FaFlag,
  expeditions: FaChartBar,
  happyTrekkers: FaUsers,
  yearsOfGlory: FaClock,
};

export default function MissionVisionForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const missions = data.missions || [];
  const addMission = () =>
    set("missions", [...missions, { title: "", description: "" }]);
  const updateMission = (i, field, v) =>
    set(
      "missions",
      missions.map((m, idx) => (idx === i ? { ...m, [field]: v } : m)),
    );
  const removeMission = (i) =>
    set(
      "missions",
      missions.filter((_, idx) => idx !== i),
    );
  const stats = [
    {
      key: "peaksConquered",
      label: "Peaks Conquered",
      placeholder: "e.g. 200+",
    },
    { key: "expeditions", label: "Expeditions", placeholder: "e.g. 50" },
    {
      key: "happyTrekkers",
      label: "Happy Trekkers",
      placeholder: "e.g. 10,000+",
    },
    { key: "yearsOfGlory", label: "Years Of Glory", placeholder: "e.g. 15" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Section Title"
            icon={FaHeading}
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Section title"
          />
        </div>

        {/* <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <ImageUploader
            label="Section Image"
            // Always prefer MissionImage
            value={data.image?.cdnUrl || ""}
            onChange={(file) => set("image", file || null)}
          />
        </div> */}

        <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <ImageUploader
            label="Section Image"
            // Show uploaded image first, fallback to prefilled image
            value={
              data.MissionImage === null
                ? ""
                : (data.MissionImage?.cdnUrl ?? data.image?.cdnUrl ?? "")
            }
            // When file changes or is removed
            onChange={(file) => set("MissionImage", file || null)}
            // allowRemove={true} // if your ImageUploader supports it
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">
          Key Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map(({ key, label, placeholder }) => (
            <div key={key}>
              <InputField
                label={label}
                icon={STAT_ICONS[key]}
                value={data[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Missions</h3>
        {missions.length === 0 && (
          <EmptyState
            Icon={FaFlag}
            message="No missions yet. Add your first one."
          />
        )}
        {missions.map((m, i) => (
          <ArrayBlock
            key={i}
            title={`Mission ${i + 1}`}
            onRemove={() => removeMission(i)}
          >
            <div className="space-y-4">
              <InputField
                label="Mission Title"
                value={m.title || ""}
                onChange={(e) => updateMission(i, "title", e.target.value)}
                placeholder="Mission title"
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                  Description
                </label>
                <RichTextEditor
                  value={m.description || ""}
                  onChange={(content) =>
                    updateMission(i, "description", content)
                  }
                />
              </div>
            </div>
          </ArrayBlock>
        ))}
        <div className="mt-4">
          <AddButton label="Add Mission" onClick={addMission} />
        </div>
      </div>
    </div>
  );
}
