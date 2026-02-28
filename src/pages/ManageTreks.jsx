import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { deleteTrek, getTreks } from "../api/trekApi";
import Modal from "../components/modal/Modal";
import { FaMountain, FaPlus, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaEye, FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import TrekCard from "../components/cards/TrekCard";
import FilterControls from "../components/form/FilterControls";
import { FiImage, FiPlusCircle } from "react-icons/fi";

export default function ManageTreks() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrek, setSelectedTrek] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");

    useEffect(() => {
        fetchTreks();
    }, []);

    const fetchTreks = async () => {
        try {
            setLoading(true);
            const res = await getTreks();
            setData(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching treks:", err);
            setError("Failed to load treks. Please try again.");
            setLoading(false);
        }
    };

    const handleEdit = (trek) => {
        navigate(`/treks/edit/${trek._id}`);
    };

    const handleView = (trek) => {
        setSelectedTrek(trek);
        setIsViewModalOpen(true);
    };

    const handleDelete = async (trek) => {
        if (window.confirm(`Are you sure you want to permanently delete "${trek.title}"?`)) {
            try {
                setLoading(true);
                await deleteTrek(trek._id);
                // alert("Trek deleted successfully");
                fetchTreks(); // Refresh data
            } catch (err) {
                console.error("Delete error:", err);
                alert(`Error deleting trek: ${err.message || err}`);
                setLoading(false);
            }
        }
    };

    const filteredData = data.filter(trek => {
        const matchesSearch = trek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trek.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "all" || trek.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const difficultyOptions = [
        { id: "Easy", name: "Easy" },
        { id: "Moderate", name: "Moderate" },
        { id: "Challenging", name: "Challenging" },
        { id: "Difficult", name: "Difficult" },
        { id: "Extreme", name: "Extreme" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-[2rem] shadow-sm shadow-emerald-100">
                                <FaMountain size={28} />
                            </div>
                            Manage Treks
                        </h1>
                        <p className="text-gray-500 font-bold mt-2 ml-1 text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-emerald-500 rounded-full"></span>
                            {data.length} Total Expeditions
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <Link
                            to="/treks/create"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-[1.25rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <FaPlus /> Create New Trek
                        </Link>
                    </div>
                </header>

                <FilterControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterValue={difficultyFilter}
                    setFilterValue={setDifficultyFilter}
                    filterOptions={difficultyOptions}
                    placeholder="Search treks..."
                    allLabel="All Difficulties"
                />

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                        <FaTimesCircle />
                        {error}
                        <button onClick={fetchTreks} className="ml-auto underline font-black">Try Again</button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] border border-gray-100 animate-pulse flex flex-col">
                                <div className="h-48 bg-gray-100 rounded-t-3xl" />
                                <div className="p-5 space-y-4 flex-1">
                                    <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="h-10 bg-gray-50 rounded-xl" />
                                        <div className="h-10 bg-gray-50 rounded-xl" />
                                    </div>
                                    <div className="mt-auto h-12 bg-gray-50 rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {filteredData.map((trek) => (
                            <TrekCard
                                key={trek._id}
                                trek={trek}
                                onEdit={handleEdit}
                                onView={handleView}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
                        <div className="bg-emerald-50 text-emerald-500 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <FaMountain size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Treks Found</h3>
                        <p className="text-gray-500 font-bold max-w-sm mx-auto">
                            {searchQuery ? `We couldn't find any treks matching "${searchQuery}".` : "You haven't added any treks to the catalog yet."}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-emerald-600 font-black hover:text-emerald-700 transition-colors underline"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>


            {/* View Details Modal */}
         <Modal
    isOpen={isViewModalOpen}
    onClose={() => setIsViewModalOpen(false)}
    title="Trek Details"
    size="xl"
>
    {selectedTrek && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                        src={selectedTrek.image?.cdnUrl || "https://tse1.mm.bing.net/th/id/OIP.dI22OgiQxCFyDNQ2PaNtvQHaE8?pid=Api&P=0&h=180"}
                        alt={selectedTrek.title || "Trek"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "https://tse1.mm.bing.net/th/id/OIP.dI22OgiQxCFyDNQ2PaNtvQHaE8?pid=Api&P=0&h=180";
                        }}
                    />
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                            {selectedTrek.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                            {selectedTrek.status}
                        </span>
                        {selectedTrek.featured && (
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold uppercase">
                                Featured
                            </span>
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        {selectedTrek.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-emerald-500" /> {selectedTrek.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-amber-500" /> {selectedTrek.duration}
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                            ₹ {selectedTrek.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                            ⭐ {selectedTrek.rating} ({selectedTrek.reviews} reviews)
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Group Size</p>
                    <p className="text-sm font-bold text-gray-800">{selectedTrek.groupSize}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Altitude</p>
                    <p className="text-sm font-bold text-gray-800">{selectedTrek.altitude || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Season</p>
                    <p className="text-sm font-bold text-gray-800">{selectedTrek.season || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Base Fee</p>
                    <p className="text-sm font-bold text-gray-800">₹ {selectedTrek.feeDetails?.baseFee || 0}</p>
                </div>
            </div>

            {/* Highlights & Description */}
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FaInfoCircle className="text-emerald-500" /> Highlights & Description
                </h4>
                <div className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100">
                    {selectedTrek.highlight || selectedTrek.description || "No specific highlights provided."}
                </div>
            </div>

            {/* Trek Gallery */}
            {selectedTrek.gallery?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <FiImage className="text-emerald-500" /> Trek Gallery
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedTrek.gallery.map((img, index) => (
                            <img
                                key={index}
                                src={img.cdnUrl}
                                alt={`Gallery ${index}`}
                                className="w-full h-40 object-cover rounded-xl border border-gray-100 shadow-sm"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Addons / Benefits */}
            {selectedTrek.addons?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <FiPlusCircle className="text-emerald-500" /> Addons & Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTrek.addons.map((addon) => (
                            <div key={addon._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="font-bold text-gray-800">{addon.name}</p>
                                <p className="text-sm text-gray-500">{addon.description}</p>
                                <p className="text-sm font-semibold text-gray-800">₹ {addon.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Close
                </button>
                <button
                    onClick={() => handleEdit(selectedTrek)}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                >
                    <FaEdit size={14} /> Edit Catalog
                </button>
            </div>
        </div>
    )}
</Modal>

        </div>
    );
}
