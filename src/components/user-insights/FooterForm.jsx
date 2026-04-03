// import React from "react";
// import {
//   FaTag,
//   FaAlignLeft,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaYoutube,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaCity,
//   FaFlag,
//   FaGlobe,
//   FaSortNumericUp,
//   FaBuilding,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import InputField from "../form/InputField";
// import RichTextEditor from "../form/RichTextEditor";

// // ── Icon maps ────────────────────────────────────────────────────────────────
// const SOCIAL_ICONS = {
//   facebook: FaFacebook,
//   instagram: FaInstagram,
//   twitter: FaTwitter,
//   youtube: FaYoutube,
// };

// const ADDRESS_ICONS = {
//   line1: FaMapMarkerAlt,
//   line2: FaMapMarkerAlt,
//   city: FaCity,
//   state: FaFlag,
//   country: FaGlobe,
//   pincode: FaSortNumericUp,
// };

// // ── Field definitions
// const SOCIAL_FIELDS = [
//   {
//     key: "facebook",
//     label: "Facebook URL",
//     placeholder: "https://facebook.com/yourpage",
//   },
//   {
//     key: "instagram",
//     label: "Instagram URL",
//     placeholder: "https://instagram.com/yourhandle",
//   },
//   {
//     key: "twitter",
//     label: "Twitter / X URL",
//     placeholder: "https://twitter.com/yourhandle",
//   },
//   {
//     key: "youtube",
//     label: "YouTube URL",
//     placeholder: "https://youtube.com/@yourchannel",
//   },
// ];

// const ADDRESS_FIELDS = [
//   {
//     key: "line1",
//     label: "Address Line 1",
//     placeholder: "e.g. 123 Alpine Terminal",
//   },
//   {
//     key: "line2",
//     label: "Address Line 2",
//     placeholder: "e.g. Base Station, Sector 7",
//   },
//   { key: "city", label: "City", placeholder: "e.g. Pune" },
//   { key: "state", label: "State", placeholder: "e.g. Maharashtra" },
//   { key: "country", label: "Country", placeholder: "e.g. India" },
//   { key: "pincode", label: "Pincode", placeholder: "e.g. 400001" },
// ];

// // ── Component ────────────────────────────────────────────────────────────────
// export default function FooterForm({ data = {}, onChange, disabled = false }) {
//   // Shallow section setter  →  { ...data, brand: { ...data.brand, tagline: v } }
//   const setSection = (section, key, value) =>
//     onChange({
//       ...data,
//       [section]: { ...(data[section] || {}), [key]: value },
//     });

//   // Deep address setter  →  contact.address.*
//   const setAddress = (key, value) =>
//     onChange({
//       ...data,
//       contact: {
//         ...(data.contact || {}),
//         address: { ...(data.contact?.address || {}), [key]: value },
//       },
//     });

//   // Shortcuts
//   const brand = data.brand || {};
//   const social = data.socialLinks || {};
//   const contact = data.contact || {};
//   const address = contact.address || {};
//   const footerBottom = data.footerBottom || {};

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       {/* Brand ── */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Tagline */}
//         <div className="md:col-span-2">
//           <InputField
//             label="Tagline"
//             icon={FaTag}
//             value={brand.tagline || ""}
//             onChange={(e) => setSection("brand", "tagline", e.target.value)}
//             placeholder="e.g. Operational since 2013"
//             disabled={disabled}
//           />
//         </div>

//         {/* Description */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
//             Description
//           </label>
//           <RichTextEditor
//             value={brand.description || ""}
//             onChange={(content) => setSection("brand", "description", content)}
//             readOnly={disabled}
//           />
//         </div>
//       </div>

//       {/* Social Links ── */}
//       <div className="pt-6 border-t border-gray-100">
//         <h3 className="text-lg font-black text-gray-800 mb-6">
//           Social Media Links
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
//             <InputField
//               key={key}
//               label={label}
//               icon={SOCIAL_ICONS[key]}
//               value={social[key] || ""}
//               onChange={(e) => setSection("socialLinks", key, e.target.value)}
//               placeholder={placeholder}
//               disabled={disabled}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Contact ── */}
//       <div className="pt-6 border-t border-gray-100">
//         <h3 className="text-lg font-black text-gray-800 mb-6">
//           Contact Details
//         </h3>

//         {/* Phone + Email */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <InputField
//             label="Phone"
//             icon={FaPhone}
//             value={contact.phone || ""}
//             onChange={(e) => setSection("contact", "phone", e.target.value)}
//             placeholder="e.g. +91 8806058687"
//             disabled={disabled}
//           />
//           <InputField
//             label="Email"
//             icon={FaEnvelope}
//             value={contact.email || ""}
//             onChange={(e) => setSection("contact", "email", e.target.value)}
//             placeholder="e.g. hello@vatadya.com"
//             disabled={disabled}
//           />
//         </div>

