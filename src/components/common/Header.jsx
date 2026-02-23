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
          {/* <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <FaBars className="cursor-pointer" onClick={onToggleSidebar} />
          </div> */}
          <h2 className="font-black text-xl text-slate-800 tracking-tight">
            TreekVede <span className="text-emerald-600">Console</span>
          </h2>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        {/* <button className="p-3 rounded-xl hover:bg-slate-50 transition-all text-slate-400 relative border border-transparent hover:border-slate-100">
          <FaBell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button> */}

        <div className="h-8 w-px bg-slate-100"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-50 shadow-sm group-hover:border-emerald-200 transition-all">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=059669&color=fff"
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-slate-900 font-black text-xs leading-none">
              Admin
            </p>
            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-1">
              Super Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
