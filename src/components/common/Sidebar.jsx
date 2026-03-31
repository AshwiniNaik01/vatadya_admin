// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaMountain,
//   FaClipboardList,
//   FaUsers,
//   FaImages,
//   FaBars,
//   FaChevronDown,
//   FaStar,
//   FaEnvelope,
//   FaInfoCircle,
// } from "react-icons/fa";

// const menuItems = [
//   { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
//   { name: "Booking Treks", path: "/bookingTreks", icon: <FaMountain /> },
//   {
//     name: "Trekk Categories",
//     icon: <FaClipboardList />,
//     submenu: [
//       { name: "Create Trekk Category", path: "/categories/create" },
//       { name: "Manage Trekk Categories", path: "/categories/manage" },
//     ],
//   },
//   {
//     name: "Treks",
//     icon: <FaMountain />,
//     submenu: [
//       { name: "Create Trek", path: "/treks/create" },
//       { name: "Manage Treks", path: "/treks/manage" },
//     ],
//   },
//   {
//     name: "Stay",
//     path: "/stay",
//     icon: <FaHome />,
//     submenu: [
//       { name: "Create Stay", path: "/stay/create" },
//       { name: "Manage Stay", path: "/stay/manage" },
//     ],
//   },
//   {
//     name: "Bookings",
//     path: "/bookings",
//     icon: <FaClipboardList />,
//     submenu: [{ name: "Manage Bookings", path: "/bookings/manage" }],
//   },
//   {
//     name: "Gallery",
//     path: "/gallery",
//     icon: <FaImages />,
//     submenu: [
//       { name: "Create Gallery Item", path: "/gallery/create" },
//       { name: "Manage Gallery Items", path: "/gallery/manage" },
//     ],
//   },
//   // { name: "Reviews", path: "/reviews/manage", icon: <FaStar /> },
//   // {
//   //   name: "Slots",
//   //   path: "/slots",
//   //   icon: <FaImages />,
//   //   submenu: [
//   //     { name: "Create Slot", path: "/slots/create" },
//   //     { name: "Manage Slots", path: "/slots/manage" },
//   //   ],
//   // },
//   { name: "Contacts", path: "/contacts", icon: <FaUsers /> },
//   {
//     name: "User Insights",
//     icon: <FaMountain />,
//     submenu: [
//       { name: "Hero", path: "/userInsights/hero" },
//       { name: "Mission and Vision", path: "/userInsights/missionVision" },
//       { name: "How it Works", path: "/userInsights/howItWorks" },
//       { name: "Why Choose Us", path: "/userInsights/whyChooseUs" },
//       { name: "Safety Standards", path: "/userInsights/safetyStandards" },
//       { name: "FAQs", path: "/userInsights/faq" },
//       { name: "Features", path: "/userInsights/features" },
//       { name: "About US", path: "/aboutUs" },
//       { name: "Contact US", path: "/contactUs" },
//       { name: "Footer", path: "/userInsights/footer" },
//     ],
//   },
//   { name: "User Management", path: "/users", icon: <FaUsers /> },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [openSubmenu, setOpenSubmenu] = useState("");

//   return (
//     <aside
//       className={`h-screen flex flex-col bg-linear-to-b from-blue-950 to-blue-900 text-white shadow-2xl transition-all duration-300 border-r border-blue-800/50
//     ${collapsed ? "w-22" : "w-72"}`}
//     >
//       {/* HEADER / LOGO + HAMBURGER */}
//       <div className="flex items-center justify-between p-6 border-b border-blue-800/50">
//         {!collapsed && (
//           <div className="flex flex-col">
//             <h1 className="text-xl font-black flex items-center gap-3">
//               <div className="p-1.5 bg-white rounded-lg shadow-inner">
//                 <img
//                   src="/vatadya_logo.png"
//                   alt="Vatadya Logo"
//                   className="h-7 w-7 object-contain"
//                 />
//               </div>
//               <span className="tracking-tight">
//                 Admin <span className="text-blue-400">Panel</span>
//               </span>
//             </h1>
//             <p className="text-[10px] text-blue-300/60 uppercase tracking-[0.3em] mt-2 font-bold">
//               Management Suite
//             </p>
//           </div>
//         )}

//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="p-2.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 text-blue-200 hover:text-white"
//         >
//           <FaBars size={18} />
//         </button>
//       </div>

