import { FaSearch, FaFilter } from "react-icons/fa";

export default function FilterControls({
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    filterOptions = [],
    placeholder = "Search...",
    filterLabel = "Select Option",
    allLabel = "All"
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4">
            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                {/* Reusable Dropdown Filter */}
                <div className="relative group min-w-[200px]">
                    <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={12} />
                    <select
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-xs font-black text-gray-700 focus:ring-4 focus:ring-emerald-500/10 appearance-none transition-all cursor-pointer"
                    >
                        <option value="all">{allLabel}</option>
                        {filterOptions.map((option) => (
                            <option key={option._id || option.id || option.value} value={option._id || option.id || option.value}>
                                {option.title || option.name || option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                {/* Reusable Search Input */}
                <div className="relative group flex-1 md:flex-none">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={12} />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-black text-gray-700 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="hidden md:block">
                {/* Optional slot for additional info if needed */}
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Filter Engine Active</p>
            </div>
        </div>
    );
}
