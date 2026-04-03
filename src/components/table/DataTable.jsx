import { useState, useEffect, useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEllipsisV,
} from "react-icons/fa";

/**
 * Reusable DataTable component with pagination, search, and row actions.
 * Theme: Amber / blue Combination
 * @param {Array} columns - Header labels and accessor keys/render functions.
 * @param {Array} data - Raw data array.
 * @param {Boolean} loading - Loading state.
 * @param {Number} initialPageSize - Default results per page.
 * @param {Array} rowActions - Optional array of { label, icon, onClick, variant }.
 */
export default function DataTable({
  columns,
  data = [],
  loading = false,
  initialPageSize = 10,
  rowActions = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (idx) => {
    setActiveDropdown(activeDropdown === idx ? null : idx);
  };

  return (
    <div className="bg-white max-h-[600px] rounded-3xl shadow-2xl shadow-blue-900/5 border border-blue-50/50 overflow-hidden">
      {/* Header Actions */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/30 to-amber-50/30">
        <div className="relative group w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search catalog..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-200 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-sm font-bold text-blue-700 hover:bg-amber-50 hover:border-amber-200 transition-all shadow-sm">
            <FaFilter className="text-amber-500" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-sm font-bold text-blue-700 hover:bg-amber-50 hover:border-amber-200 transition-all shadow-sm">
            <FaSortAmountDown className="text-amber-500" /> Sort
          </button> */}
          <select
            className="px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-sm font-bold text-blue-800 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-h-[650px] min-h-[250px] overflow-y-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-white">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-xs font-black text-blue-800/60 uppercase tracking-widest border-b border-blue-50 bg-blue-50/50 backdrop-blur-md"
                >
                  {col.label}
                </th>
              ))}
              {rowActions.length > 0 && (
                <th className="px-6 py-4 border-b border-blue-50 bg-blue-50/50 backdrop-blur-md w-20"></th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {loading ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-5">
                      <div className="h-4 bg-blue-50 rounded-full w-24 mx-auto md:mx-0"></div>
                    </td>
                  ))}
                  {rowActions.length > 0 && <td className="px-6 py-5"></td>}
                </tr>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-amber-50/30 transition-colors group relative"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-5 text-sm font-medium text-blue-900/80"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}

                  {rowActions.length > 0 && (
                    <td className="px-6 py-5 text-right relative overflow-visible">
                      <div
                        className="relative inline-block text-left"
                        ref={activeDropdown === rowIdx ? dropdownRef : null}
                      >
                        <button
                          onClick={() => toggleDropdown(rowIdx)}
                          className={`p-2 rounded-xl transition-all shadow-sm border ${
                            activeDropdown === rowIdx
                              ? "bg-amber-500 border-amber-400 text-white shadow-amber-500/20"
                              : "text-blue-200 border-transparent hover:text-amber-600 hover:bg-white hover:border-blue-100"
                          }`}
                        >
                          <FaEllipsisV />
                        </button>

                        {/* Actions Dropdown */}
                        {activeDropdown === rowIdx && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-blue-50 py-2 z-[100] animate-in fade-in zoom-in-95 duration-100">
                            {rowActions.map((action, actionIdx) => (
                              <button
                                key={actionIdx}
                                onClick={() => {
                                  action.onClick(row);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-all text-left
                                  ${
                                    action.variant === "danger"
                                      ? "text-red-500 hover:bg-red-50"
                                      : "text-blue-700 hover:bg-blue-50"
                                  }
                                `}
                              >
                                {action.icon && (
                                  <span className="text-lg opacity-60">
                                    {action.icon}
                                  </span>
                                )}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                  className="px-6 py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3 opacity-20 text-blue-900">
                    <FaSearch size={48} />
                    <p className="text-lg font-black uppercase tracking-[0.2em]">
                      No Matches Found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 bg-blue-50/10 border-t border-blue-50 flex flex-col sm:flex-row items-center justify-between gap-4 ">
        <p className="text-sm font-bold text-blue-900/50">
          Showing{" "}
          <span className="text-blue-700">
            {totalItems > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to <span className="text-blue-700">{endIndex}</span> of{" "}
          <span className="text-blue-700">{totalItems}</span> entries
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2.5 bg-white border border-blue-100 rounded-xl font-bold text-blue-600 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FaChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] h-10 rounded-xl text-sm font-black transition-all shadow-sm border
                      ${
                        currentPage === page
                          ? "bg-amber-500 border-amber-400 text-white shadow-amber-500/20"
                          : "bg-white border-blue-100 text-blue-700 hover:bg-blue-50"
                      }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-1 text-blue-200 font-bold">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2.5 bg-white border border-blue-100 rounded-xl font-bold text-blue-600 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
