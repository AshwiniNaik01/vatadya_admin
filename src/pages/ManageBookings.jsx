import { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSpinner,
} from "react-icons/fa";

// API Imports
import {
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../api/bookingApi";

import DataTable from "../components/table/DataTable";
import Modal from "../components/modal/Modal";

export default function ManageBookings() {
  const [data, setData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------------- Fetch All Bookings ---------------- */
  useEffect(() => {
    fetchBookings();
  }, []);

const fetchBookings = async () => {
  setIsLoading(true);
  setApiError("");
  try {
    const response = await getAllBookings();
    const bookingsRaw = response.data || response.bookings || [];
    
    // Map the API response to flatten nested fields for easier use
    const bookings = bookingsRaw.map((b) => ({
      ...b,
      trekTitle: b.trekId?.title || "Trek Adventure",
      trekLocation: b.trekId?.location || "",
      trekPrice: b.trekId?.price || 0,
      slotDetails: b.slots || [],
      status: b.paymentDetails?.status || "Pending",
      merchTxnId: b.paymentDetails?.merchTxnId || null,
    }));

    setData(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    setApiError(error.message || "Failed to load bookings. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  /* ---------------- Handlers ---------------- */
  const handleView = (row) => {
    setSelectedBooking(row);
    setIsViewOpen(true);
  };

  const handleEdit = (row) => {
    setEditBooking({ ...row });
    setIsEditOpen(true);
  };

  const handleDelete = async (row) => {
    if (
      !window.confirm(`Are you sure you want to delete booking ${row.trekId?.title}?`)
    ) {
      return;
    }

    setIsDeleting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await deleteBooking(row._id);

      // Remove from local state
      setData((prev) => prev.filter((b) => b._id !== row._id));

      setSuccessMessage(`Booking ${row.trekId?.title} deleted successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setApiError(
        error.message || "Failed to delete booking. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

const handleUpdateBooking = async (e) => {
  e.preventDefault();
  setIsUpdating(true);
  setApiError("");
  setSuccessMessage("");

  try {
    const updateData = {
      fullName: editBooking.name || editBooking.fullName,
      whatsappNumber: editBooking.phone || editBooking.whatsappNumber,
      email: editBooking.email,
      departureDate: editBooking.date || editBooking.departureDate,
      numberOfPeople: parseInt(editBooking.people || editBooking.numberOfPeople),
      status: editBooking.status,
      additionalMembers: editBooking.additionalMembers || [], // <-- include this
    };

    const response = await updateBooking(editBooking._id, updateData);

    // Update local state
    setData((prev) =>
      prev.map((b) => (b._id === editBooking._id ? { ...b, ...editBooking } : b))
    );

    setSuccessMessage("Booking updated successfully!");
    setIsEditOpen(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    console.error("Error updating booking:", error);
    setApiError(error.message || "Failed to update booking. Please try again.");
  } finally {
    setIsUpdating(false);
  }
};

  // const handleUpdateBooking = async (e) => {
  //   e.preventDefault();

  //   setIsUpdating(true);
  //   setApiError("");
  //   setSuccessMessage("");

  //   try {
  //     // Prepare update data
  //     const updateData = {
  //       fullName: editBooking.name || editBooking.fullName,
  //       whatsappNumber: editBooking.phone || editBooking.whatsappNumber,
  //       email: editBooking.email,
  //       departureDate: editBooking.date || editBooking.departureDate,
  //       numberOfPeople: parseInt(
  //         editBooking.people || editBooking.numberOfPeople,
  //       ),
  //       status: editBooking.status,
  //     };

  //     // Call update API
  //     const response = await updateBooking(editBooking._id, updateData);

  //     // Update local state
  //     setData((prev) =>
  //       prev.map((b) =>
  //         b._id === editBooking._id ? { ...b, ...editBooking } : b,
  //       ),
  //     );

  //     setSuccessMessage("Booking updated successfully!");
  //     setIsEditOpen(false);

  //     // Clear success message after 3 seconds
  //     setTimeout(() => setSuccessMessage(""), 3000);
  //   } catch (error) {
  //     console.error("Error updating booking:", error);
  //     setApiError(
  //       error.message || "Failed to update booking. Please try again.",
  //     );
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  /* ---------------- Table Columns ---------------- */
const columns = [
  {
    label: "Booking",
    render: (row) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <FaTicketAlt />
        </div>
        <div>
          <p className="font-black text-gray-900">{row.trekTitle}</p>
          <p className="text-[10px] uppercase font-bold text-gray-400">
            {row.trekLocation}
          </p>
        </div>
      </div>
    ),
  },
  {
    label: "Customer",
    render: (row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold text-gray-700">
          <FaUser size={12} /> {row.name}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaPhoneAlt size={10} /> {row.whatsappNumber}
        </div>
      </div>
    ),
  },
  {
    label: "Date / PAX",
    render: (row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
          <FaCalendarCheck /> {new Date(row.departureDate).toLocaleDateString()}
        </div>
        <div className="text-[10px] text-gray-400 font-bold uppercase">
          <FaUsers className="inline mr-1" /> {row.numberOfPeople} People
        </div>
      </div>
    ),
  },
  {
    label: "Status",
    render: (row) => {
      const status = row.status;
      if (status === "Confirmed") {
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 text-[10px] font-black uppercase">
            <FaCheckCircle /> Confirmed
          </span>
        );
      }
      if (status === "Pending") {
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 text-[10px] font-black uppercase">
            <FaClock /> Pending
          </span>
        );
      }
      return (
        <span className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[10px] font-black uppercase">
          <FaTimesCircle /> Cancelled
        </span>
      );
    },
  },
];

  const rowActions = [
    { label: "View Booking", icon: <FaEye />, onClick: handleView },
    { label: "Edit Booking", icon: <FaEdit />, onClick: handleEdit },
    {
      label: "Delete Booking",
      icon: <FaTrashAlt />,
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  /* ---------------- JSX ---------------- */
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-100 text-blue-600">
            <FaTicketAlt size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Manage Bookings
            </h1>
            <p className="text-gray-500 font-medium">
              Track, edit and manage trek reservations
            </p>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border-2 border-green-500 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-600 text-xl" />
              <p className="text-green-700 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaTimesCircle className="text-red-600 text-xl" />
              <p className="text-red-700 font-semibold">{apiError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-5xl text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-semibold">Loading bookings...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500">
              There are no bookings to display at the moment.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={data} rowActions={rowActions} />
        )}
      </div>

      {/* ---------------- View Modal ---------------- */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="bg-[#F7FAF9] rounded-2xl p-8">
            {/* CARD */}
            <div className="bg-white rounded-2xl border border-[#E4EFEA] p-8 space-y-8">
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow
                  label="Customer Name"
                  value={selectedBooking.name || selectedBooking.fullName}
                />
                <InfoRow label="Email" value={selectedBooking.email} />
                <InfoRow
                  label="Phone"
                  value={
                    selectedBooking.phone || selectedBooking.whatsappNumber
                  }
                />
                <InfoRow label="Booking ID" value={selectedBooking._id} />
                <InfoRow
                  label="Trek"
                  value={selectedBooking.trek || "Trek Adventure"}
                />
                <InfoRow
                  label="Departure Date"
                  value={selectedBooking.date || selectedBooking.departureDate}
                />
                <InfoRow label="Trek" value={selectedBooking.trekTitle} />
<InfoRow label="Departure Date" value={new Date(selectedBooking.departureDate).toLocaleDateString()} />
<InfoRow label="People" value={`${selectedBooking.numberOfPeople} PAX`} />
<InfoRow label="Status" value={selectedBooking.status} />
                <InfoRow
                  label="People"
                  value={`${selectedBooking.people || selectedBooking.numberOfPeople} PAX`}
                />
                <InfoRow
                  label="Blood Group"
                  value={selectedBooking.bloodGroup || "N/A"}
                />
                <InfoRow
                  label="Pickup Point"
                  value={selectedBooking.pickupPoint || "N/A"}
                />
                <InfoRow
                  label="Emergency Number"
                  value={selectedBooking.emergencyNumber || "N/A"}
                />

                <div
                  className="flex items-center justify-between bg-[#F7FAF9]
              border border-[#E4EFEA] rounded-xl px-5 py-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6B8B82]">
                      Status
                    </p>
                    <p className="text-lg font-semibold text-[#1F2D2A]">
                      {selectedBooking.status || "Pending"}
                    </p>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-[#8FB8A8]" />
                </div>

                {selectedBooking.needCoupleTent && (
                  <InfoRow label="Couple Tent" value="Yes" />
                )}
                {selectedBooking.needPrivateRoom && (
                  <InfoRow label="Private Room" value="Yes" />
                )}
              </div>

              {/* Medical History */}
              {selectedBooking.medicalHistory && (
                <div className="bg-[#F7FAF9] border border-[#E4EFEA] rounded-xl px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-[#6B8B82] mb-2">
                    Medical History
                  </p>
                  <p className="text-sm text-[#1F2D2A]">
                    {selectedBooking.medicalHistory}
                  </p>
                </div>
              )}

              {/* Additional Members */}
              {selectedBooking.additionalMembers &&
                selectedBooking.additionalMembers.length > 0 && (
                  <div className="bg-[#F7FAF9] border border-[#E4EFEA] rounded-xl px-5 py-4">
                    <p className="text-xs uppercase tracking-widest text-[#6B8B82] mb-3">
                      Additional Members
                    </p>
                    <div className="space-y-2">
                     {selectedBooking.additionalMembers?.map((member, idx) => (
  <div key={idx} className="flex items-center gap-3 text-sm">
    <FaUser className="text-gray-400" />
    <span className="font-semibold text-[#1F2D2A]">{member.name}</span>
    <span className="text-gray-500">•</span>
    <span className="text-gray-600">{member.whatsappNumber}</span>
  </div>
))}
                    </div>
                  </div>
                )}

              {/* ACTION */}
              <div className="flex justify-end pt-6 border-t border-[#E4EFEA]">
                <button
                  onClick={() => {
                    setIsViewOpen(false);
                    handleEdit(selectedBooking);
                  }}
                  className="
                px-8 py-3 rounded-xl font-medium
                bg-[#1F2D2A] text-white
                hover:bg-[#172421]
                transition
              "
                >
                  Edit Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------------- Edit Modal ---------------- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Booking"
        size="lg"
      >
        {editBooking && (
          <form
            onSubmit={handleUpdateBooking}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditField
                label="Customer Name"
                value={editBooking.name || editBooking.fullName}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, name: e.target.value })
                }
              />
              <EditField
                label="Phone"
                value={editBooking.phone || editBooking.whatsappNumber}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, phone: e.target.value })
                }
              />
              <EditField
                label="Email"
                value={editBooking.email}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, email: e.target.value })
                }
              />
              <EditField label="Departure Date" type="date" value={new Date(editBooking.departureDate).toISOString().slice(0, 10)} onChange={(e) =>
  setEditBooking({ ...editBooking, departureDate: e.target.value })
} />
<EditField label="No. of People" type="number" value={editBooking.numberOfPeople} onChange={(e) =>
  setEditBooking({ ...editBooking, numberOfPeople: parseInt(e.target.value) })
} />


              <div>
                <label className="text-[10px] uppercase font-black text-gray-400">
                  Booking Status
                </label>
                <select
                  value={editBooking.status || "Pending"}
                  onChange={(e) =>
                    setEditBooking({
                      ...editBooking,
                      status: e.target.value,
                    })
                  }
                  disabled={isUpdating}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
                className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

const EditField = ({ label, type = "text", ...props }) => (
  <div>
    <label className="text-[10px] uppercase font-black text-gray-400">
      {label}
    </label>
    <input
      type={type}
      {...props}
      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="bg-[#F7FAF9] border border-[#E4EFEA] rounded-xl px-5 py-4">
    <p className="text-xs uppercase tracking-widest text-[#6B8B82] mb-1">
      {label}
    </p>
    <p className="text-lg font-semibold text-[#1F2D2A]">{value}</p>
  </div>
);
