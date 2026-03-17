// import { useState, useEffect, useCallback } from "react";
// import {
//   FiPlus,
//   FiX,
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
//   FiRefreshCw,
//   FiAlertCircle,
//   FiCheck,
// } from "react-icons/fi";
// import {
//   FaLayerGroup,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaEdit,
//   FaTrashAlt,
//   FaEllipsisV,
// } from "react-icons/fa";

// import {
//   getAllBookingTypes,
//   createBookingTypes,
//   updateBookingType,
//   deactivateBookingType,
//   deleteBookingType,
// } from "../api/bookingType";

// // ── Edit Modal ────────────────────────────────────────────────────────────────

// function EditModal({ row, onClose, onSave }) {
//   const [name, setName] = useState(row.name);
//   const [isActive, setIsActive] = useState(row.isActive ?? row.active);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSave = async () => {
//     if (!name.trim()) return;
//     setSaving(true);
//     setError("");
//     setSuccessMessage("");
//     try {
//       await onSave(row.id, { name: name.trim(), isActive });
//       setSuccessMessage("Booking type updated successfully!");
//     } catch (err) {
//       setError(err.message || "Failed to update booking type.");
//       setSaving(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
//               <FaEdit size={16} />
//             </div>
//             <div>
//               <h2 className="text-base font-black text-gray-900">
//                 Edit Booking Type
//               </h2>
//               <p className="text-xs text-gray-400 font-medium mt-0.5">
//                 Update name or status
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <FiX size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-4">
//           {/* API Error */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
//               <FiAlertCircle
//                 className="text-red-600 mt-0.5 flex-shrink-0"
//                 size={15}
//               />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           {/* Success */}
//           {successMessage && (
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//               <FiCheck
//                 className="text-blue-600 mt-0.5 flex-shrink-0"
//                 size={15}
//               />
//               <p className="text-sm text-blue-700">{successMessage}</p>
//             </div>
//           )}

//           <div>
//             <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1.5">
//               Trek Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1.5">
//               Status
//             </label>
//             <div className="flex gap-3">
//               {[true, false].map((val) => (
//                 <button
//                   key={String(val)}
//                   onClick={() => setIsActive(val)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all ${
//                     isActive === val
//                       ? val
//                         ? "bg-blue-50 border-blue-300 text-blue-600"
//                         : "bg-amber-50 border-amber-300 text-amber-600"
//                       : "bg-gray-50 border-gray-100 text-gray-400"
//                   }`}
//                 >
//                   {val ? (
//                     <FaCheckCircle size={11} />
//                   ) : (
//                     <FaTimesCircle size={11} />
//                   )}
//                   {val ? "Active" : "Inactive"}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!name.trim() || saving}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
//           >
//             {saving ? (
//               <FiRefreshCw size={14} className="animate-spin" />
//             ) : (
//               <FaEdit size={13} />
//             )}
//             {saving ? "Saving…" : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────

// export default function BookingTreks() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [search, setSearch] = useState("");
//   const [showCount, setShowCount] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editRow, setEditRow] = useState(null);
//   const [openMenuId, setOpenMenuId] = useState(null);

//   // Add-modal state
//   const [chips, setChips] = useState([]);
//   const [chipInput, setChipInput] = useState("");
//   const [chipError, setChipError] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [modalSuccess, setModalSuccess] = useState("");

//   // ── Helpers ──
//   const showError = (msg) => {
//     setError(msg);
//     setSuccessMessage("");
//   };
//   const showSuccess = (msg) => {
//     setSuccessMessage(msg);
//     setError("");
//   };

//   // ── Fetch all ──
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");
//     try {
//       const res = await getAllBookingTypes();
//       const list = Array.isArray(res) ? res : (res?.data ?? []);
//       setData(
//         list.map((r) => ({
//           ...r,
//           id: r._id ?? r.id,
//           active: r.isActive ?? r.active ?? true,
//         })),
//       );
//     } catch (err) {
//       showError(`Failed to load booking types: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   // ── Close menu on outside click ──
//   useEffect(() => {
//     const handler = () => setOpenMenuId(null);
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   // ── Toggle status via PUT ──
//   const toggleStatus = async (row) => {
//     const newActive = !row.active;
//     setData((prev) =>
//       prev.map((r) => (r.id === row.id ? { ...r, active: newActive } : r)),
//     );
//     setOpenMenuId(null);
//     setError("");
//     setSuccessMessage("");
//     try {
//       await deactivateBookingType(row._id ?? row.id);
//       showSuccess(
//         `"${row.name}" marked ${newActive ? "active" : "inactive"} successfully.`,
//       );
//     } catch (err) {
//       setData((prev) =>
//         prev.map((r) => (r.id === row.id ? { ...r, active: row.active } : r)),
//       );
//       showError(`Failed to update status: ${err.message}`);
//     }
//   };

