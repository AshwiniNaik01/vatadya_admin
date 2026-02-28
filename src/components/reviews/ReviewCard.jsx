import { FaStar, FaHeart, FaCommentDots, FaReply, FaTrashAlt } from "react-icons/fa";

export default function ReviewCard({ review, onDelete }) {
    const {
        name = "Anonymous User",
        profilePhoto = "",
        rating = 0,
        description = "",
        createdAt,
        trekId,
        isLiked = false
    } = review || {};

    const date = createdAt ? new Date(createdAt).toLocaleDateString() : "N/A";
    const trekName = trekId?.title || "Unknown Trek";
    const userAvatar = profilePhoto || `https://ui-avatars.com/api/?name=${name}`;

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* User Profile Info */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 flex-shrink-0">
                        <img
                            src={userAvatar}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}`; }}
                        />
                    </div>
                    <div className="md:space-y-1">
                        <h4 className="text-lg font-black text-gray-900 leading-tight">{name}</h4>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{trekName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Review Date: {date}</p>
                    </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex text-amber-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} size={14} className={i < rating ? "fill-current" : "text-gray-100"} />
                            ))}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onDelete(review._id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete Review"
                            >
                                <FaTrashAlt size={14} />
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 font-medium leading-relaxed">
                        {description || "No comment provided."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                        <button className="px-5 py-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-xl text-xs font-black transition-all flex items-center gap-2">
                            <FaReply size={12} /> Public Comment
                        </button>
                        <button className="px-5 py-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-xl text-xs font-black transition-all flex items-center gap-2">
                            <FaCommentDots size={12} /> Direct Message
                        </button>
                        <button className={`p-2.5 rounded-xl transition-all ${isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300 hover:text-red-400'}`}>
                            <FaHeart size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
