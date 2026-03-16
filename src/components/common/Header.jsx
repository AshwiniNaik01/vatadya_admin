import { FaBars, FaBell } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Header({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin ID from cookies
    Cookies.remove("adminId");
    // Clear admin data from localStorage
    localStorage.removeItem("adminData");
    // Redirect to login page
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* LEFT: Branding */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-xl text-slate-800 tracking-tight">
            VataDya <span className="text-blue-600">Console</span>
          </h2>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-6">
        <div className="h-8 w-px bg-slate-200/50"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 group cursor-pointer bg-slate-50/50 p-1.5 pr-4 rounded-2xl hover:bg-slate-100/50 transition-all border border-transparent hover:border-slate-200">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm transition-all group-hover:scale-105">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-slate-900 font-black text-xs leading-none">
              Admin
            </p>
            <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mt-1.5">
              Super Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