//       {/* NAV */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
//         {menuItems.map((item) =>
//           item.submenu ? (
//             <div key={item.name} className="space-y-1">
//               {/* Parent Button */}
//               <button
//                 onClick={() =>
//                   setOpenSubmenu(openSubmenu === item.name ? "" : item.name)
//                 }
//                 className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all duration-300 group
//                 ${
//                   openSubmenu === item.name
//                     ? "bg-blue-600/20 text-blue-100 shadow-inner"
//                     : "text-blue-300/80 hover:bg-white/5 hover:text-white"
//                 }
//                 ${collapsed ? "justify-center px-0" : ""}`}
//               >
//                 <div className="flex items-center gap-4">
//                   <span
//                     className={`text-xl transition-transform duration-300 group-hover:scale-110 ${
//                       openSubmenu === item.name ? "text-blue-400" : ""
//                     }`}
//                   >
//                     {item.icon}
//                   </span>
//                   {!collapsed && (
//                     <span className="font-semibold tracking-wide">
//                       {item.name}
//                     </span>
//                   )}
//                 </div>
//                 {!collapsed && (
//                   <FaChevronDown
//                     className={`text-xs transition-transform duration-500 ${
//                       openSubmenu === item.name
//                         ? "rotate-180 text-blue-400"
//                         : "opacity-40"
//                     }`}
//                   />
//                 )}
//               </button>

//               {/* Submenu */}
//               {!collapsed && openSubmenu === item.name && (
//                 <div className="ml-9 mt-1 flex flex-col space-y-1 border-l border-blue-800/50 pl-4 py-1">
//                   {item.submenu.map((sub) => (
//                     <NavLink
//                       key={sub.name}
//                       to={sub.path}
//                       className={({ isActive }) =>
//                         `px-4 py-2.5 rounded-xl text-sm transition-all duration-200
//                         ${
//                           isActive
//                             ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40"
//                             : "text-blue-300/60 hover:text-white hover:bg-white/5"
//                         }`
//                       }
//                     >
//                       {sub.name}
//                     </NavLink>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               end
//               className={({ isActive }) =>
//                 `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
//                 ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-xl shadow-blue-950/50 font-bold"
//                     : "text-blue-300/80 hover:bg-white/5 hover:text-white"
//                 }
//                 ${collapsed ? "justify-center px-0" : ""}`
//               }
//             >
//               <span
//                 className={`text-xl transition-transform duration-300 group-hover:scale-110`}
//               >
//                 {item.icon}
//               </span>
//               {!collapsed && (
//                 <span className="font-semibold tracking-wide">{item.name}</span>
//               )}
//             </NavLink>
//           ),
//         )}
//       </nav>
//     </aside>
//   );
// }

// import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaMountain,
//   FaClipboardList,
//   FaUsers,
//   FaImages,
//   FaBars,
//   FaChevronDown,
//   FaChevronUp,
//   FaLock,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { MdOutlineDashboard } from "react-icons/md";
// import { useAuth } from "../../contexts/AuthContest";
// import { canAccessModule, canPerformAction } from "../../utils/PermissionUtils";
// import apiClient from "../../api/axiosInstance";

