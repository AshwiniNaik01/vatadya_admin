import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMountain,
  FaClipboardList,
  FaUsers,
  FaImages,
  FaVideo,
  FaCog,
  FaBars,
  FaChevronDown,
  FaStar,
  FaWallet,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  {
    name: "Treks",
    icon: <FaMountain />,
    submenu: [
      { name: "Create Trek", path: "/treks/create" },
      { name: "Manage Treks", path: "/treks/manage" },
    ],
  },
  {
    name: "Trekk Categories",
    icon: <FaClipboardList />,
    submenu: [
      { name: "Create Trekk Category", path: "/categories/create" },
      { name: "Manage Trekk Categories", path: "/categories/manage" },
    ],
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: <FaClipboardList />,
    submenu: [
      // { name: "Create Bookings", path: "/bookings/create" },
      { name: "Manage Bookings", path: "/bookings/manage" },
    ],
  },
  {
    name: "Gallery",
    path: "/gallery",
    icon: <FaImages />,
    submenu: [
      { name: "Create Gallery Item", path: "/gallery/create" },
      { name: "Manage Gallery Items", path: "/gallery/manage" },
    ],
  },
  { name: "Reviews", path: "/reviews/manage", icon: <FaStar /> },
  { name: "Payments", path: "/payments/manage", icon: <FaWallet /> },
  {
    name: "Slots",
    path: "/slots",
    icon: <FaImages />,
    submenu: [
      { name: "Create Slot", path: "/slots/create" },
      { name: "Manage Slots", path: "/slots/manage" },
    ],
  },
  { name: "Contacts", path: "/contacts", icon: <FaUsers /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState("");

  return (
    <aside
      className={`min-h-screen bg-linear-to-b from-emerald-900 to-emerald-800 text-white shadow-xl transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* HEADER / LOGO + HAMBURGER */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-700">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              🏔️ Trek Admin
            </h1>
            <p className="text-[10px] text-emerald-300 uppercase tracking-widest">
              Management Panel
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) =>
          item.submenu ? (
            <div key={item.name}>
              {/* Parent Button */}
              <button
                onClick={() =>
                  setOpenSubmenu(openSubmenu === item.name ? "" : item.name)
                }
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200
                ${openSubmenu === item.name ? "bg-emerald-600 font-semibold" : "text-emerald-200 hover:bg-white/10 hover:text-white"}
                ${collapsed ? "justify-center" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </div>
                {!collapsed && (
                  <FaChevronDown
                    className={`transition-transform duration-300 ${openSubmenu === item.name ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {!collapsed && openSubmenu === item.name && (
                <div className="ml-8 mt-1 flex flex-col space-y-1">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? "bg-emerald-500 text-white font-semibold"
                          : "text-emerald-200 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-semibold"
                  : "text-emerald-200 hover:bg-white/10 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}
