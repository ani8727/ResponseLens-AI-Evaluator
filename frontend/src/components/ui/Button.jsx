import React from "react";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-300",
  secondary:
    "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
  outline:
    "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition duration-200 ease-in-out transform ${
        variantClass
      } ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
}