// // ----------------------- MENU CONFIG ------------------------------
// const menuItems = [
//   {
//     label: "Dashboard",
//     path: "/dashboard",
//     icon: <MdOutlineDashboard />,
//     module: "dashboard",
//   },
//   {
//     label: "Booking Treks",
//     path: "/bookingTreks",
//     icon: <FaMountain />,
//     module: "trek",
//     action: "read",
//   },
//   {
//     label: "Trekk Categories",
//     icon: <FaClipboardList />,
//     module: "trekCategory",
//     children: [
//       {
//         label: "Create Trekk Category",
//         path: "/categories/create",
//         module: "trekCategory",
//         action: "create",
//       },
//       {
//         label: "Manage Trekk Categories",
//         path: "/categories/manage",
//         module: "trekCategory",
//         action: "read",
//       },
//     ],
//   },
//   {
//     label: "Treks",
//     icon: <FaMountain />,
//     module: "trek",
//     children: [
//       {
//         label: "Create Trek",
//         path: "/treks/create",
//         module: "trek",
//         action: "create",
//       },
//       {
//         label: "Manage Treks",
//         path: "/treks/manage",
//         module: "trek",
//         action: "read",
//       },
//     ],
//   },
//   {
//     label: "Stay",
//     icon: <FaHome />,
//     module: "stay",
//     children: [
//       {
//         label: "Create Stay",
//         path: "/stay/create",
//         module: "stay",
//         action: "create",
//       },
//       {
//         label: "Manage Stay",
//         path: "/stay/manage",
//         module: "stay",
//         action: "read",
//       },
//     ],
//   },
//   {
//     label: "Bookings",
//     icon: <FaClipboardList />,
//     module: "booking",
//     children: [
//       {
//         label: "Manage Bookings",
//         path: "/bookings/manage",
//         module: "booking",
//         action: "read",
//       },
//     ],
//   },
//   {
//     label: "Gallery",
//     icon: <FaImages />,
//     module: "gallery",
//     children: [
//       {
//         label: "Create Gallery Item",
//         path: "/gallery/create",
//         module: "gallery",
//         action: "create",
//       },
//       {
//         label: "Manage Gallery Items",
//         path: "/gallery/manage",
//         module: "gallery",
//         action: "read",
//       },
//     ],
//   },
//   {
//     label: "Contacts",
//     path: "/contacts",
//     icon: <FaUsers />,
//     module: "contact",
//     action: "read",
//   },
//   {
//     label: "User Insights",
//     icon: <FaInfoCircle />,
//     module: "userInsight",
//     children: [
//       { label: "Hero", path: "/userInsights/hero", module: "userInsight" },
//       {
//         label: "Mission and Vision",
//         path: "/userInsights/missionVision",
//         module: "userInsight",
//       },
//       {
//         label: "How it Works",
//         path: "/userInsights/howItWorks",
//         module: "userInsight",
//       },
//       {
//         label: "Why Choose Us",
//         path: "/userInsights/whyChooseUs",
//         module: "userInsight",
//       },
//       {
//         label: "Safety Standards",
//         path: "/userInsights/safetyStandards",
//         module: "userInsight",
//       },
//       { label: "FAQs", path: "/userInsights/faq", module: "userInsight" },
//       {
//         label: "Features",
//         path: "/userInsights/features",
//         module: "userInsight",
//       },
//       { label: "About US", path: "/aboutUs", module: "userInsight" },
//       { label: "Contact US", path: "/contactUs", module: "userInsight" },
//       { label: "Footer", path: "/userInsights/footer", module: "userInsight" },
//     ],
//   },
//   {
//     label: "Admin Management",
//     path: "/admin-management",
//     icon: <FaLock />,
//     module: "role",
//     adminOnly: true,
//   },
// ];

// // --------------------- SIDEBAR COMPONENT -------------------------
// export default function Sidebar() {
//   const { currentUser } = useAuth();
//   const userRole = currentUser?.user?.role;

//   const [expandedMenus, setExpandedMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rolePermissions, setRolePermissions] = useState({});

//   useEffect(() => {
//     const fetchRolePermissions = async () => {
//       if (!userRole) {
//         setLoading(false);
//         return;
//       }

//       // If superadmin, we don't necessarily need to fetch permissions for sidebar filtering
//       // as superadmin bypasses all checks in SidebarItem.
//       if (userRole === "superadmin") {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch current admin's details which includes their allowedTabs or fine-grained permissions
//         const res = await apiClient.get(`/admin/${currentUser?.user?.id}`);
//         const adminData = res?.data?.data || {};

//         if (adminData.allowedTabs) {
//           // Map allowedTabs to a structure compatible with canAccessModule logic
//           const permMap = {};
//           adminData.allowedTabs.forEach((tab) => {
//             permMap[tab.toLowerCase().replace(/\s+/g, "")] = [
//               "read",
//               "create",
//               "update",
//               "delete",
//             ];
//           });
//           setRolePermissions(permMap);
//         }
//       } catch (err) {
//         console.error("Failed to fetch permissions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRolePermissions();
//   }, [userRole, currentUser]);

//   const toggleSubmenu = (label) => {
//     setExpandedMenus((prev) =>
//       prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
//     );
//   };

//   if (!userRole || loading) {
//     return <div>Loading sidebar...</div>;
//   }

//   return (
//     <aside className="fixed left-0 w-72 h-screen bg-linear-to-b from-blue-950 to-blue-900 border-r border-blue-800/50 shadow-2xl flex flex-col text-white">
//       {/* Sidebar Header */}
//       <div className="flex flex-col p-6 border-b border-blue-800/50">
//         <h1 className="text-xl font-black flex items-center gap-3">
//           <div className="p-1.5 bg-white rounded-lg shadow-inner">
//             <img
//               src="/vatadya_logo.png"
//               alt="Vatadya Logo"
//               className="h-7 w-7 object-contain"
//             />
//           </div>
//           <span className="tracking-tight text-white">
//             Admin <span className="text-blue-400">Panel</span>
//           </span>
//         </h1>
//         <p className="text-[10px] text-blue-300/60 uppercase tracking-[0.3em] mt-2 font-bold">
//           {userRole?.toLowerCase() === "superadmin"
//             ? "Super Admin Mode"
//             : "Management Suite"}
//         </p>
//       </div>

