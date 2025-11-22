import React from "react";

export default function Modal({ open, onClose, darkMode, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          w-full max-w-lg p-6 rounded-2xl shadow-xl
          transition-colors duration-300
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
