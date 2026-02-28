import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Reusable Premium Modal Component (Standard & Attractive).
 * @param {Boolean} isOpen - Whether the modal is visible.
 * @param {Function} onClose - Function to close the modal.
 * @param {String} title - Modal heading.
 * @param {ReactNode} children - Modal content.
 * @param {String} size - Modal width (sm, md, lg, xl).
 */
export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative w-full ${sizeClasses[size]} mx-auto transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95`}>
                <div className="relative flex flex-col w-full bg-white border border-gray-100 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                            {title}
                        </h3>
                        <button
                            className="p-1.5 ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all rounded-lg"
                            onClick={onClose}
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-6 flex-auto max-h-[80vh] overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
