// import React from "react";
// import { FaQuestionCircle, FaHeading } from "react-icons/fa";
// import InputField from "../form/InputField";
// import RichTextEditor from "../form/RichTextEditor";
// import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

// export default function FaqForm({ data = {}, onChange }) {
//   const set = (k, v) => onChange({ ...data, [k]: v });
//   const faqs = Array.isArray(data.faqs) ? data.faqs : [];

//   const add = () => {
//     set("faqs", [...faqs, { category: "", question: "", answer: "" }]);
//   };
//   const update = (i, field, v) => set("faqs", faqs.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
//   const remove = (i) => set("faqs", faqs.filter((_, idx) => idx !== i));

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="md:col-span-2">
//           <InputField
//             label="Main Title"
//             icon={FaHeading}
//             value={data.mainTitle || ""}
//             onChange={(e) => set("mainTitle", e.target.value)}
//             placeholder="Frequently Asked Questions"
//           />
//         </div>
//       </div>

//       <div className="pt-6 border-t border-gray-100">
//         <h3 className="text-lg font-black text-gray-800 mb-6">FAQs</h3>

//         {faqs.length === 0 && (
//           <EmptyState Icon={FaQuestionCircle} message="No FAQs yet. Add your first question." />
//         )}

//         {faqs.map((it, i) => (
//           <ArrayBlock key={i} title={`FAQ ${i + 1}`} onRemove={() => remove(i)}>
//             <div className="space-y-4">
//               <InputField
//                 label="Category"
//                 value={it.category || ""}
//                 onChange={(e) => update(i, "category", e.target.value)}
//                 placeholder="e.g. Safety, Requirements"
//               />
//               <InputField
//                 label="Question"
//                 value={it.question || ""}
//                 onChange={(e) => update(i, "question", e.target.value)}
//                 placeholder="What is...?"
//               />
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Answer</label>
//                 <RichTextEditor
//                   value={it.answer || ""}
//                   onChange={(content) => update(i, "answer", content)}
//                 />
//               </div>
//             </div>
//           </ArrayBlock>
//         ))}

//         <div className="mt-4">
//           <AddButton label="Add FAQ" onClick={add} />
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { FaQuestionCircle, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import { ArrayBlock, AddButton, EmptyState } from "./SharedFormComponents";

// Category options
const CATEGORY_OPTIONS = [
  "Safety",
  "Requirements",
  "Preparation",
  "Planning",
  "General",
  "Pricing",
];

export default function FaqForm({ data = {}, onChange, disabled = false }) {
  // Generic setter for section state
  const set = (k, v) => onChange({ ...data, [k]: v });

  // Ensure faqs array exists
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];

  // Add a new FAQ
  const add = () => {
    set("faqs", [...faqs, { category: "", question: "", answer: "" }]);
  };

  // Update a field for a specific FAQ
  const update = (i, field, value) =>
    set(
      "faqs",
      faqs.map((faq, idx) => (idx === i ? { ...faq, [field]: value } : faq))
    );

  // Remove a FAQ
  const remove = (i) => set("faqs", faqs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Main Title"
            icon={FaHeading}
            value={data.mainTitle || ""}
            onChange={(e) => set("mainTitle", e.target.value)}
            placeholder="Frequently Asked Questions"
            disabled={disabled}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">FAQs</h3>

        {faqs.length === 0 && (
          <EmptyState
            Icon={FaQuestionCircle}
            message="No FAQs yet. Add your first question."
          />
        )}

        {faqs.map((faq, i) => (
          <ArrayBlock
            key={i}
            title={`FAQ ${i + 1}`}
            onRemove={() => remove(i)}
            disabled={disabled}
          >
            <div className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                  Category
                </label>
                <select
                  value={faq.category || ""}
                  onChange={(e) => update(i, "category", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={disabled}
                >
                  <option value="">Select a category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question */}
              <InputField
                label="Question"
                value={faq.question || ""}
                onChange={(e) => update(i, "question", e.target.value)}
                placeholder="What is...?"
                disabled={disabled}
              />

              {/* Answer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
                  Answer
                </label>
                <RichTextEditor
                  value={faq.answer || ""}
                  onChange={(content) => update(i, "answer", content)}
                  readOnly={disabled}
                />
              </div>
            </div>
          </ArrayBlock>
        ))}

        {!disabled && (
          <div className="mt-4">
            <AddButton label="Add FAQ" onClick={add} />
          </div>
        )}
      </div>
    </div>
  );
}