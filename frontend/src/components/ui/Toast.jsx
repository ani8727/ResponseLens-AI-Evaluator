import React, { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "info",
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (!message) return;
    const t = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!visible) return null;

  const bgClass =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-white border-gray-200 dark:bg-gray-800";
  const textClass =
    type === "error"
      ? "text-red-800"
      : type === "success"
        ? "text-green-800"
        : "text-gray-800 dark:text-gray-100";

  return (
    <div className="z-50">
      <div
        className={`max-w-sm w-full ${bgClass} border rounded-md shadow-lg p-3 transform transition duration-300 ease-out`}
        style={{
          willChange: "transform, opacity",
        }}
      >
        <div className={`flex items-start gap-3`}>
          <div className={`flex-1 text-sm ${textClass}`}>{message}</div>
          <button
            onClick={() => {
              setVisible(false);
              onClose && onClose();
            }}
            className="text-gray-400 hover:text-gray-600 ml-2"
            aria-label="Close Toast"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
