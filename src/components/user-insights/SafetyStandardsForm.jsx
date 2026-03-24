import React from "react";
import { FaShieldAlt, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import ImageUploader from "../form/ImageUploader";
import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

export default function SafetyStandardsForm({ data = {}, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const standards = Array.isArray(data.standards) ? data.standards : [];

  const add = () => set("standards", [...standards, { title: "", description: "", image: "" }]);
  const update = (i, field, v) =>
    set("standards", standards.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));
  const remove = (i) => set("standards", standards.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Section Title"
            icon={FaHeading}
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Safety standards title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Description</label>
          <RichTextEditor
            value={data.description || ""}
            onChange={(content) => set("description", content)}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Standards</h3>

        {standards.length === 0 && (
          <EmptyState Icon={FaShieldAlt} message="No standards yet. Add your first one." />
        )}

        {standards.map((s, i) => (
          <ArrayBlock key={i} title={`Standard ${i + 1}`} onRemove={() => remove(i)}>
            <div className="space-y-4">
              <InputField
                label="Standard Title"
                value={s.title || ""}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="Standard title"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Description</label>
                <RichTextEditor
                  value={s.description || ""}
                  onChange={(content) => update(i, "description", content)}
                />
              </div>

              {/* <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100"> */}
              {/* <ImageUploader
                  label="Standard Image"
                  value={s.image}
                  onChange={(file) => update(i, "image", file)}
                /> */}
              {/* 
                <ImageUploader
                  label="Standard Image"
                  value={s.image?.cdnUrl || s.image?.fullS3URL || ""}
                  onChange={(file) => update(i, "image", file)}
                />
              </div> */}
            </div>
          </ArrayBlock>
        ))}

        <div className="mt-4">
          <AddButton label="Add Standard" onClick={add} />
        </div>
      </div>
    </div>
  );
}

