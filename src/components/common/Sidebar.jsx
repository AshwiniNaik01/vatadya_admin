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
  // { name: "Payments", path: "/payments/manage", icon: <FaWallet /> },
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
      className={`min-h-screen bg-linear-to-b from-blue-950 to-blue-900 text-white shadow-2xl transition-all duration-300 border-r border-blue-800/50
        ${collapsed ? "w-22" : "w-72"}`}
    >
      {/* HEADER / LOGO + HAMBURGER */}
      <div className="flex items-center justify-between p-6 border-b border-blue-800/50">
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-xl font-black flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-inner">
                <img
                  src="/vatadya_logo.jpeg"
                  alt="Vatadya Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <span className="tracking-tight">
                Admin <span className="text-blue-400">Panel</span>
              </span>
            </h1>
            <p className="text-[10px] text-blue-300/60 uppercase tracking-[0.3em] mt-2 font-bold">
              Management Suite
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 text-blue-200 hover:text-white"
        >
          <FaBars size={18} />
        </button>
      </div>

      {/* NAV */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) =>
          item.submenu ? (
            <div key={item.name} className="space-y-1">
              {/* Parent Button */}
              <button
                onClick={() =>
                  setOpenSubmenu(openSubmenu === item.name ? "" : item.name)
                }
                className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all duration-300 group
                ${openSubmenu === item.name
                    ? "bg-blue-600/20 text-blue-100 shadow-inner"
                    : "text-blue-300/80 hover:bg-white/5 hover:text-white"
                  }
                ${collapsed ? "justify-center px-0" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xl transition-transform duration-300 group-hover:scale-110 ${openSubmenu === item.name ? "text-blue-400" : ""
                      }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="font-semibold tracking-wide">
                      {item.name}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <FaChevronDown
                    className={`text-xs transition-transform duration-500 ${openSubmenu === item.name ? "rotate-180 text-blue-400" : "opacity-40"
                      }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {!collapsed && openSubmenu === item.name && (
                <div className="ml-9 mt-1 flex flex-col space-y-1 border-l border-blue-800/50 pl-4 py-1">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                        ${isActive
                          ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40"
                          : "text-blue-300/60 hover:text-white hover:bg-white/5"
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
                `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-950/50 font-bold"
                  : "text-blue-300/80 hover:bg-white/5 hover:text-white"
                }
                ${collapsed ? "justify-center px-0" : ""}`
              }
            >
              <span
                className={`text-xl transition-transform duration-300 group-hover:scale-110 ${collapsed ? "" : ""
                  }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="font-semibold tracking-wide">{item.name}</span>
              )}
            </NavLink>
          )
        )}
      </nav>


    </aside>
  );
}
