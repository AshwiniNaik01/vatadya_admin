import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { getAllSlots, deleteSlot, updateSlot } from "../api/slotsApi";
import { toast } from "react-hot-toast";

const ManageSlot = () => {
  const [slots, setSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    displayRange: "",
    startDate: "",
    endDate: "",
    totalSeats: "",
    bookedSeats: "",
    status: "AVBL",
  });
  const [updating, setUpdating] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setFetchingSlots(true);
      const response = await getAllSlots();
      const slotsData = response.data || response.slots || response;
      setSlots(Array.isArray(slotsData) ? slotsData : []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast?.error?.(error.message || "Failed to fetch slots");
      setSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  const calculateAvailability = (slot) => {
    const available = slot.totalSeats - slot.bookedSeats;
    const percentage =
      ((slot.totalSeats - slot.bookedSeats) / slot.totalSeats) * 100;
    return { available, percentage };
  };

  const getStatusBadge = (status) => {
    const configs = {
      AVBL: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Available",
        icon: FiCheckCircle,
      },
      "FAST FILLING": {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Fast Filling",
        icon: FiAlertCircle,
      },
      LIMITED: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Limited",
        icon: FiAlertCircle,
      },
      FULL: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Full",
        icon: FiX,
      },
    };
    return configs[status] || configs["AVBL"];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (slot) => {
    setSlotToEdit(slot);

    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEditFormData({
      displayRange: slot.displayRange || "",
      startDate: formatDateForInput(slot.startDate),
      endDate: formatDateForInput(slot.endDate),
      totalSeats: slot.totalSeats.toString(),
      bookedSeats: slot.bookedSeats.toString(),
      status: slot.status || "AVBL",
    });

    setFormErrors({});
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.displayRange.trim()) {
      errors.displayRange = "Display range is required";
    }

    if (!editFormData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!editFormData.endDate) {
      errors.endDate = "End date is required";
    }

    if (editFormData.startDate && editFormData.endDate) {
      const start = new Date(editFormData.startDate);
      const end = new Date(editFormData.endDate);
      if (end <= start) {
        errors.endDate = "End date must be after start date";
      }
    }

    const totalSeats = parseInt(editFormData.totalSeats);
    if (!editFormData.totalSeats || isNaN(totalSeats) || totalSeats <= 0) {
      errors.totalSeats = "Total seats must be a positive number";
    }

    const bookedSeats = parseInt(editFormData.bookedSeats);
    if (isNaN(bookedSeats) || bookedSeats < 0) {
      errors.bookedSeats = "Booked seats must be a non-negative number";
    }

    if (bookedSeats > totalSeats) {
      errors.bookedSeats = "Booked seats cannot exceed total seats";
    }

    return errors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast?.error?.("Please fix the errors in the form");
      return;
    }

    try {
      setUpdating(true);

      const updateData = {
        displayRange: editFormData.displayRange.trim(),
        startDate: new Date(editFormData.startDate).toISOString(),
        endDate: new Date(editFormData.endDate).toISOString(),
        totalSeats: parseInt(editFormData.totalSeats),
        bookedSeats: parseInt(editFormData.bookedSeats),
        status: editFormData.status,
      };

      await updateSlot(slotToEdit._id, updateData);

      setSlots(
        slots.map((slot) =>
          slot._id === slotToEdit._id ? { ...slot, ...updateData } : slot,
        ),
      );

      toast?.success?.("Slot updated successfully");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating slot:", error);
      toast?.error?.(error.message || "Failed to update slot");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deleteSlot(slotToDelete._id);
      setSlots(slots.filter((s) => s._id !== slotToDelete._id));
      toast?.success?.("Slot deleted successfully");
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast?.error?.(error.message || "Failed to delete slot");
    } finally {
      setDeleting(false);
    }
  };

  const getAvailabilityColor = (percentage) => {
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Slot Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage trek availability and bookings
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={fetchSlots}
              disabled={fetchingSlots}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-5 h-5 ${fetchingSlots ? "animate-spin" : ""}`}
              />
              Refresh
            </button> */}
            <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-bold">
              {slots.length} Slots
            </div>
          </div>
        </div>

        {/* Loading State */}
        {fetchingSlots ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading slots...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-5 h-5" />
                          Date Range
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-5 h-5" />
                          Duration
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-5 h-5" />
                          Seats
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {slots.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FiCalendar className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-semibold text-lg">
                              No slots available
                            </p>
                            <p className="text-gray-400 text-sm">
                              Create new slots to get started
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      slots.map((slot) => {
                        const { available, percentage } =
                          calculateAvailability(slot);
                        const statusConfig = getStatusBadge(slot.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr
                            key={slot._id}
                            className="hover:bg-blue-50/30 transition-colors"
                          >
                            {/* Date Range */}
                            <td className="px-6 py-5">
                              <div className="font-bold text-gray-900 text-lg">
                                {slot.displayRange}
                              </div>
                            </td>

                            {/* Duration */}
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-700">
                                <div className="font-medium">
                                  {formatDate(slot.startDate)}
                                </div>
                                <div className="text-gray-500">to</div>
                                <div className="font-medium">
                                  {formatDate(slot.endDate)}
                                </div>
                              </div>
                            </td>

                            {/* Seats */}
                            <td className="px-6 py-5">
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-gray-700">
                                  Total:{" "}
                                  <span className="text-gray-900">
                                    {slot.totalSeats}
                                  </span>
                                </div>
                                <div className="text-sm font-semibold text-gray-700">
                                  Booked:{" "}
                                  <span className="text-orange-600">
                                    {slot.bookedSeats}
                                  </span>
                                </div>
                                <div className="text-sm font-semibold text-gray-700">
                                  Available:{" "}
                                  <span className="text-blue-600">
                                    {available}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Availability Progress */}
                            <td className="px-6 py-5">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                                  <span>{percentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${getAvailabilityColor(percentage)}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {available} / {slot.totalSeats} seats free
                                </div>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {statusConfig.label}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(slot)}
                                  className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-semibold"
                                  title="Edit Slot"
                                >
                                  <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSlotToDelete(slot);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-semibold"
                                  title="Delete Slot"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Footer Stats
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md">
                <div className="text-blue-600 text-sm font-semibold mb-1">
                  Total Slots
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {slots.length}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md">
                <div className="text-blue-600 text-sm font-semibold mb-1">
                  Total Seats
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {slots.reduce((sum, slot) => sum + slot.totalSeats, 0)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-md">
                <div className="text-orange-600 text-sm font-semibold mb-1">
                  Booked
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {slots.reduce((sum, slot) => sum + slot.bookedSeats, 0)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md">
                <div className="text-blue-600 text-sm font-semibold mb-1">
                  Available
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {slots.reduce(
                    (sum, slot) => sum + (slot.totalSeats - slot.bookedSeats),
                    0,
                  )}
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Delete Slot
                </h3>
                <p className="text-gray-500 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {slotToDelete && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 font-semibold">
                  {slotToDelete.displayRange}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(slotToDelete.startDate)} -{" "}
                  {formatDate(slotToDelete.endDate)}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Edit Slot
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Update slot information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Display Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Range
                </label>
                <input
                  type="text"
                  name="displayRange"
                  value={editFormData.displayRange}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formErrors.displayRange
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                    }`}
                  placeholder="e.g., 2nd Feb - 19th Feb"
                />
                {formErrors.displayRange && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.displayRange}
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formErrors.startDate
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                      }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={editFormData.endDate}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formErrors.endDate
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                      }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Seats */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={editFormData.totalSeats}
                    onChange={handleEditFormChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formErrors.totalSeats
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                      }`}
                  />
                  {formErrors.totalSeats && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.totalSeats}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booked Seats
                  </label>
                  <input
                    type="number"
                    name="bookedSeats"
                    value={editFormData.bookedSeats}
                    onChange={handleEditFormChange}
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formErrors.bookedSeats
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                      }`}
                  />
                  {formErrors.bookedSeats && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.bookedSeats}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-medium"
                >
                  <option value="AVBL">Available</option>
                  <option value="FAST FILLING">Fast Filling</option>
                  <option value="LIMITED">Limited</option>
                  <option value="FULL">Full</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={updating}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold hover:from-blue-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlot;
