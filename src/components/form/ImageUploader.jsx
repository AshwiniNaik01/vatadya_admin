// import React, { useState } from "react";
// import imageCompression from "browser-image-compression";
// import { HiOutlineCloudArrowUp, HiXMark, HiPhoto } from "react-icons/hi2";

// const ImageUploader = ({ label, value, onChange, isMultiple = false, maxFiles = 5 }) => {
//     const [compressing, setCompressing] = useState(false);

//     const handleFileChange = async (e) => {
//         const files = Array.from(e.target.files);
//         if (!files.length) return;

//         setCompressing(true);

//         const options = {
//             maxSizeMB: 1,
//             maxWidthOrHeight: 1200,
//             useWebWorker: true,
//         };

//         try {
//             const compressedFiles = await Promise.all(
//                 files.map(async (file) => {
//                     const compressed = await imageCompression(file, options);
//                     return await imageCompression.getDataUrlFromFile(compressed);
//                 })
//             );

//             if (isMultiple) {
//                 onChange([...(value || []), ...compressedFiles].slice(0, maxFiles));
//             } else {
//                 onChange(compressedFiles[0]);
//             }
//         } catch (error) {
//             console.error("Compression failed:", error);
//         } finally {
//             setCompressing(false);
//         }
//     };

//     const removeImage = (indexToRemove) => {
//         if (isMultiple) {
//             onChange(value.filter((_, index) => index !== indexToRemove));
//         } else {
//             onChange("");
//         }
//     };

//     const displayFiles = isMultiple ? (value || []) : (value ? [value] : []);

