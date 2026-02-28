import { useState, useEffect } from "react";
import {
  FaImages,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaExpand,
} from "react-icons/fa";
import ImageUploader from "../components/form/ImageUploader";
import {
  addGallery,
  getAllGallery,
  deleteGalleryItem,
} from "../api/galleryApi";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch all gallery images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await getAllGallery();
      setImages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      // You might want to show a toast/notification here
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images to upload");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      // Append all selected files to FormData
      selectedFiles.forEach((file) => {
        formData.append("TrekGalleryImage", file);
      });

      const response = await addGallery(formData);

      // Refresh the gallery after successful upload
      await fetchGalleryImages();

      // Clear selected files
      setSelectedFiles([]);

      // You might want to show a success toast/notification here
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (galleryId, itemId) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await deleteGalleryItem(galleryId, itemId);

      // Refresh the gallery after successful deletion
      await fetchGalleryImages();

      // You might want to show a success toast/notification here
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <FaImages />
            </div>
            Media Gallery
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage expedition photos and visual content
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="bulk-upload-input"
          />
          <label
            htmlFor="bulk-upload-input"
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-700 transition shadow-lg cursor-pointer"
          >
            <FaPlus /> Select Images
          </label>
          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCloudUploadAlt />
              {uploading ? "Uploading..." : `Upload (${selectedFiles.length})`}
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Upload Card */}
          <label
            htmlFor="bulk-upload-input"
            className="aspect-square rounded-3xl border-2 border-dashed border-emerald-100 bg-emerald-50/30 flex flex-col items-center justify-center gap-3 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
              <FaPlus />
            </div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
              Add Media
            </span>
          </label>

          {/* Existing Images */}
          {images.map((item) => (
            <div
              key={item._id}
              className="group aspect-square rounded-[2rem] overflow-hidden relative border border-gray-100 shadow-lg animate-in zoom-in duration-300"
            >
              <img
                src={item.photo.cdnUrl}
                alt="Gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-2xl transition-all"
                  title="View Full"
                  onClick={() =>
                    window.open(item.imageUrl || item.url, "_blank")
                  }
                >
                  <FaExpand />
                </button>
                <button
                  onClick={() =>
                    removeImage(item.galleryId || item._id, item._id)
                  }
                  className="p-3 bg-rose-500/20 hover:bg-rose-500/40 backdrop-blur-md text-white rounded-2xl transition-all"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              <FaImages className="mx-auto text-6xl mb-4 opacity-20" />
              <p className="text-lg font-semibold">No images yet</p>
              <p className="text-sm">Upload your first image to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
