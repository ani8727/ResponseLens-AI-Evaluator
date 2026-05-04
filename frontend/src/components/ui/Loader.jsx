import React from "react";

export default function Loader({ size = 6, className = "" }) {
  const s = `${size}rem`;
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden
    >
      <div
        className="animate-spin rounded-full border-4 border-primary-600 border-r-transparent"
        style={{ width: s, height: s }}
        aria-label="Loading"
      />
    </div>
  );
}
