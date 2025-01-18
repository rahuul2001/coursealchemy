import { useState, useEffect } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed && parsed.username) {
        setUsername(parsed.username);
      }
    }
  }, []);

  return (
    <header className="fixed z-50 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between flex-nowrap py-4 px-6">
        {/* Logo */}
        <div className="text-3xl font-bold font-poppins tracking-wide cursor-pointer hover:opacity-90 transition-opacity">
          CourseAlchemy
        </div>

        {/* Hamburger Button (visible below md) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>

        {/* Desktop Navigation (hidden below md) */}
        <nav className="hidden md:flex space-x-8 text-base font-medium">
          <Link
            to="/dashboard"
            className="hover:underline transition duration-200 ease-in-out"
          >
            Dashboard
          </Link>
          <Link
            to="/create-course"
            className="hover:underline transition duration-200 ease-in-out"
          >
            Create Course
          </Link>
          
        </nav>

        {/* Right Section (hidden below md) */}
        <div className="flex items-center space-x-6">
          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <span className="block font-medium">
                {username ? username : "My Profile"}
              </span>
            </button>
            {/* Hover‐based dropdown for desktop */}
            <div className="absolute right-0 mt-0 w-48 bg-white text-gray-800 rounded-lg shadow-lg hidden group-hover:block">
              
              <Link
                to="/logout"
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200 ease-in-out"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.href = "/signin";
                }}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav - always present, but hidden with classes when menuOpen = false */}
      <nav
        className={`
          md:hidden
          absolute top-[72px] right-0 mt-2 w-48 
          bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white
          rounded-lg shadow-lg z-50
          transform transition-all duration-300 ease-in-out
          ${
            menuOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 hover:bg-purple-700 transition duration-200 ease-in-out"
        >
          <FaHome className="mr-2" /> Dashboard
        </Link>
        <Link
          to="/create-course"
          className="flex items-center px-4 py-2 hover:bg-purple-700 transition duration-200 ease-in-out"
        >
          <FaPlus className="mr-2" /> Create Course
        </Link>
      </nav>
    </header>
  );
}

export default Header;