//   // ── Edit save via PUT ──
//   const handleEditSave = async (id, payload) => {
//     await updateBookingType(id, payload);
//     setData((prev) =>
//       prev.map((r) =>
//         r.id === id
//           ? { ...r, name: payload.name, active: payload.isActive }
//           : r,
//       ),
//     );
//     setEditRow(null);
//     showSuccess("Booking type updated successfully.");
//   };

//   // ── Delete (local only) ──
//   const deleteRow = (id) => {
//     setData((prev) => prev.filter((r) => r.id !== id));
//     setOpenMenuId(null);
//     showSuccess("Booking type deleted.");
//   };

//   // ── Add modal helpers ──
//   const openModal = () => {
//     setModalOpen(true);
//     setChips([]);
//     setChipInput("");
//     setChipError(false);
//     setModalError("");
//     setModalSuccess("");
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setChips([]);
//     setChipInput("");
//     setChipError(false);
//     setModalError("");
//     setModalSuccess("");
//   };

//   const addChip = () => {
//     const val = chipInput.trim();
//     if (!val) return;
//     if (!chips.includes(val)) setChips((prev) => [...prev, val]);
//     setChipInput("");
//     setChipError(false);
//   };

//   const removeChip = (i) =>
//     setChips((prev) => prev.filter((_, idx) => idx !== i));

//   // ── Save new booking types via POST (array) ──
//   const handleSave = async () => {
//     if (chips.length === 0) {
//       setChipError(true);
//       return;
//     }
//     setSaving(true);
//     setModalError("");
//     setModalSuccess("");

//     try {
//       const res = await createBookingTypes(chips);
//       // Normalise: backend returns array directly or wrapped in { data: [...] }
//       const created = Array.isArray(res) ? res : (res?.data ?? []);

//       setData((prev) => [
//         ...prev,
//         ...created.map((r) => ({
//           ...r,
//           id: r._id ?? r.id,
//           active: r.isActive ?? true,
//         })),
//       ]);
//       setCurrentPage(1);
//       setModalSuccess(
//         `${created.length} booking type${created.length > 1 ? "s" : ""} added successfully!`,
//       );
//       setChips([]);
//       setTimeout(() => closeModal(), 1200);
//     } catch (err) {
//       setModalError(err.message || "Failed to create booking types.");
//     }

//     setSaving(false);
//   };

//   // ── Filtering & pagination ──
//   const filtered = data.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase()),
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / showCount));
//   const paginated = filtered.slice(
//     (currentPage - 1) * showCount,
//     currentPage * showCount,
//   );

//   // ── Render ──
//   return (
//     <div className="bg-gray-50 min-h-screen p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
//               <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
//                 <FaLayerGroup />
//               </div>
//               Booking Treks
//             </h1>
//             <p className="text-gray-500 font-medium mt-1">
//               Organize your treks into meaningful collections
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={fetchAll}
//               disabled={loading}
//               className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition disabled:opacity-40"
//               title="Refresh"
//             >
//               <FiRefreshCw
//                 size={16}
//                 className={loading ? "animate-spin" : ""}
//               />
//             </button>
//             <button
//               onClick={openModal}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 w-fit"
//             >
//               <FiPlus size={16} />
//               Add Booking Type
//             </button>
//           </div>
//         </header>

//         {/* API Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
//             <FiAlertCircle
//               className="text-red-600 mt-1 flex-shrink-0"
//               size={16}
//             />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Success Message */}
//         {successMessage && (
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//             <FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={16} />
//             <p className="text-sm text-blue-700">{successMessage}</p>
//           </div>
//         )}

