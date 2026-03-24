import React from "react";
import { FaCog, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import {
  ArrayBlock,
  AddButton,
  EmptyState,
} from "./SharedFormComponents";

export default function HowItWorksForm({ data = {}, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });

  const phases = Array.isArray(data.phases) ? data.phases : [];

  const add = () => {
    if (phases.length >= 5) return;
    set("phases", [...phases, { title: "", description: "" }]);
  };

  const update = (i, field, v) => {
    const updated = phases.map((it, idx) =>
      idx === i ? { ...it, [field]: v } : it
    );
    set("phases", updated);
  };

  const remove = (i) => {
    const updated = phases.filter((_, idx) => idx !== i);
    set("phases", updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Section Title"
            icon={FaHeading}
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="How It Works Title"
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
        <h3 className="text-lg font-black text-gray-800 mb-6">Phases</h3>

        {phases.length === 0 && (
          <EmptyState Icon={FaCog} message="No phases yet. Add your first one." />
        )}

        {phases.map((item, i) => (
          <ArrayBlock
            key={i}
            title={`Phase ${i + 1}`}
            onRemove={() => remove(i)}
          >
            <div className="space-y-4">
              <InputField
                label="Phase Title"
                value={item.title || ""}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="Phase title"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Description</label>
                <RichTextEditor
                  value={item.description || ""}
                  onChange={(content) => update(i, "description", content)}
                />
              </div>
            </div>
          </ArrayBlock>
        ))}

        {phases.length < 5 && (
          <div className="mt-4">
            <AddButton label="Add Phase" onClick={add} />
          </div>
        )}
      </div>
    </div>
  );
}