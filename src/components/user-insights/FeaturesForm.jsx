import React from "react";
import { FaStar, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

export default function FeaturesForm({ data = {}, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const features = Array.isArray(data.features) ? data.features : [];
  
  const add = () => {
    set("features", [...features, { title: "", description: "", statValue: "", statLabel: "", achievementMetric: "" }]);
  };
  const update = (i, field, v) => set("features", features.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const remove = (i) => set("features", features.filter((_, idx) => idx !== i));
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Main Title"
            icon={FaHeading}
            value={data.mainTitle || ""}
            onChange={(e) => set("mainTitle", e.target.value)}
            placeholder="Our Features"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Features</h3>
        
        {features.length === 0 && (
          <EmptyState Icon={FaStar} message="No features yet. Add your first one." />
        )}

        {features.map((it, i) => (
          <ArrayBlock key={i} title={`Feature ${i + 1}`} onRemove={() => remove(i)}>
            <div className="space-y-4">
              <InputField
                label="Title"
                value={it.title || ""}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="Feature title"
              />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Description</label>
                <RichTextEditor
                  value={it.description || ""}
                  onChange={(content) => update(i, "description", content)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Stat Value"
                  value={it.statValue || ""}
                  onChange={(e) => update(i, "statValue", e.target.value)}
                  placeholder="e.g. 99%"
                />
                <InputField
                  label="Stat Label"
                  value={it.statLabel || ""}
                  onChange={(e) => update(i, "statLabel", e.target.value)}
                  placeholder="e.g. Success Rate"
                />
              </div>

              <InputField
                label="Achievement Metric"
                value={it.achievementMetric || ""}
                onChange={(e) => update(i, "achievementMetric", e.target.value)}
                placeholder="e.g. Top Rated 2024"
              />
            </div>
          </ArrayBlock>
        ))}

        <div className="mt-4">
          <AddButton label="Add Feature" onClick={add} />
        </div>
      </div>
    </div>
  );
}