//         {/* Table Card */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {/* Toolbar */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
//             <div className="relative">
//               <FiSearch
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//               <input
//                 type="text"
//                 placeholder="Search trek types..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-gray-50 w-72 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
//               />
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               Show
//               <select
//                 value={showCount}
//                 onChange={(e) => {
//                   setShowCount(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-blue-400 transition"
//               >
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[50%]">
//                   Trek Name
//                 </th>
//                 <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[25%]">
//                   Status
//                 </th>
//                 <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[25%]">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={3} className="text-center py-14">
//                     <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-sm">
//                       <FiRefreshCw size={16} className="animate-spin" />
//                       Loading booking types…
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginated.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="text-center text-gray-400 font-medium text-sm py-14"
//                   >
//                     No trek types found
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((row) => (
//                   <tr
//                     key={row.id}
//                     className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
//                   >
//                     {/* Trek Name */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                           <FaLayerGroup className="text-blue-500 text-xs" />
//                         </div>
//                         <div>
//                           <p className="font-black text-gray-900 text-sm leading-tight">
//                             {row.name}
//                           </p>
//                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
//                             ID: {row.id}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4">
//                       {row.active ? (
//                         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 w-fit">
//                           <FaCheckCircle size={10} />
//                           <span className="text-[10px] font-black uppercase tracking-wider">
//                             Active
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 w-fit">
//                           <FaTimesCircle size={10} />
//                           <span className="text-[10px] font-black uppercase tracking-wider">
//                             Inactive
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4">
//                       <div
//                         className="relative inline-block"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={() =>
//                             setOpenMenuId(openMenuId === row.id ? null : row.id)
//                           }
//                           className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
//                         >
//                           <FaEllipsisV size={13} />
//                         </button>

//                         {openMenuId === row.id && (
//                           <div className="absolute left-0 top-10 z-20 bg-white border border-gray-100 rounded-xl shadow-xl w-48 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
//                             <button
//                               onClick={() => toggleStatus(row)}
//                               className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-gray-50 flex items-center gap-2.5 ${
//                                 row.active
//                                   ? "text-gray-500 hover:text-amber-600"
//                                   : "text-gray-500 hover:text-blue-600"
//                               }`}
//                             >
//                               {row.active ? (
//                                 <>
//                                   <FaTimesCircle
//                                     size={12}
//                                     className="text-amber-500"
//                                   />
//                                   Mark Inactive
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaCheckCircle
//                                     size={12}
//                                     className="text-blue-500"
//                                   />
//                                   Mark Active
//                                 </>
//                               )}
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setEditRow(row);
//                                 setOpenMenuId(null);
//                               }}
//                               className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
//                             >
//                               <FaEdit size={12} className="text-blue-400" />{" "}
//                               Edit Trek
//                             </button>
//                             <div className="my-1 border-t border-gray-100" />
//                             <button
//                               onClick={() => deleteRow(row.id)}
//                               className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
//                             >
//                               <FaTrashAlt size={12} /> Delete
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Footer */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
//             <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
//               Showing{" "}
//               <span className="text-gray-700">
//                 {filtered.length === 0 ? 0 : (currentPage - 1) * showCount + 1}
//               </span>{" "}
//               to{" "}
//               <span className="text-gray-700">
//                 {Math.min(currentPage * showCount, filtered.length)}
//               </span>{" "}
//               of <span className="text-gray-700">{filtered.length}</span>{" "}
//               entries
//             </p>
//             <div className="flex items-center gap-1.5">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
//               >
//                 <FiChevronLeft size={14} />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`w-8 h-8 rounded-lg text-xs font-black transition ${
//                       page === currentPage
//                         ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
//                         : "border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ),
//               )}
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
//               >
//                 <FiChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Add Modal ── */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) closeModal();
//           }}
//         >
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
//                   <FaLayerGroup size={16} />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-black text-gray-900">
//                     Add Booking Type
//                   </h2>
//                   <p className="text-xs text-gray-400 font-medium mt-0.5">
//                     Add multiple trek types at once
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <FiX size={18} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="px-6 py-5 space-y-4">
//               {/* API Error */}
//               {modalError && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
//                   <FiAlertCircle
//                     className="text-red-600 mt-1 flex-shrink-0"
//                     size={15}
//                   />
//                   <p className="text-sm text-red-700">{modalError}</p>
//                 </div>
//               )}

//               {/* Success */}
//               {modalSuccess && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//                   <FiCheck
//                     className="text-blue-600 mt-1 flex-shrink-0"
//                     size={15}
//                   />
//                   <p className="text-sm text-blue-700">{modalSuccess}</p>
//                 </div>
//               )}

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
//                   Trek Types <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-xs text-gray-400 font-medium">
//                   Type a trek name and click <strong>Add</strong> or press{" "}
//                   <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[10px] font-bold">
//                     Enter
//                   </kbd>
//                   . Each will be POSTed individually.
//                 </p>

//                 {/* Chips area */}
//                 <div
//                   className={`flex flex-wrap gap-2 min-h-[56px] px-3 py-3 rounded-xl items-start border-2 transition-colors ${
//                     chipError
//                       ? "bg-red-50 border-red-200"
//                       : "bg-gray-50 border-gray-100"
//                   }`}
//                 >
//                   {chips.length === 0 ? (
//                     <span className="text-xs text-gray-400 font-medium self-center">
//                       No trek types added yet…
//                     </span>
//                   ) : (
//                     chips.map((chip, i) => (
//                       <span
//                         key={i}
//                         className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-lg px-3 py-1.5 border border-blue-200"
//                       >
//                         {chip}
//                         <button
//                           onClick={() => removeChip(i)}
//                           className="hover:text-blue-900 transition-colors ml-0.5"
//                         >
//                           <FiX size={11} />
//                         </button>
//                       </span>
//                     ))
//                   )}
//                 </div>

//                 {chipError && (
//                   <p className="text-xs text-red-500 font-bold flex items-center gap-1">
//                     <FaTimesCircle size={11} /> Please add at least one trek
//                     type.
//                   </p>
//                 )}

//                 {/* Input row */}
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="e.g. Mountain Hike, Valley Walk…"
//                     value={chipInput}
//                     onChange={(e) => setChipInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addChip();
//                       }
//                     }}
//                     className="flex-1 px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-300"
//                   />
//                   <button
//                     onClick={addChip}
//                     className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 border-2 border-blue-100 text-blue-600 rounded-xl text-sm font-black hover:bg-blue-100 transition-colors whitespace-nowrap"
//                   >
//                     <FiPlus size={14} />
//                     Add
//                   </button>
//                 </div>

//                 {chips.length > 0 && (
//                   <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
//                     {chips.length} trek type{chips.length > 1 ? "s" : ""} ready
//                     to save
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
//               >
//                 {saving ? (
//                   <>
//                     <FiRefreshCw size={14} className="animate-spin" /> Saving…
//                   </>
//                 ) : (
//                   <>
//                     <FiPlus size={15} /> Save Booking Type
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Edit Modal ── */}
//       {editRow && (
//         <EditModal
//           row={editRow}
//           onClose={() => setEditRow(null)}
//           onSave={handleEditSave}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import {
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrashAlt,
  FaEllipsisV,
} from "react-icons/fa";

