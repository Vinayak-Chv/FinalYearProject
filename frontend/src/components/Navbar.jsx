import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiLogOut, FiGrid } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from "react";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img src={Logo} className="w-8 h-8 rounded-full" alt="Logo" />
            <span className="text-xl font-bold text-white cursor-pointer">
              <NavLink to="/">Thread & Trend</NavLink>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-4">
            <NavLink to="/" className="text-white hover:text-accent text-base">Home</NavLink>
            <NavLink to="/collection" className="text-white hover:text-accent text-base">Collection</NavLink>
            <NavLink to="/about" className="text-white hover:text-accent text-base">About</NavLink>
            <NavLink to="/contact" className="text-white hover:text-accent text-base">Contact</NavLink>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Cart Icon */}
                <Link to="/cart" className="relative">
                  <FiShoppingCart className="text-white text-2xl hover:text-accent transition" />
                </Link>

                {/* User Avatar with Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
                      />
                    ) : (
                      <FaRegUserCircle className="text-white text-3xl hover:text-accent transition cursor-pointer" />
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <FiGrid className="text-base" /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeDropdown();
                        }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="text-base" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 text-white border-2 border-white/30 rounded-lg hover:bg-white font-semibold hover:text-primary transition-all hover:scale-105 text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-1.5 bg-accent text-primary-dark rounded-lg hover:bg-accent font-semibold hover:text-black transition-all hover:scale-105 text-sm"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;