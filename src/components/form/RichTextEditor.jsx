import React, { useRef, useEffect } from "react";
import {
    HiOutlineBold,
    HiOutlineItalic,
    HiOutlineListBullet,
    HiOutlineQueueList,
    HiOutlineLink
} from "react-icons/hi2";

const RichTextEditor = ({ value, onChange, label }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
            // Only sync from outside if the editor is NOT currently focused
            // (i.e., the user is not actively typing). This avoids resetting
            // cursor position mid-edit while still prefilling on load/fetch.
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value]);

    const executeCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const addLink = () => {
        const url = prompt("Enter the URL:");
        if (url) executeCommand("createLink", url);
    };

    return (
        <div className="flex flex-col w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                <button
                    type="button"
                    onClick={() => executeCommand("bold")}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-gray-600 transition-colors"
                    title="Bold"
                >
                    <HiOutlineBold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand("italic")}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-gray-600 transition-colors"
                    title="Italic"
                >
                    <HiOutlineItalic size={18} />
                </button>
                <div className="w-[1px] h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => executeCommand("insertUnorderedList")}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-gray-600 transition-colors"
                    title="Bullet List"
                >
                    <HiOutlineListBullet size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand("insertOrderedList")}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-gray-600 transition-colors"
                    title="Numbered List"
                >
                    <HiOutlineQueueList size={18} />
                </button>
                <button
                    type="button"
                    onClick={addLink}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-gray-600 transition-colors"
                    title="Add Link"
                >
                    <HiOutlineLink size={18} />
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[200px] p-4 focus:outline-none text-gray-700 leading-relaxed prose max-w-none"
                placeholder="Enter description here..."
            />
        </div>
    );
};

export default RichTextEditor;
