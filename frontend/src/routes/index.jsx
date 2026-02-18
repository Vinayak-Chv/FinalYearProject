import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Components
import Navbar from "../components/Navbar";

// Public Pages
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import TailorList from "../pages/TailorList";
import TailorDetail from "../pages/TailorDetail";
import ProductDetail from "../pages/ProductDetail";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";

// More pages will be added according to the Customer, SP's and Admin

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/tailors" element={<TailorList />} />
          <Route path="/tailor/:id" element={<TailorDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
};

export default Index;
