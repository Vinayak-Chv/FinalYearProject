import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  return (
    <div>
      {/* Left Side */}
      <header className="bg-primary shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center gap-2">
              <img src={Logo} className="w-8 h-8 rounded-full"></img>
              <span className="text-xl font-bold text-white cursor-pointer">
                <NavLink to="/">Thread & Trend</NavLink>
              </span>
            </div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex gap-6">
              <NavLink to="/" className="navLinks">
                Home
              </NavLink>
              <NavLink to="/collection" className="navLinks">
                Collection
              </NavLink>
              <NavLink to="/about" className="navLinks">
                About
              </NavLink>
              <NavLink to="/contact" className="navLinks">
                Contact
              </NavLink>
            </nav>

            {/* AUTH BUTTONS */}
            <div className="flex gap-3">
              <button className="px-4 py-2 text-white border-2 border-white/30 rounded-lg hover:bg-white font-semibold hover:text-primary transition-all hover:scale-105">
                <NavLink to="/login">Login</NavLink>
              </button>
              <button className="px-4 py-2 bg-accent text-primary-dark rounded-lg hover:bg-accent font-semibold hover:text-black transition-all hover:scale-105">
                <NavLink to="/register">Register</NavLink>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
