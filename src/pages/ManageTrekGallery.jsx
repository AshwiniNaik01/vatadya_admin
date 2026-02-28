import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiImage,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiUpload,
} from "react-icons/fi";
import TrekGalleryForm from "./TrekGalleryForm";
import Modal from "../components/modal/Modal";
import {
  getAllGallery,
  deleteGalleryItem,
  updateGallery,
} from "../api/galleryApi";

export default function ManageTrekGallery() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch gallery items on component mount
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await getAllGallery();
      setData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
      alert("Failed to load gallery items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleEdit = (item) => {
    console.log("handleEdit - item:", item);

    // Pass the complete item data to the form
    const itemToEdit = {
      ...item,
      // Ensure we have the ID
      id: item._id || item.id,
    };

    console.log("handleEdit - itemToEdit:", itemToEdit);

    setSelectedItem(itemToEdit);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    try {
      // Call delete API with the item's ID
      await deleteGalleryItem(item._id || item.id);

      // Refresh the gallery after successful deletion
      await fetchGallery();

      alert("Gallery item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      alert("Failed to delete gallery item. Please try again.");
    }
  };

  const toggleActive = async (item) => {
    try {
      // Create FormData to update the isActive status
      const formData = new FormData();
      formData.append("isActive", !item.isActive);

      // Update via API
      await updateGallery(item._id || item.id, formData);

      // Update local state optimistically
      setData((prev) =>
        prev.map((g) =>
          g._id === item._id || g.id === item.id
            ? { ...g, isActive: !g.isActive }
            : g,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle active status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleFormSubmit = async () => {
    // Refresh gallery after form submission
    await fetchGallery();
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
            <FiImage className="text-emerald-500 bg-emerald-100 p-2 rounded-2xl" />
            Trek Gallery
          </h1>
          <p className="text-gray-500 mt-1">
            View, edit, and manage your trek photos
          </p>
        </div>
        <button
          onClick={() => navigate("/gallery/create")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 mt-4 md:mt-0"
        >
          <FiUpload /> Add New Photo
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <FiImage className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Gallery Items
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first trek photo
          </p>
          <button
            onClick={() => navigate("/gallery/create")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2"
          >
            <FiUpload /> Add New Photo
          </button>
        </div>
      ) : (
        /* Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="relative">
                {item.photo?.cdnUrl || item.photo ? (
                  <img
                    src={item.photo?.cdnUrl || item.photo}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                    onClick={() => handleView(item)}
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                    <FiImage />
                  </div>
                )}
                <button
                  onClick={() => toggleActive(item)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white border shadow hover:bg-gray-100 transition"
                >
                  {item.isActive ? (
                    <FiCheckCircle className="text-green-500" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-black text-gray-900 text-lg truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.month} {item.year} • {item.experience}
                </p>
                <p className="text-sm text-gray-500">Season: {item.season}</p>
                <p className="text-sm text-gray-500">Region: {item.region}</p>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm flex items-center gap-1"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for View / Edit */}
      {isModalOpen && (
        <Modal
          key={selectedItem?._id || selectedItem?.id || "new"}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={isEditMode ? "Edit Gallery Item" : "View Photo"}
          size="lg"
        >
          {isEditMode ? (
            <TrekGalleryForm
              key={`form-${selectedItem?._id || selectedItem?.id || "new"}`}
              onSubmit={handleFormSubmit}
              initialData={selectedItem}
              isEditMode={true}
            />
          ) : selectedItem ? (
            <div className="space-y-6">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-100">
                {selectedItem.imageUrl || selectedItem.photo?.cdnUrl ? (
                  <img
                    src={selectedItem.imageUrl || selectedItem.photo?.cdnUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <FiImage size={64} />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900">
                  {selectedItem.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedItem.month} {selectedItem.year} •{" "}
                  {selectedItem.experience}
                </p>
                <p className="text-sm text-gray-500">
                  Season: {selectedItem.season}
                </p>
                <p className="text-sm text-gray-500">
                  Region: {selectedItem.region}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {selectedItem.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
}