//         {/* Address card — mirrors HeroForm's image card style */}
//         <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
//           <h4 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-6">
//             Address
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {ADDRESS_FIELDS.map(({ key, label, placeholder }) => (
//               <InputField
//                 key={key}
//                 label={label}
//                 icon={ADDRESS_ICONS[key]}
//                 value={address[key] || ""}
//                 onChange={(e) => setAddress(key, e.target.value)}
//                 placeholder={placeholder}
//                 disabled={disabled}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer Bottom ── */}
//       <div className="pt-6 border-t border-gray-100">
//         <h3 className="text-lg font-black text-gray-800 mb-6">Footer Bottom</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <InputField
//             label="Copyright Year"
//             icon={FaCalendarAlt}
//             value={String(footerBottom.year || "")}
//             onChange={(e) =>
//               onChange({
//                 ...data,
//                 footerBottom: {
//                   ...footerBottom,
//                   year: Number(e.target.value) || e.target.value,
//                 },
//               })
//             }
//             placeholder="e.g. 2026"
//             disabled={disabled}
//           />
//           <InputField
//             label="Company Name"
//             icon={FaBuilding}
//             value={footerBottom.companyName || ""}
//             onChange={(e) =>
//               onChange({
//                 ...data,
//                 footerBottom: {
//                   ...footerBottom,
//                   companyName: e.target.value,
//                 },
//               })
//             }
//             placeholder="e.g. VATADYA_HQ"
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import {
  FaTag,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaGlobe,
  FaSortNumericUp,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";
import InputField from "../form/InputField";
import RichTextEditor from "../form/RichTextEditor";

// ── Icon maps ─────────────────────────────────────────────────────────────────
const SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
};

const ADDRESS_ICONS = {
  line1: FaMapMarkerAlt,
  line2: FaMapMarkerAlt,
  city: FaCity,
  state: FaFlag,
  country: FaGlobe,
  pincode: FaSortNumericUp,
};

// ── Field definitions ─────────────────────────────────────────────────────────
const SOCIAL_FIELDS = [
  {
    key: "facebook",
    label: "Facebook URL",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    key: "instagram",
    label: "Instagram URL",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    key: "twitter",
    label: "Twitter / X URL",
    placeholder: "https://twitter.com/yourhandle",
  },
  {
    key: "youtube",
    label: "YouTube URL",
    placeholder: "https://youtube.com/@yourchannel",
  },
];

const ADDRESS_FIELDS = [
  {
    key: "line1",
    label: "Address Line 1",
    placeholder: "e.g. 123 Alpine Terminal",
  },
  {
    key: "line2",
    label: "Address Line 2",
    placeholder: "e.g. Base Station, Sector 7",
  },
  { key: "city", label: "City", placeholder: "e.g. Pune" },
  { key: "state", label: "State", placeholder: "e.g. Maharashtra" },
  { key: "country", label: "Country", placeholder: "e.g. India" },
  { key: "pincode", label: "Pincode", placeholder: "e.g. 400001" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function FooterForm({ data = {}, onChange, disabled = false }) {
  const setSection = (section, key, value) =>
    onChange({
      ...data,
      [section]: { ...(data[section] || {}), [key]: value },
    });

  const setAddress = (key, value) =>
    onChange({
      ...data,
      contact: {
        ...data.contact,
        address: { ...(data.contact?.address || {}), [key]: value },
      },
    });

  const setFooterBottom = (key, value) =>
    onChange({
      ...data,
      footerBottom: { ...data.footerBottom, [key]: value },
    });

  // ── Shorthands ────────────────────────────────────────────────────────────
  const brand = data.brand || {};
  const social = data.socialLinks || {};
  const contact = data.contact || {};
  const address = contact.address || {};
  const footerBottom = data.footerBottom || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🧩 Brand ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputField
            label="Tagline"
            icon={FaTag}
            value={brand.tagline || ""}
            onChange={(e) => setSection("brand", "tagline", e.target.value)}
            placeholder="e.g. Operational since 2013"
            disabled={disabled}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">
            Description
          </label>
          <RichTextEditor
            value={brand.description || ""}
            onChange={(content) => setSection("brand", "description", content)}
            readOnly={disabled}
          />
        </div>
      </div>

      {/* 🌐 Social Links ── */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
            <InputField
              key={key}
              label={label}
              icon={SOCIAL_ICONS[key]}
              value={social[key] || ""}
              onChange={(e) => setSection("socialLinks", key, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* 📡 Contact ── */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Phone"
            icon={FaPhone}
            value={contact.phone || ""}
            onChange={(e) => setSection("contact", "phone", e.target.value)}
            placeholder="e.g. +91 8806058687"
            disabled={disabled}
          />
          <InputField
            label="Email"
            icon={FaEnvelope}
            value={contact.email || ""}
            onChange={(e) => setSection("contact", "email", e.target.value)}
            placeholder="e.g. hello@vatadya.com"
            disabled={disabled}
          />
        </div>

        {/* Address card */}
        <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-6">
            Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ADDRESS_FIELDS.map(({ key, label, placeholder }) => (
              <InputField
                key={key}
                label={label}
                icon={ADDRESS_ICONS[key]}
                value={address[key] || ""}
                onChange={(e) => setAddress(key, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ⚙️ Footer Bottom ── */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-800 mb-6">Footer Bottom</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Copyright Year"
            icon={FaCalendarAlt}
            value={String(footerBottom.year || "")}
            onChange={(e) =>
              setFooterBottom("year", Number(e.target.value) || e.target.value)
            }
            placeholder="e.g. 2026"
            disabled={disabled}
          />
          <InputField
            label="Company Name"
            icon={FaBuilding}
            value={footerBottom.companyName || ""}
            onChange={(e) => setFooterBottom("companyName", e.target.value)}
            placeholder="e.g. VATADYA_HQ"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