//     return (
//         <div className="w-full space-y-1.5">
//             {label && <label className="block text-sm font-bold text-gray-700 ml-1">{label}</label>}

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {displayFiles.map((src, index) => (
//                     <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md animate-in zoom-in duration-300">
//                         <img src={src} alt="Preview" className="w-full h-full object-cover" />
//                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                             <button
//                                 type="button"
//                                 onClick={() => removeImage(index)}
//                                 className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
//                             >
//                                 <HiXMark size={20} />
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//                 {(isMultiple ? displayFiles.length < maxFiles : displayFiles.length === 0) && (
//                     <label className={`relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group px-4 text-center ${compressing ? 'opacity-50 pointer-events-none' : ''}`}>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             multiple={isMultiple}
//                             className="sr-only"
//                             onChange={handleFileChange}
//                         />
//                         {compressing ? (
//                             <div className="flex flex-col items-center gap-2">
//                                 <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//                                 <span className="text-xs font-bold text-emerald-600">Compressing...</span>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 mb-2 transition-colors">
//                                     <HiOutlineCloudArrowUp size={24} className="text-gray-400 group-hover:text-emerald-600" />
//                                 </div>
//                                 <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
//                                     {isMultiple ? "Upload Trek Gallery" : "Main Image"}
//                                 </span>
//                                 <span className="text-[10px] text-gray-400 font-medium mt-1">
//                                     JPG, PNG up to 1MB
//                                 </span>
//                             </>
//                         )}
//                     </label>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ImageUploader;

import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { HiOutlineCloudArrowUp, HiXMark, HiPhoto, HiArrowPath, HiCheckCircle } from "react-icons/hi2";

const ImageUploader = ({ label, value, onChange, isMultiple = false, maxFiles = 5 }) => {
    const [compressing, setCompressing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [previewIndex, setPreviewIndex] = useState(null);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setCompressing(true);
        setIsDragging(false);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            onProgress: (progress) => {
                setUploadProgress(prev => ({
                    ...prev,
                    [files[0].name]: progress
                }));
            }
        };

        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const compressed = await imageCompression(file, options);
                    const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: 100
                    }));
                    return dataUrl;
                })
            );

            if (isMultiple) {
                onChange([...(value || []), ...compressedFiles].slice(0, maxFiles));
            } else {
                onChange(compressedFiles[0]);
            }
        } catch (error) {
            console.error("Compression failed:", error);
        } finally {
            setCompressing(false);
            setUploadProgress({});
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
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = isMultiple;
            input.accept = 'image/*';
            input.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const removeImage = (indexToRemove) => {
        if (isMultiple) {
            onChange(value.filter((_, index) => index !== indexToRemove));
        } else {
            onChange("");
        }
        setPreviewIndex(null);
    };

    const displayFiles = isMultiple ? (value || []) : (value ? [value] : []);

    return (
        <div className="w-full space-y-4">
            {/* Header with label and count */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    {label && (
                        <label className="block text-lg font-bold text-gray-800">
                            {label}
                        </label>
                    )}
                    <p className="text-sm text-gray-500">
                        {isMultiple
                            ? `Upload up to ${maxFiles} images (1MB each)`
                            : "Upload a single image (1MB max)"
                        }
                    </p>
                </div>
                {isMultiple && displayFiles.length > 0 && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
                        <HiCheckCircle className="text-green-500" size={16} />
                        <span className="text-sm font-semibold text-gray-700">
                            {displayFiles.length} / {maxFiles}
                        </span>
                    </div>
                )}
            </div>

            {/* Main Upload Area */}
            <div
                className={`relative rounded-2xl border-3 border-dashed transition-all duration-300 ${isDragging
                    ? 'border-purple-500 bg-purple-50 scale-[1.02] shadow-lg'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    } ${compressing ? 'opacity-60' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Upload Zone */}
                <div className="p-6 md:p-8">
                    {(displayFiles.length === 0 || (isMultiple && displayFiles.length < maxFiles)) && (
                        <label className={`flex flex-col items-center justify-center cursor-pointer transition-all ${compressing ? 'pointer-events-none' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple={isMultiple}
                                className="sr-only"
                                onChange={handleFileChange}
                            />

                            {compressing ? (
                                <div className="space-y-6 text-center">
                                    {/* Animated Progress Ring */}
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                                            style={{ animationDuration: '1.5s' }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <HiArrowPath className="text-blue-500 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-bold text-lg text-gray-700">Optimizing Images...</p>
                                        <p className="text-sm text-gray-500">Reducing file size while preserving quality</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 text-center">
                                    {/* Icon Container with Floating Effect */}
                                    <div className="relative">
                                        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 hover:scale-105">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                                <HiOutlineCloudArrowUp className="relative text-blue-600" size={48} />
                                            </div>
                                        </div>

                                        {/* Floating Icons */}
                                        <div className="absolute -top-2 -left-2 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float-slow">
                                            <HiPhoto className="text-purple-500" size={20} />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float-slow-delay">
                                            <span className="text-lg">📷</span>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {isMultiple ? "Drag & Drop Multiple Images" : "Click to Upload Image"}
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto">
                                            {isMultiple
                                                ? `Upload up to ${maxFiles} images at once or click to browse`
                                                : "Select a single high-quality image for better results"
                                            }
                                        </p>

                                    </div>


                                </div>
                            )}
                        </label>
                    )}
                </div>

                {/* Drag & Drop Hint */}
                {!compressing && (displayFiles.length === 0 || (isMultiple && displayFiles.length < maxFiles)) && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <p className="text-sm text-gray-400 animate-pulse">
                            ↓ Drag & drop images here ↓
                        </p>
                    </div>
                )}
            </div>

            {/* Image Gallery Preview */}
            {displayFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-700">
                            Uploaded Images ({displayFiles.length})
                        </h4>
                        {displayFiles.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isMultiple) onChange([]);
                                    else onChange("");
                                }}
                                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <HiXMark size={16} />
                                Remove All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {displayFiles.map((src, index) => (
                            <div
                                key={index}
                                className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${previewIndex === index
                                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                onMouseEnter={() => setPreviewIndex(index)}
                                onMouseLeave={() => setPreviewIndex(null)}
                            >
                                {/* Progress Bar for Uploading Images */}
                                {Object.values(uploadProgress).length > 0 && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                                            style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                        />
                                    </div>
                                )}

                                {/* Image */}
                                <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <span className="text-xs font-medium text-white bg-black/40 px-2 py-1 rounded">
                                            Image {index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:scale-110 transition-all"
                                        >
                                            <HiXMark size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Top Badge */}
                                {index === 0 && !isMultiple && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg">
                                        MAIN
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Empty Slot Indicators */}
                        {isMultiple && displayFiles.length < maxFiles && (
                            Array.from({ length: maxFiles - displayFiles.length }).map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all group/empty"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2 group-hover/empty:bg-gray-200">
                                        <span className="text-2xl">+</span>
                                    </div>
                                    <span className="text-xs font-medium">Empty Slot</span>
                                </div>
                            ))
                        )}
                    </div>


                </div>
            )}
        </div>
    );
};

export default ImageUploader;