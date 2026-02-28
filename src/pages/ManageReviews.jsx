import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMountain,
  FaStar,
  FaFilter,
  FaSearch,
  FaHistory,
  FaCommentDots,
} from "react-icons/fa";
import { getReviews, deleteReview } from "../api/reviewApi";
import { getTreks } from "../api/trekApi";
import ReviewStats from "../components/reviews/ReviewStats";
import ReviewCard from "../components/reviews/ReviewCard";
import FilterControls from "../components/form/FilterControls";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrek, setSelectedTrek] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, treksRes] = await Promise.all([
        getReviews(),
        getTreks(),
      ]);

      // Broaden data extraction to handle various response formats
      let reviewsData = [];
      if (Array.isArray(reviewsRes)) {
        reviewsData = reviewsRes;
      } else if (reviewsRes && Array.isArray(reviewsRes.data)) {
        reviewsData = reviewsRes.data;
      } else if (reviewsRes && Array.isArray(reviewsRes.trekReviews)) {
        reviewsData = reviewsRes.trekReviews;
      } else if (reviewsRes && typeof reviewsRes === "object") {
        // Fallback: search for any array property if it's an object
        const arrayKey = Object.keys(reviewsRes).find((key) =>
          Array.isArray(reviewsRes[key]),
        );
        if (arrayKey) reviewsData = reviewsRes[arrayKey];
      }

      let treksData = [];
      if (Array.isArray(treksRes)) {
        treksData = treksRes;
      } else if (treksRes && Array.isArray(treksRes.data)) {
        treksData = treksRes.data;
      } else if (treksRes && typeof treksRes === "object") {
        const arrayKey = Object.keys(treksRes).find((key) =>
          Array.isArray(treksRes[key]),
        );
        if (arrayKey) treksData = treksRes[arrayKey];
      }

      setReviews(reviewsData);
      setTreks(treksData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load reviews. Please try again.");
      setLoading(false);

      setReviews(generateMockReviews());
      setTreks(generateMockTreks());
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id);
        setReviews((prev) =>
          Array.isArray(prev) ? prev.filter((r) => r._id !== id) : [],
        );
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  const filteredReviews = Array.isArray(reviews)
    ? reviews.filter((review) => {
        // ✅ FIXED: Handle nested trekId object if populated, or ID string, or null/undefined
        const trekIdVal = review.trekId
          ? typeof review.trekId === "object"
            ? review.trekId?._id // Added optional chaining for safety
            : review.trekId
          : null;

        const matchesTrek =
          selectedTrek === "all" || trekIdVal === selectedTrek;

        // Ensure name and description exist before calling toLowerCase
        const reviewName = (review.name || "").toLowerCase();
        const reviewDesc = (review.description || "").toLowerCase();
        const search = searchQuery.toLowerCase();

        return (
          matchesTrek &&
          (reviewName.includes(search) || reviewDesc.includes(search))
        );
      })
    : [];

  // Calculate Stats
  const calculateStats = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = (sum / total).toFixed(1);

    const dist = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
      return {
        stars: star,
        count: count > 1000 ? `${(count / 1000).toFixed(1)}k` : count,
        percentage: (count / total) * 100,
      };
    });

    return {
      totalReviews: total > 1000 ? `${(total / 1000).toFixed(1)}k` : total,
      averageRating: avg,
      growth: "+21% ↑",
      distribution: dist,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 space-y-8 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-[2rem] shadow-sm shadow-emerald-100">
                <FaStar size={20} />
              </div>
              Reviews
            </h1>
            <p className="text-gray-500 font-bold mt-2 ml-1 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-emerald-500 rounded-full"></span>
              Manage Customer Feedback
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm items-center gap-2">
            <FaHistory className="text-gray-400 ml-2" size={14} />
            <span className="text-xs font-black text-gray-600 px-2 py-1">
              March 2024 - January 2026
            </span>
          </div>
        </header>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm">
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterValue={selectedTrek}
            setFilterValue={setSelectedTrek}
            filterOptions={treks}
            placeholder="Search reviews..."
            allLabel="All Treks"
          />

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredReviews.length} Reviews
          </p>
        </div>

        {/* Stats Section */}
        {!loading && stats && <ReviewStats stats={stats} />}

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-[2rem] animate-pulse border border-gray-100"
              />
            ))
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100">
              <div className="bg-emerald-50 text-emerald-500 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <FaCommentDots size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                No Reviews Found
              </h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto">
                No feedback has been submitted for this criteria yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock Data Generators
function generateMockReviews() {
  return [
    {
      _id: "1",
      name: "Towhidur Rahman",
      profilePhoto: "https://i.pravatar.cc/150?u=1",
      rating: 4.8,
      description:
        "My first and only trek ordered on Vatadya, and I'm beyond delighted! I requested a custom trail based on two summits I was called to invite together in this kind of creation.",
      createdAt: "2025-10-24T10:00:00Z",
      trekId: { _id: "t1", title: "Kalsubai Peak Trek" },
      isLiked: true,
    },
    {
      _id: "2",
      name: "Aniruddha Patil",
      profilePhoto: "https://i.pravatar.cc/150?u=2",
      rating: 5,
      description:
        "Absolutely breathtaking experience. The guides were professional and the view from the top was worth every drop of sweat.",
      createdAt: "2025-11-15T12:00:00Z",
      trekId: { _id: "t2", title: "Lohagad Fort Trek" },
      isLiked: false,
    },
    {
      _id: "3",
      name: "Sujata Mehta",
      profilePhoto: "https://i.pravatar.cc/150?u=3",
      rating: 3.5,
      description:
        "The trek was good but the food provided could have been better. Otherwise, the logistics were well managed.",
      createdAt: "2026-01-10T09:00:00Z",
      trekId: { _id: "t1", title: "Kalsubai Peak Trek" },
      isLiked: false,
    },
  ];
}

function generateMockTreks() {
  return [
    { _id: "t1", title: "Kalsubai Peak Trek" },
    { _id: "t2", title: "Lohagad Fort Trek" },
    { _id: "t3", title: "Harishchandragad Trek" },
  ];
}
