import { FaStar, FaArrowUp } from "react-icons/fa";

export default function ReviewStats({ stats }) {
    const { totalReviews, averageRating, growth, distribution } = stats || {
        totalReviews: "0",
        averageRating: "0.0",
        growth: "0%",
        distribution: [
            { stars: 5, count: 0, percentage: 0 },
            { stars: 4, count: 0, percentage: 0 },
            { stars: 3, count: 0, percentage: 0 },
            { stars: 2, count: 0, percentage: 0 },
            { stars: 1, count: 0, percentage: 0 },
        ]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-sm border border-gray-100 shadow-sm mb-2">
            {/* Total Reviews */}
            <div className="space-y-4">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Reviews</p>
                <div className="flex items-end gap-3">
                    <h2 className="text-5xl font-black text-gray-900 leading-none">{totalReviews}</h2>
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 mb-1">
                        <FaArrowUp size={10} /> {growth}
                    </div>
                </div>
                <p className="text-gray-400 text-sm font-medium">Growth in reviews on this year</p>
            </div>

            {/* Average Rating */}
            <div className="space-y-4 border-x border-gray-100 px-6">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Average Rating</p>
                <div className="flex items-center gap-4">
                    <h2 className="text-5xl font-black text-gray-900 leading-none">{averageRating}</h2>
                    <div className="flex text-amber-400 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={20} className={i < Math.floor(averageRating) ? "fill-current" : "text-gray-200"} />
                        ))}
                    </div>
                </div>
                <p className="text-gray-400 text-sm font-medium">Average rating on this year</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
                {distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4 group">
                        <div className="flex items-center gap-1 w-8">
                            <span className="text-xs font-black text-gray-500">{item.stars}</span>
                            <FaStar size={10} className="text-gray-300 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 w-10 text-right">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