//       {/* Scrollable Menu */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar scrollbar-thin scrollbar-thumb-blue-600/20">
//         {menuItems.map((item, idx) => (
//           <SidebarItem
//             key={idx}
//             item={item}
//             expandedMenus={expandedMenus}
//             toggleSubmenu={toggleSubmenu}
//             rolePermissions={rolePermissions}
//           />
//         ))}
//       </nav>
//     </aside>
//   );
// }

// // ------------------ Sidebar Item (Recursive) -------------------
// const SidebarItem = ({
//   item,
//   expandedMenus,
//   toggleSubmenu,
//   rolePermissions,
//   level = 0,
// }) => {
//   const { currentUser } = useAuth();
//   const userRole = currentUser?.user?.role;

//   // 1️⃣ SUPER ADMIN: bypass all checks
//   if (userRole === "superadmin") {
//     // Show everything
//   } else if (item.adminOnly && userRole !== "admin") {
//     // Hidden if adminOnly but user is not admin
//     return null;
//   }

//   const isExpanded = expandedMenus.includes(item.label);

//   if (item.children) {
//     const hasAccessibleChild =
//       userRole === "superadmin" ||
//       item.children.some((child) => {
//         // For children, we check if the parent module is accessible
//         return canAccessModule(
//           rolePermissions,
//           child.module?.toLowerCase().replace(/\s+/g, ""),
//         );
//       });

//     if (!hasAccessibleChild) return null;

//     return (
//       <div className="space-y-1">
//         {/* Parent Menu Button */}
//         <button
//           onClick={() => toggleSubmenu(item.label)}
//           className={`w-full flex items-center justify-between py-3.5 px-5 rounded-2xl font-semibold transition-all duration-300 group
//             ${
//               isExpanded
//                 ? "bg-blue-600/20 text-blue-100 shadow-inner"
//                 : "text-blue-300/80 hover:bg-white/5 hover:text-white"
//             }`}
//         >
//           <div className="flex items-center gap-4">
//             <span
//               className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isExpanded ? "text-blue-400" : ""}`}
//             >
//               {item.icon}
//             </span>
//             <span className="tracking-wide text-left">{item.label}</span>
//           </div>
//           <span>
//             {isExpanded ? (
//               <FaChevronDown className="text-xs rotate-180 text-blue-400 transition-transform duration-500" />
//             ) : (
//               <FaChevronDown className="text-xs opacity-40 transition-transform duration-500" />
//             )}
//           </span>
//         </button>

//         <div
//           className={`overflow-hidden transition-all duration-300 ease-in-out ${
//             isExpanded ? "max-h-fit mt-1" : "max-h-0"
//           } ml-9 border-l border-blue-800/50 pl-4 py-1 flex flex-col space-y-1`}
//         >
//           {item.children.map((child, idx) => (
//             <SidebarItem
//               key={idx}
//               item={child}
//               expandedMenus={expandedMenus}
//               toggleSubmenu={toggleSubmenu}
//               rolePermissions={rolePermissions}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Leaf menu item: check permissions
//   if (userRole !== "superadmin") {
//     // 🔓 ALWAYS visible modules if needed (add to array)
//     const alwaysVisible = ["dashboard"];
//     const isAlwaysVisible = alwaysVisible.includes(item.module);

//     if (!isAlwaysVisible) {
//       if (
//         !canAccessModule(
//           rolePermissions,
//           item.module?.toLowerCase().replace(/\s+/g, ""),
//         )
//       )
//         return null;
//       if (
//         item.action &&
//         !canPerformAction(
//           rolePermissions,
//           item.module?.toLowerCase().replace(/\s+/g, ""),
//           item.action,
//         )
//       )
//         return null;
//     }
//   }

