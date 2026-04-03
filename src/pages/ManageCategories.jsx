import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../api/trekCategoriesApi";
import DataTable from "../components/table/DataTable";
import Modal from "../components/modal/Modal";
import {
  FaLayerGroup,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaEye,
  FaTrashAlt,
  FaInfoCircle,
  FaImage,
} from "react-icons/fa";
import { usePermissions } from "../components/hooks/usePermissions";

export default function ManageCategories() {
  const navigate = useNavigate();

  // const { hasPermission } = usePermissions();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setData(res || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate(`/categories/edit/${row._id}`);
  };

  const handleView = (row) => {
    setSelectedCategory(row);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete category "${row.title}"?`,
      )
    ) {
      try {
        setLoading(true);
        await deleteCategory(row._id);
        alert("Category deleted successfully");
        fetchCategories(); // Refresh data
      } catch (err) {
        console.error("Delete error:", err);
        alert(`Error deleting category: ${err.message || err}`);
        setLoading(false);
      }
    }
  };

  const getImageSrc = (catImage) => {
    if (!catImage) return null;
    if (typeof catImage === "string") return catImage;
    if (typeof catImage === "object") {
      return catImage.cdnUrl || null;
    }
    return null;
  };

  const rowActions = [
    // View is always visible (read permission)
    // hasPermission("trekCategory", "read") &&
    {
      label: "View Details",
      icon: <FaEye />,
      onClick: handleView,
    },
    // hasPermission("trekCategory", "update") &&
    {
      label: "Edit Category",
      icon: <FaEdit />,
      onClick: handleEdit,
    },
    // hasPermission("trekCategory", "delete") &&
    {
      label: "Delete",
      icon: <FaTrashAlt />,
      onClick: handleDelete,
      variant: "danger",
    },
  ]; //

  const columns = [
    {
      label: "Category Info",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border-2 border-blue-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
            {getImageSrc(row.catImage) ? (
              <img
                src={getImageSrc(row.catImage)}
                alt={row.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaImage className="text-blue-200 text-xl" />
            )}
          </div>
          <div>
            <div className="font-black text-gray-900 leading-tight">
              {row.title}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
              ID: {row.categoryId}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Description",
      render: (row) => (
        <div className="max-w-[250px] truncate text-xs text-gray-500 font-medium">
          {row.description}
        </div>
      ),
    },
    {
      label: "Tag / Difficulty",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {row.tag || "No Tag"}
          </span>
          <span className="text-[10px] font-bold text-gray-400">
            {row.difficulty || "Standard"}
          </span>
        </div>
      ),
    },
    {
      label: "Trek Count",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100">
            {row.trekCount} Treks
          </span>
        </div>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isActive ? (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <FaCheckCircle size={10} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
              <FaTimesCircle size={10} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Inactive
              </span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FaLayerGroup />
              </div>
              Manage Categories
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Organize your treks into meaningful collections
            </p>
          </div>
          <Link
            to="/categories/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 w-fit"
          >
            <FaPlus /> Create New Category
          </Link>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <FaTimesCircle />
            {error}
            <button onClick={fetchCategories} className="ml-auto underline">
              Try Again
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowActions={rowActions}
        />
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Category Overview"
        size="md"
      >
        {selectedCategory && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                {getImageSrc(selectedCategory.catImage) ? (
                  <img
                    src={getImageSrc(selectedCategory.catImage)}
                    alt={selectedCategory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200">
                    <FaImage size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase">
                    {selectedCategory.difficulty}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase">
                    Tag: {selectedCategory.tag || "N/A"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory.title}
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  ID:{" "}
                  <span className="text-gray-900 font-bold">
                    {selectedCategory.categoryId}
                  </span>
                </p>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 inline-block">
                  <span className="text-xs font-black text-blue-700 uppercase">
                    {selectedCategory.trekCount} Total Treks Linked
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" /> Description
              </h4>
              <div className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedCategory.description ||
                  "No description provided for this category."}
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedCategory)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
              >
                <FaEdit size={14} /> Edit Category
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
