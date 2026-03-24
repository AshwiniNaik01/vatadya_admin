// import React from "react";
// import { FaMapMarkerAlt, FaRuler, FaClock, FaHeading } from "react-icons/fa";
// import InputField from "../form/InputField";
// import RichTextEditor from "../form/RichTextEditor";
// import ImageUploader from "../form/ImageUploader";

// const STAT_ICONS = {
//   peaksClimbed: FaMapMarkerAlt,
//   totalDistance: FaRuler,
//   avgAltitude: FaMapMarkerAlt,
//   trekTime: FaClock,
// };

// export default function HeroForm({ data, onChange, disabled = false }) {
//   const set = (k, v) => onChange({ ...data, [k]: v });
//   const stats = [
//     { key: "peaksClimbed", label: "Peaks Climbed", placeholder: "e.g. 120+" },
//     { key: "totalDistance", label: "Total Distance", placeholder: "e.g. 5000 km" },
//     { key: "avgAltitude", label: "Avg Altitude", placeholder: "e.g. 4200 m" },
//     { key: "trekTime", label: "Trek Time", placeholder: "e.g. 7–14 days" },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="md:col-span-2">
//           <InputField
//             label="Hero Title"
//             icon={FaHeading}
//             value={data.title || ""}
//             onChange={(e) => set("title", e.target.value)}
//             placeholder="Enter hero title"
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//             Description
//           </label>
//           <RichTextEditor
//             value={data.description || ""}
//             onChange={(content) => set("description", content)}
//           />
//         </div>

//         <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
//           {/* <ImageUploader
//             label="Hero Image"
//             value={data.image}
//             onChange={(file) => set("image", file)}
//           /> */}

//           <ImageUploader
//             label="Hero Image"
//             value={data.image?.cdnUrl || ""}   // ✅ prefilled from API response
//             onChange={(file) => set("image", file)}
//           // disabled={disabled}               // ✅ respect view mode
//           />
//         </div>
//       </div>

//       <div className="pt-6 border-t border-gray-100">
//         <h3 className="text-lg font-black text-gray-800 mb-6">Key Statistics</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {stats.map(({ key, label, placeholder }) => (
//             <div key={key}>
//               <InputField
//                 label={label}
//                 icon={STAT_ICONS[key]}
//                 value={data[key] || ""}
//                 onChange={(e) => set(key, e.target.value)}
//                 placeholder={placeholder}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";
import { FaMapMarkerAlt, FaRuler, FaClock, FaHeading } from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";
import ImageUploader from "../form/ImageUploader";

const STAT_ICONS = {
  peaksClimbed: FaMapMarkerAlt,
  totalDistance: FaRuler,
  avgAltitude: FaMapMarkerAlt,
  trekTime: FaClock,
};

export default function HeroForm({ data, onChange, disabled = false }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  const stats = [
    { key: "peaksClimbed", label: "Peaks Climbed", placeholder: "e.g. 120+" },
    { key: "totalDistance", label: "Total Distance", placeholder: "e.g. 5000 km" },
    { key: "avgAltitude", label: "Avg Altitude", placeholder: "e.g. 4200 m" },
    { key: "trekTime", label: "Trek Time", placeholder: "e.g. 7–14 days" },
  ];

  // Handle image: support both string URL or object from backend
  const imageValue =
    typeof data.image === "string"
      ? data.image
      : data.image?.cdnUrl || ""; // fallback to empty string

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hero Title */}
        <div className="md:col-span-2">
          <InputField
            label="Hero Title"
            icon={FaHeading}
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Enter hero title"
            disabled={disabled} // ✅ respect view mode
          />
        </div>

        {/* Hero Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
            Description
          </label>
          <RichTextEditor
            value={data.description || ""}
            onChange={(content) => set("description", content)}
            readOnly={disabled} // ✅ respect view mode
          />
        </div>

        {/* Hero Image */}
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <ImageUploader
            label="Hero Image"
            value={imageValue}
            onChange={(file) => set("image", file)}
            disabled={disabled} // ✅ respect view mode
          />
        </div>
      </div>

      {/* Key Statistics */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Key Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map(({ key, label, placeholder }) => (
            <InputField
              key={key}
              label={label}
              icon={STAT_ICONS[key]}
              value={data[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              disabled={disabled} // ✅ respect view mode
            />
          ))}
        </div>
      </div>
    </div>
  );
}