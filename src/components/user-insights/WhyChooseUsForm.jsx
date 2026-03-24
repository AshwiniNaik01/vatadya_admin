import React from "react";
import { FaListUl, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import ImageUploader from "../form/ImageUploader";
import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

export default function WhyChooseUsForm({ data, onChange, disabled = false }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const whyUsItems = data.whyUsItems || [];
  const addItem = () => {
    if (whyUsItems.length >= 3) return;
    set("whyUsItems", [...whyUsItems, { title: "", description: "" }]);
  };
  const updateItem = (i, field, v) =>
    set("whyUsItems", whyUsItems.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const removeItem = (i) => set("whyUsItems", whyUsItems.filter((_, idx) => idx !== i));
  const stats = [
    { key: "rating", label: "Rating", placeholder: "e.g. 4.9/5" },
    { key: "safety", label: "Safety", placeholder: "e.g. 100%" },
    { key: "happyTrekkers", label: "Happy Trekkers", placeholder: "e.g. 10k+" },
    { key: "expeditions", label: "Expeditions", placeholder: "e.g. 500+" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Main Title"
            icon={FaHeading}
            value={data.mainTitle || ""}
            onChange={(e) => set("mainTitle", e.target.value)}
            placeholder="Why choose us heading"
          />
        </div>

        <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          {/* <ImageUploader
            label="Section Image"
            value={data.image}
            onChange={(file) => set("image", file)}
          /> */}

          <ImageUploader
            label="Section Image"
            value={data.image?.fullS3URL || ""}
            onChange={(file) => set("image", file)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Key Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map(({ key, label, placeholder }) => (
            <div key={key}>
              <InputField
                label={label}
                value={data[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Why Us Items (Max 3)</h3>

        {whyUsItems.length === 0 && (
          <EmptyState Icon={FaListUl} message="No items yet. Add your first one." />
        )}

        {whyUsItems.map((it, i) => (
          <ArrayBlock key={i} title={`Item ${i + 1}`} onRemove={() => removeItem(i)}>
            <div className="space-y-4">
              <InputField
                label="Item Title"
                value={it.title || ""}
                onChange={(e) => updateItem(i, "title", e.target.value)}
                placeholder="Item title"
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Description</label>
                <RichTextEditor
                  value={it.description || ""}
                  onChange={(content) => updateItem(i, "description", content)}
                />
              </div>
            </div>
          </ArrayBlock>
        ))}

        {whyUsItems.length < 3 && (
          <div className="mt-4">
            <AddButton label="Add Item" onClick={addItem} />
          </div>
        )}
      </div>
    </div>
  );
}

