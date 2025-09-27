import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import assets from "../assets/2bf33566-d328-4082-b550-1c0fb107ed9c.webp";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    loadUser();
    window.addEventListener("userChanged", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-5 py-2 mx-[25px] my-[10px] shadow-md border border-gray-300 rounded-full bg-white text-gray-700">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={assets} alt="PlugnGo Logo" className="w-8 h-8 inline-block align-middle" />
        <span className="font-bold text-lg text-gray-900 inline-block align-middle -ml-1">
          Plug&Go
        </span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-5 text-sm font-medium">
        {["Home", "Doc", "Location", "About", "Contact"].map((item, index) => (
          <li key={index}>
            <Link
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="relative hover:text-gray-900 transition-colors duration-300 
                after:content-[''] after:block after:w-0 after:h-[1.5px] after:bg-gray-900 
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3 mr-3 relative">
{user ? (
  <div className="relative">
    {/* Avatar Button */}
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 border border-gray-400"
    >
      <div className="w-6 h-6 bg-gray-400 rounded-full relative">
        {/* Head */}
        <div className="w-3 h-3 bg-gray-700 rounded-full absolute top-0 left-1.5"></div>
        {/* Body */}
        <div className="w-4 h-2 bg-gray-700 rounded-b-full absolute bottom-0 left-1"></div>
      </div>
    </button>

    {/* Dropdown */}
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 z-20">
        <div className="font-medium text-gray-900 mb-2 text-center">{user.name}</div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 hover:underline text-sm"
        >
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <Link
    to="/login"
    className="px-4 py-1.5 rounded-full text-sm font-medium shadow 
      hover:shadow-lg hover:scale-105 transition-all duration-300 border 
      bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-600"
  >
    Get Started
  </Link>
)}


        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-1.5 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-16 left-0 w-full flex flex-col items-center gap-3 py-4 shadow-lg border-t border-gray-200 md:hidden bg-white text-gray-700">
          {["Home", "Price", "Product", "About", "Contact"].map((item, index) => (
            <li key={index}>
              <Link
                to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                className="hover:underline text-sm"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
