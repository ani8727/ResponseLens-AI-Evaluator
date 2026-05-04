import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 ${className} card-hover-up`}
    >
      {children}
    </div>
  );
}
