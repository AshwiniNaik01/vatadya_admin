import { FaMountain, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaEdit, FaEye, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";

export default function TrekCard({ trek, onEdit, onView, onDelete }) {
    const difficultyColors = {
        Easy: "bg-green-100 text-green-700",
        Moderate: "bg-blue-100 text-blue-700",
        Challenging: "bg-orange-100 text-orange-700",
        Difficult: "bg-red-100 text-red-700",
        Extreme: "bg-purple-100 text-purple-700",
    };

    const fallbackImage = "https://tse1.mm.bing.net/th/id/OIP.dI22OgiQxCFyDNQ2PaNtvQHaE8?pid=Api&P=0&h=180";

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={trek.image?.cdnUrl || fallbackImage}
                    alt={trek.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                    }}
                />

                {/* Overlays/Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {trek.isActive ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
                            <FaCheckCircle size={10} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/90 text-white backdrop-blur-sm shadow-sm">
                            <FaTimesCircle size={10} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Inactive</span>
                        </div>
                    )}
                </div>

                {trek.featured && (
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-amber-400/90 text-white backdrop-blur-sm shadow-sm animate-pulse">
                        <FaStar size={12} />
                    </div>
                )}

                <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-sm ${difficultyColors[trek.difficulty] || "bg-gray-100 text-gray-600"}`}>
                        {trek.difficulty}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {trek.title}
                    </h3>
                    <div className="text-[11px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                        <FaMapMarkerAlt size={10} className="text-emerald-500" /> {trek.location}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <FaCalendarAlt size={12} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Duration</p>
                            <p className="text-xs font-black text-gray-700">{trek.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FaUsers size={12} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Size</p>
                            <p className="text-xs font-black text-gray-700">{trek.groupSize}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Starting at</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-gray-900">₹{trek.price.toLocaleString()}</span>
                            {trek.discount > 0 && (
                                <span className="text-[10px] text-emerald-500 font-black">-{trek.discount}%</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onView(trek)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
                            title="View Details"
                        >
                            <FaEye size={14} />
                        </button>
                        <button
                            onClick={() => onEdit(trek)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-95"
                            title="Edit Trek"
                        >
                            <FaEdit size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(trek)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                            title="Delete Trek"
                        >
                            <FaTrashAlt size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
