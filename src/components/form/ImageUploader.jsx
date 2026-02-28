import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import {
    HiOutlineCloudArrowUp,
    HiXMark,
    HiArrowPath,
    HiCheckCircle,
} from "react-icons/hi2";

const ImageUploader = ({
    label,
    value,
    onChange,
    isMultiple = false,
    maxFiles = 5,
}) => {
    const [compressing, setCompressing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Normalize display files — each item can be a File object OR a string URL (existing)
    const displayFiles = isMultiple
        ? value || []
        : value
            ? [value]
            : [];

    // Helper: get a displayable src from a File or a URL string
    const getPreviewSrc = (file) => {
        if (!file) return "";
        if (typeof file === "string") return file;          // existing CDN URL
        if (file instanceof File || file instanceof Blob)   // new upload
            return URL.createObjectURL(file);
        return "";
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setCompressing(true);
        setIsDragging(false);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };

        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const compressed = await imageCompression(file, options);

                    // Preserve original filename
                    return new File([compressed], file.name, {
                        type: compressed.type,
                    });
                })
            );

            if (isMultiple) {
                const updatedFiles = [...(value || []), ...compressedFiles].slice(
                    0,
                    maxFiles
                );
                onChange(updatedFiles); // ✅ Send pure File[]
            } else {
                onChange(compressedFiles[0]); // ✅ Send single File
            }
        } catch (error) {
            console.error("Compression failed:", error);
        } finally {
            setCompressing(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const removeImage = (indexToRemove) => {
        if (isMultiple) {
            onChange(value.filter((_, index) => index !== indexToRemove));
        } else {
            onChange(null);
        }
    };

    const removeAll = () => {
        if (isMultiple) {
            onChange([]);
        } else {
            onChange(null);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    {label && (
                        <label className="block text-lg font-bold text-gray-800">
                            {label}
                        </label>
                    )}
                    <p className="text-sm text-gray-500">
                        {isMultiple
                            ? `Upload up to ${maxFiles} images (1MB each)`
                            : "Upload a single image (1MB max)"}
                    </p>
                </div>

                {isMultiple && displayFiles.length > 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <HiCheckCircle className="text-green-500" size={16} />
                        <span className="text-sm font-semibold text-gray-700">
                            {displayFiles.length} / {maxFiles}
                        </span>
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    } ${compressing ? "opacity-60" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="p-6 md:p-8">
                    {(displayFiles.length === 0 ||
                        (isMultiple && displayFiles.length < maxFiles)) && (
                            <label
                                className={`flex flex-col items-center justify-center cursor-pointer ${compressing ? "pointer-events-none" : ""
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple={isMultiple}
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />

                                {compressing ? (
                                    <div className="text-center space-y-4">
                                        <div className="relative w-20 h-20 mx-auto">
                                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <HiArrowPath className="text-blue-500 animate-pulse" size={28} />
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-700">
                                            Optimizing Images...
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-md">
                                            <HiOutlineCloudArrowUp
                                                className="text-blue-600"
                                                size={40}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {isMultiple
                                                    ? "Drag & Drop Images"
                                                    : "Click to Upload Image"}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {isMultiple
                                                    ? `Upload up to ${maxFiles} images`
                                                    : "Select a high-quality image"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        )}
                </div>
            </div>

            {/* Preview Section */}
            {displayFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-700">
                            Uploaded Images ({displayFiles.length})
                        </h4>

                        <button
                            type="button"
                            onClick={removeAll}
                            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <HiXMark size={16} />
                            Remove All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {displayFiles.map((file, index) => (
                            <div
                                key={index}
                                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all"
                            >
                                <img
                                    src={getPreviewSrc(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                    >
                                        <HiXMark size={16} />
                                    </button>
                                </div>

                                {index === 0 && !isMultiple && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                                        MAIN
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;