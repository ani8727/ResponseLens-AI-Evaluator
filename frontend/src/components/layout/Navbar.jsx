import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onOpenSidebar}
              className="mr-3 inline-flex items-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <Link
              to="/"
              className="text-lg font-semibold text-gray-800 dark:text-white"
            >
              ResponseLens
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {user?.name || ""}
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