import {
  getAllBookingTypes,
  createBookingTypes,
  updateBookingType,
  deactivateBookingType,
  deleteBookingType,
} from "../api/bookingType";

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({ row, onClose, onSave }) {
  const [name, setName] = useState(row.name);
  const [isActive, setIsActive] = useState(row.isActive ?? row.active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      await onSave(row.id, { name: name.trim(), isActive });
      setSuccessMessage("Booking type updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update booking type.");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <FaEdit size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                Edit Booking Type
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Update name or status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* API Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
              <FiAlertCircle
                className="text-red-600 mt-0.5 flex-shrink-0"
                size={15}
              />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <FiCheck
                className="text-blue-600 mt-0.5 flex-shrink-0"
                size={15}
              />
              <p className="text-sm text-blue-700">{successMessage}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              Trek Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              Status
            </label>
            <div className="flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setIsActive(val)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all ${
                    isActive === val
                      ? val
                        ? "bg-blue-50 border-blue-300 text-blue-600"
                        : "bg-amber-50 border-amber-300 text-amber-600"
                      : "bg-gray-50 border-gray-100 text-gray-400"
                  }`}
                >
                  {val ? (
                    <FaCheckCircle size={11} />
                  ) : (
                    <FaTimesCircle size={11} />
                  )}
                  {val ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {saving ? (
              <FiRefreshCw size={14} className="animate-spin" />
            ) : (
              <FaEdit size={13} />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ row, onClose, onConfirm, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <FaTrashAlt size={15} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                Delete Booking Type
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-black text-gray-900">"{row.name}"</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-red-500/20 active:scale-95"
          >
            {deleting ? (
              <FiRefreshCw size={14} className="animate-spin" />
            ) : (
              <FaTrashAlt size={12} />
            )}
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingTreks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null); // row pending deletion
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Add-modal state
  const [chips, setChips] = useState([]);
  const [chipInput, setChipInput] = useState("");
  const [chipError, setChipError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // ── Helpers ──
  const showError = (msg) => {
    setError(msg);
    setSuccessMessage("");
  };
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setError("");
  };

  // ── Fetch all ──
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await getAllBookingTypes();
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setData(
        list
          .filter((r) => r && r.name)
          .map((r) => ({
            ...r,
            id: r._id ?? r.id,
            active: r.isActive ?? true,
          })),
      );
    } catch (err) {
      showError(`Failed to load booking types: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Close menu on outside click ──
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Toggle status ──
  const toggleStatus = async (row) => {
    const newActive = !row.active;
    const rowId = row._id ?? row.id;
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, active: newActive } : r)),
    );
    setOpenMenuId(null);
    setError("");
    setSuccessMessage("");
    try {
      if (newActive) {
        await updateBookingType(rowId, { name: row.name, isActive: true });
      } else {
        await deactivateBookingType(rowId);
      }
      showSuccess(
        `"${row.name}" marked ${newActive ? "active" : "inactive"} successfully.`,
      );
    } catch (err) {
      setData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, active: row.active } : r)),
      );
      showError(`Failed to update status: ${err.message}`);
    }
  };

  // ── Edit save via PUT ──
  const handleEditSave = async (id, payload) => {
    await updateBookingType(id, payload);
    setData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, name: payload.name, active: payload.isActive }
          : r,
      ),
    );
    setEditRow(null);
    showSuccess("Booking type updated successfully.");
  };

  // ── Delete via API ──
  const handleDeleteConfirm = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    try {
      await deleteBookingType(deleteRow._id ?? deleteRow.id);
      setData((prev) => prev.filter((r) => r.id !== deleteRow.id));
      showSuccess(`"${deleteRow.name}" deleted successfully.`);
      setDeleteRow(null);
    } catch (err) {
      showError(`Failed to delete: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // ── Add modal helpers ──
  const openModal = () => {
    setModalOpen(true);
    setChips([]);
    setChipInput("");
    setChipError(false);
    setModalError("");
    setModalSuccess("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setChips([]);
    setChipInput("");
    setChipError(false);
    setModalError("");
    setModalSuccess("");
  };

  const addChip = () => {
    const val = chipInput.trim();
    if (!val) return;
    if (!chips.includes(val)) setChips((prev) => [...prev, val]);
    setChipInput("");
    setChipError(false);
  };

  const removeChip = (i) =>
    setChips((prev) => prev.filter((_, idx) => idx !== i));

  // ── Save new booking types via POST (array) ──
  const handleSave = async () => {
    if (chips.length === 0) {
      setChipError(true);
      return;
    }
    setSaving(true);
    setModalError("");
    setModalSuccess("");

    try {
      const res = await createBookingTypes(chips);
      const created = Array.isArray(res) ? res : (res?.data ?? []);

      setData((prev) => [
        ...prev,
        ...created.map((r) => ({
          ...r,
          id: r._id ?? r.id,
          active: r.isActive ?? true,
        })),
      ]);
      setCurrentPage(1);
      setModalSuccess(
        `${created.length} booking type${created.length > 1 ? "s" : ""} added successfully!`,
      );
      setChips([]);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setModalError(err.message || "Failed to create booking types.");
    }

    setSaving(false);
  };

  // ── Filtering & pagination ──
  const filtered = data.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / showCount));
  const paginated = filtered.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  );

  // ── Render ──
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FaLayerGroup />
              </div>
              Booking Treks
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Organize your treks into meaningful collections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition disabled:opacity-40"
              title="Refresh"
            >
              <FiRefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 w-fit"
            >
              <FiPlus size={16} />
              Add Booking Type
            </button>
          </div>
        </header>

        {/* API Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <FiAlertCircle
              className="text-red-600 mt-1 flex-shrink-0"
              size={16}
            />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={16} />
            <p className="text-sm text-blue-700">{successMessage}</p>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-scroll">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search trek types..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-gray-50 w-72 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Show
              <select
                value={showCount}
                onChange={(e) => {
                  setShowCount(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-blue-400 transition"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[50%]">
                  Trek Name
                </th>
                <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[25%]">
                  Status
                </th>
                <th className="text-left text-[10px] font-black text-blue-600 tracking-widest uppercase px-6 py-3 w-[25%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-14">
                    <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-sm">
                      <FiRefreshCw size={16} className="animate-spin" />
                      Loading booking types…
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-400 font-medium text-sm py-14"
                  >
                    No trek types found
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Trek Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FaLayerGroup className="text-blue-500 text-xs" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm leading-tight">
                            {row.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                            ID: {row.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {row.active ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                          <FaCheckCircle size={10} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 w-fit">
                          <FaTimesCircle size={10} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            Inactive
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div
                        className="relative inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === row.id ? null : row.id)
                          }
                          className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaEllipsisV size={13} />
                        </button>

                        {openMenuId === row.id && (
                          <div className="absolute left-0 top-10 z-20 bg-white border border-gray-100 rounded-xl shadow-xl w-48 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                            <button
                              onClick={() => toggleStatus(row)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-gray-50 flex items-center gap-2.5 ${
                                row.active
                                  ? "text-gray-500 hover:text-amber-600"
                                  : "text-gray-500 hover:text-blue-600"
                              }`}
                            >
                              {row.active ? (
                                <>
                                  <FaTimesCircle
                                    size={12}
                                    className="text-amber-500"
                                  />
                                  Mark Inactive
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle
                                    size={12}
                                    className="text-blue-500"
                                  />
                                  Mark Active
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditRow(row);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                            >
                              <FaEdit size={12} className="text-blue-400" />{" "}
                              Edit Trek
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                            <button
                              onClick={() => {
                                setDeleteRow(row);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                            >
                              <FaTrashAlt size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Showing{" "}
              <span className="text-gray-700">
                {filtered.length === 0 ? 0 : (currentPage - 1) * showCount + 1}
              </span>{" "}
              to{" "}
              <span className="text-gray-700">
                {Math.min(currentPage * showCount, filtered.length)}
              </span>{" "}
              of <span className="text-gray-700">{filtered.length}</span>{" "}
              entries
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition ${
                      page === currentPage
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <FaLayerGroup size={16} />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Add Booking Type
                  </h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Add multiple trek types at once
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* API Error */}
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <FiAlertCircle
                    className="text-red-600 mt-1 flex-shrink-0"
                    size={15}
                  />
                  <p className="text-sm text-red-700">{modalError}</p>
                </div>
              )}

              {/* Success */}
              {modalSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <FiCheck
                    className="text-blue-600 mt-1 flex-shrink-0"
                    size={15}
                  />
                  <p className="text-sm text-blue-700">{modalSuccess}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Trek Types <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 font-medium">
                  Type a trek name and click <strong>Add</strong> or press{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[10px] font-bold">
                    Enter
                  </kbd>
                  . Each will be POSTed individually.
                </p>

                {/* Chips area */}
                <div
                  className={`flex flex-wrap gap-2 min-h-[56px] px-3 py-3 rounded-xl items-start border-2 transition-colors ${
                    chipError
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  {chips.length === 0 ? (
                    <span className="text-xs text-gray-400 font-medium self-center">
                      No trek types added yet…
                    </span>
                  ) : (
                    chips.map((chip, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-lg px-3 py-1.5 border border-blue-200"
                      >
                        {chip}
                        <button
                          onClick={() => removeChip(i)}
                          className="hover:text-blue-900 transition-colors ml-0.5"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {chipError && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                    <FaTimesCircle size={11} /> Please add at least one trek
                    type.
                  </p>
                )}

                {/* Input row */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Mountain Hike, Valley Walk…"
                    value={chipInput}
                    onChange={(e) => setChipInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addChip();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-300"
                  />
                  <button
                    onClick={addChip}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 border-2 border-blue-100 text-blue-600 rounded-xl text-sm font-black hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    <FiPlus size={14} />
                    Add
                  </button>
                </div>

                {chips.length > 0 && (
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                    {chips.length} trek type{chips.length > 1 ? "s" : ""} ready
                    to save
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {saving ? (
                  <>
                    <FiRefreshCw size={14} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <FiPlus size={15} /> Save Booking Type
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editRow && (
        <EditModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={handleEditSave}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteRow && (
        <DeleteModal
          row={deleteRow}
          onClose={() => setDeleteRow(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </div>
  );
}
