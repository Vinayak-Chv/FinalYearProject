import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  return (
    <div>
      {/* Left Side */}
      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>{" "}
              <span className="text-xl font-bold text-primary cursor-pointer">
                Thread & Trend
              </span>
            </div>

            {/* 2️⃣ NAVIGATION */}
            <nav className="hidden md:flex gap-6">
              <a
                href="/"
                className="text-gray-600 hover:text-primary transition"
              >
                Home
              </a>
              <a
                href="/collection"
                className="text-gray-600 hover:text-primary transition"
              >
                Collection
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-primary transition"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-primary transition"
              >
                Contact
              </a>
            </nav>

            {/* 3️⃣ AUTH BUTTONS */}
            <div className="flex gap-3">
              <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition">
                Login
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                Register
              </button>
            </div>

            {/* Mobile menu button (optional) */}
            <button className="md:hidden text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