//   return (
//     <NavLink
//       to={item.path}
//       end
//       className={({ isActive }) =>
//         `flex items-center justify-start gap-4 py-3.5 px-5 rounded-2xl font-semibold transition-all duration-300 group
//       ${
//         isActive
//           ? "bg-blue-600 text-white shadow-xl shadow-blue-950/50"
//           : level > 0
//             ? "text-blue-300/60 hover:text-white hover:bg-white/5 text-sm"
//             : "text-blue-300/80 hover:bg-white/5 hover:text-white"
//       }`
//       }
//     >
//       <span
//         className={`text-xl transition-transform duration-300 group-hover:scale-110`}
//       >
//         {item.icon}
//       </span>
//       <span className="text-left tracking-wide">{item.label}</span>
//     </NavLink>
//   );
// };

// ========================= Sidebar.jsx ===============================
// Dynamic sidebar using Redux + API-driven permissions
// APIs used:
//   GET /api/admin/permissions/all
//   GET /api/admin/modules/all
//   GET /api/admin/roles/all

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMountain,
  FaClipboardList,
  FaUsers,
  FaImages,
  FaChevronDown,
  FaLock,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../contexts/AuthContest";
import {
  setPermissions,
  clearPermissions,
} from "../../features/permissionsSlice";
import { canAccessModule, canPerformAction } from "../../utils/PermissionUtils";
import apiClient from "../../api/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC MENU CONFIG
// Each item maps to a module name from the backend.
// `module` must match the module names returned by GET /api/admin/modules/all
// ─────────────────────────────────────────────────────────────────────────────
const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard />,
    module: "dashboard",
    alwaysVisible: true,
  },
  {
    label: "User Management",
    path: "/users",
    icon: <FaUsers />,
    module: "user",
  },
  {
    label: "Role Based Permissions",
    path: "/role-permissions",
    icon: <FaLock />,
    module: "role",
    alwaysVisible: true,
  },
  {
    label: "Booking Treks",
    path: "/bookingTreks",
    icon: <FaMountain />,
    module: "trek",
    action: "read",
  },
  {
    label: "Trek Categories",
    icon: <FaClipboardList />,
    module: "trekCategory",
    children: [
      {
        label: "Create Trek Category",
        path: "/categories/create",
        module: "trekCategory",
        action: "create",
      },
      {
        label: "Manage Trek Categories",
        path: "/categories/manage",
        module: "trekCategory",
        action: "read",
      },
    ],
  },
  {
    label: "Treks",
    icon: <FaMountain />,
    module: "trek",
    children: [
      {
        label: "Create Trek",
        path: "/treks/create",
        module: "trek",
        action: "create",
      },
      {
        label: "Manage Treks",
        path: "/treks/manage",
        module: "trek",
        action: "read",
      },
    ],
  },
  {
    label: "Stay",
    icon: <FaHome />,
    module: "stay",
    children: [
      {
        label: "Create Stay",
        path: "/stay/create",
        module: "stay",
        action: "create",
      },
      {
        label: "Manage Stay",
        path: "/stay/manage",
        module: "stay",
        action: "read",
      },
    ],
  },
  {
    label: "Bookings",
    icon: <FaClipboardList />,
    module: "booking",
    children: [
      {
        label: "Manage Bookings",
        path: "/bookings/manage",
        module: "booking",
        action: "read",
      },
    ],
  },
  {
    label: "Gallery",
    icon: <FaImages />,
    module: "gallery",
    children: [
      {
        label: "Create Gallery Item",
        path: "/gallery/create",
        module: "gallery",
        action: "create",
      },
      {
        label: "Manage Gallery Items",
        path: "/gallery/manage",
        module: "gallery",
        action: "read",
      },
    ],
  },
  {
    label: "Contacts",
    path: "/contacts",
    icon: <FaUsers />,
    module: "contact",
    action: "read",
  },
  {
    label: "User Insights",
    icon: <FaInfoCircle />,
    module: "userInsight",
    children: [
      { label: "Hero", path: "/userInsights/hero", module: "userInsight" },
      {
        label: "Mission & Vision",
        path: "/userInsights/missionVision",
        module: "userInsight",
      },
      {
        label: "How it Works",
        path: "/userInsights/howItWorks",
        module: "userInsight",
      },
      {
        label: "Why Choose Us",
        path: "/userInsights/whyChooseUs",
        module: "userInsight",
      },
      {
        label: "Safety Standards",
        path: "/userInsights/safetyStandards",
        module: "userInsight",
      },
      { label: "FAQs", path: "/userInsights/faq", module: "userInsight" },
      {
        label: "Features",
        path: "/userInsights/features",
        module: "userInsight",
      },
      { label: "About Us", path: "/aboutUs", module: "userInsight" },
      { label: "Contact Us", path: "/contactUs", module: "userInsight" },
      { label: "Footer", path: "/userInsights/footer", module: "userInsight" },
    ],
  },
  {
    label: "Admin Management",
    path: "/admin-management",
    icon: <FaLock />,
    module: "role",
    superAdminOnly: true, // Only visible to superadmin
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Build permMap from API response
// Transforms: [{ module: "trek", actions: ["read","create"] }]
// Into:       { trek: ["read","create"] }
// ─────────────────────────────────────────────────────────────────────────────
const buildPermMap = (permissions = []) => {
  const permMap = {};
  permissions.forEach(({ module, actions }) => {
    if (module) {
      permMap[module.toLowerCase().replace(/\s+/g, "")] = actions || [];
    }
  });
  return permMap;
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SIDEBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { currentUser } = useAuth();
  console.log(" Full currentUser object:", currentUser);
  if (!currentUser) {
    return (
      <aside
        className=" w-72 h-screen bg-gradient-to-b from-blue-950 to-blue-900 
        border-r border-blue-800/50 shadow-2xl flex flex-col text-white"
      >
        <SidebarHeader userRole={null} isSuperAdmin={false} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-blue-300/60">
          <FaSpinner className="text-2xl animate-spin text-blue-400" />
          <span className="text-xs uppercase tracking-widest font-medium">
            Loading…
          </span>
        </div>
      </aside>
    );
  }
  const userRole = currentUser?.user?.role;
  const userId = currentUser?.user?.id;

  const dispatch = useDispatch();
  const { rolePermissions } = useSelector((state) => state.permissions);

  const [expandedMenus, setExpandedMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSuperAdmin = userRole?.toLowerCase() === "superadmin";

  // ── Fetch permissions from backend ────────────────────────────────────────
  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     dispatch(clearPermissions());

  //     if (!userRole) {
  //       setLoading(false);
  //       return;
  //     }

  //     // Superadmin sees everything — no API call needed, just stop loading
  //     if (isSuperAdmin) {
  //       // Set a wildcard permMap so all canAccessModule checks pass
  //       dispatch(
  //         setPermissions({ "*": ["read", "create", "update", "delete"] }),
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // Step 1: Fetch all roles to find the matching role record
  //       const rolesRes = await apiClient.get("admin/roles/all");
  //       console.log("Roles API response:", rolesRes);
  //       const roles = rolesRes?.data?.data || rolesRes?.data || [];
  //       // ✅ checks both `name` and `role` fields
  //       const matchedRole = roles.find(
  //         (r) =>
  //           r.name?.toLowerCase() === userRole?.toLowerCase() ||
  //           r.role?.toLowerCase() === userRole?.toLowerCase(),
  //       );

  //       if (!matchedRole) {
  //         dispatch(setPermissions({}));
  //         return;
  //       }

  //       // Step 2: Fetch all permissions and filter by this role
  //       const permissionsRes = await apiClient.get("/admin/permissions/all");
  //       const allPermissions =
  //         permissionsRes?.data?.data || permissionsRes?.data || [];

  //       const rolePerms = allPermissions.filter(
  //         (p) =>
  //           p.roleId === matchedRole._id ||
  //           p.role === matchedRole._id ||
  //           p.roleName?.toLowerCase() === userRole?.toLowerCase(),
  //       );

  //       const permMap = buildPermMap(rolePerms);
  //       dispatch(setPermissions(permMap));
  //     } catch (err) {
  //       console.error("Failed to fetch permissions:", err);
  //       setError("Failed to load permissions.");
  //       dispatch(setPermissions({}));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPermissions();
  // }, [userRole, userId, dispatch, isSuperAdmin]);

  // useEffect(() => {c
  //   const fetchPermissions = async () => {
  //     dispatch(clearPermissions());

  //     if (!userRole) {
  //       console.log("❌ No userRole, stopping");
  //       setLoading(false);
  //       return;
  //     }

  //     if (isSuperAdmin) {
  //       console.log("✅ Superadmin — setting wildcard");
  //       dispatch(
  //         setPermissions({ "*": ["read", "create", "update", "delete"] }),
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       setError(null);

  //       console.log("🔍 userRole:", userRole);
  //       console.log("🔍 isSuperAdmin:", isSuperAdmin);

  //       const rolesRes = await apiClient.get("/admin/roles/all");
  //       console.log("📦 Roles API raw response:", rolesRes);
  //       console.log("📦 Roles data:", rolesRes?.data);

  //       const roles = rolesRes?.data?.data || rolesRes?.data || [];
  //       console.log("📋 Parsed roles array:", roles);

  //       const matchedRole = roles.find(
  //         (r) =>
  //           r.name?.toLowerCase() === userRole?.toLowerCase() ||
  //           r.role?.toLowerCase() === userRole?.toLowerCase(),
  //       );
  //       console.log("🎯 Matched role:", matchedRole);

  //       if (!matchedRole) {
  //         console.log("❌ No matching role found for:", userRole);
  //         dispatch(setPermissions({}));
  //         return;
  //       }

  //       // const permissionsRes = await apiClient.get("/admin/permissions/all");
  //       // console.log("📦 Permissions raw response:", permissionsRes);
  //       // const allPermissions =
  //       //   permissionsRes?.data?.data || permissionsRes?.data || [];
  //       // console.log("📋 All permissions:", allPermissions);

  //       // const rolePerms = allPermissions.filter(
  //       //   (p) =>
  //       //     p.roleId === matchedRole._id ||
  //       //     p.role === matchedRole._id ||
  //       //     p.roleName?.toLowerCase() === userRole?.toLowerCase(),
  //       // );
  //       // console.log("🎯 Filtered role permissions:", rolePerms);

  //       // const permMap = buildPermMap(rolePerms);
  //       // console.log("✅ Final permMap:", permMap);

  //       // dispatch(setPermissions(permMap));
  //     } catch (err) {
  //       console.error("💥 Error:", err);
  //       setError("Failed to load permissions.");
  //       dispatch(setPermissions({}));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPermissions();
  // }, [userRole, userId, dispatch, isSuperAdmin]);

  useEffect(() => {
    const fetchPermissions = async () => {
      dispatch(clearPermissions());

      if (!userRole) {
        setLoading(false);
        return;
      }

      if (isSuperAdmin) {
        dispatch(
          setPermissions({ "*": ["read", "create", "update", "delete"] }),
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Roles API already contains permissions — no need for a second call
        const rolesRes = await apiClient.get("/admin/roles/all");
        const roles = rolesRes?.data?.data || [];

        const matchedRole = roles.find(
          (r) =>
            r.name?.toLowerCase() === userRole?.toLowerCase() ||
            r.role?.toLowerCase() === userRole?.toLowerCase(),
        );

        if (!matchedRole) {
          dispatch(setPermissions({}));
          return;
        }

        // ── Build permMap directly from role.permissions ──────────────
        // API returns: { permissions: [{ module: "*", actions: [...] }] }
        const permMap = {};
        (matchedRole.permissions || []).forEach(({ module, actions }) => {
          if (module) {
            permMap[module.toLowerCase().replace(/\s+/g, "")] = actions || [];
          }
        });

        console.log(" Final permMap:", permMap);
        dispatch(setPermissions(permMap));
        console.log("userRole:", userRole);
        console.log("roles:", roles);
        console.log("matchedRole:", matchedRole);
      } catch (err) {
        console.error(" Error:", err);
        setError("Failed to load permissions.");
        dispatch(setPermissions({}));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userRole, dispatch, isSuperAdmin]);

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <aside className="w-72 h-screen bg-linear-to-b from-blue-950 to-blue-900 border-r border-blue-800/50 shadow-2xl flex flex-col text-white">
        <SidebarHeader userRole={userRole} isSuperAdmin={isSuperAdmin} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-blue-300/60">
          <FaSpinner className="text-2xl animate-spin text-blue-400" />
          <span className="text-xs uppercase tracking-widest font-medium">
            Loading menu…
          </span>
        </div>
      </aside>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <aside className="w-72 h-screen bg-linear-to-b from-blue-950 to-blue-900 border-r border-blue-800/50 shadow-2xl flex flex-col text-white">
        <SidebarHeader userRole={userRole} isSuperAdmin={isSuperAdmin} />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="text-red-400 text-sm">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-blue-400 underline hover:text-blue-300"
          >
            Retry
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-blue-950 to-blue-900 border-r border-blue-800/50 shadow-2xl flex flex-col text-white">
      <SidebarHeader userRole={userRole} isSuperAdmin={isSuperAdmin} />

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
        {menuItems.map((item, idx) => (
          <SidebarItem
            key={idx}
            item={item}
            expandedMenus={expandedMenus}
            toggleSubmenu={toggleSubmenu}
            rolePermissions={rolePermissions}
            isSuperAdmin={isSuperAdmin}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-blue-800/40 text-[10px] text-blue-300/40 uppercase tracking-widest font-bold">
        {userRole} · {isSuperAdmin ? "Full Access" : "Role-Based Access"}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR HEADER (extracted for reuse in loading/error states)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarHeader({ userRole, isSuperAdmin }) {
  return (
    <div className="flex flex-col px-5 py-5 border-b border-blue-800/50 bg-blue-950/60 backdrop-blur-sm">
      <h1 className="text-xl font-black flex items-center gap-3">
        <div className="p-1.5 bg-white rounded-lg shadow-inner shrink-0">
          <img
            src="/vatadya_logo.png"
            alt="Vatadya Logo"
            className="h-7 w-7 object-contain"
          />
        </div>
        <span className="tracking-tight text-white">
          Admin <span className="text-blue-400">Panel</span>
        </span>
      </h1>
      <p className="text-[10px] text-blue-300/60 uppercase tracking-[0.3em] mt-2 font-bold">
        {isSuperAdmin ? "Super Admin Mode" : "Management Suite"}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR ITEM — Recursive (handles groups + leaf links)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarItem({
  item,
  expandedMenus,
  toggleSubmenu,
  rolePermissions,
  isSuperAdmin,
  level = 0,
}) {
  // ── Visibility Rules ───────────────────────────────────────────────────────

  // Items marked `superAdminOnly` are only shown to superadmin
  if (item.superAdminOnly && !isSuperAdmin) return null;

  // Superadmin uses wildcard permMap { "*": [...] } so canAccessModule
  // passes for every module. alwaysVisible also bypasses for safety.
  const skipPermCheck = item.alwaysVisible;

  const normalizedModule = item.module?.toLowerCase().replace(/\s+/g, "");
  const isExpanded = expandedMenus.includes(item.label);

  // ── GROUP (has children) ───────────────────────────────────────────────────
  if (item.children) {
    const hasAccessibleChild =
      skipPermCheck ||
      item.children.some((child) => {
        const childModule = child.module?.toLowerCase().replace(/\s+/g, "");
        if (!canAccessModule(rolePermissions, childModule)) return false;
        if (
          child.action &&
          !canPerformAction(rolePermissions, childModule, child.action)
        )
          return false;
        return true;
      });

    if (!hasAccessibleChild) return null;

    return (
      <div>
        <button
          onClick={() => toggleSubmenu(item.label)}
          className={`
            w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold
            transition-all duration-200 group
            ${
              isExpanded
                ? "bg-blue-600/20 text-blue-100"
                : "text-blue-300/80 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-base transition-colors duration-200 ${isExpanded ? "text-blue-400" : "text-blue-400/60 group-hover:text-blue-400"}`}
            >
              {item.icon}
            </span>
            <span className="text-sm tracking-wide text-left">
              {item.label}
            </span>
          </div>
          <FaChevronDown
            className={`text-xs text-blue-400/60 transition-transform duration-300 ${isExpanded ? "rotate-180 text-blue-400" : ""}`}
          />
        </button>

        {/* Submenu — animated expand/collapse */}
        <div
          style={{ maxHeight: isExpanded ? "800px" : "0px" }}
          className="overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="ml-4 mt-1 mb-1 border-l border-blue-700/40 pl-3 flex flex-col gap-0.5">
            {item.children.map((child, idx) => (
              <SidebarItem
                key={idx}
                item={child}
                expandedMenus={expandedMenus}
                toggleSubmenu={toggleSubmenu}
                rolePermissions={rolePermissions}
                isSuperAdmin={isSuperAdmin}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LEAF (NavLink) ─────────────────────────────────────────────────────────
  if (!skipPermCheck) {
    if (!canAccessModule(rolePermissions, normalizedModule)) return null;
    if (
      item.action &&
      !canPerformAction(rolePermissions, normalizedModule, item.action)
    )
      return null;
  }

  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) => `
        flex items-center gap-3 py-2.5 px-4 rounded-xl font-medium
        transition-all duration-200 group
        ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : level > 0
              ? "text-blue-300/55 hover:text-white hover:bg-white/5 text-sm"
              : "text-blue-300/80 hover:bg-white/5 hover:text-white text-sm"
        }
      `}
    >
      {item.icon && (
        <span
          className={`text-base shrink-0 transition-colors duration-200 ${level > 0 ? "text-blue-400/40 group-hover:text-blue-400" : "text-blue-400/60 group-hover:text-blue-400"}`}
        >
          {item.icon}
        </span>
      )}
      <span className="tracking-wide leading-tight">{item.label}</span>
    </NavLink>
  );
}
