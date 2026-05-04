import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-40 left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transform lg:translate-x-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        <div className="p-4">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              onClick={onClose}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              History
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Profile
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
