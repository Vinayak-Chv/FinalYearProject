import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Public Pages (with navbar/footer)
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import GenderCollection from '../pages/GenderCollection';
import OutfitTypeCollection from '../pages/OutfitTypeCollection';
import TailorList from "../pages/TailorList";
import TailorDetail from "../pages/TailorDetail";
import ProductDetail from "../pages/ProductDetail";
import About from "../pages/About";
import Contact from "../pages/Contact";

// Auth Pages (without navbar/footer)
import Register from "../pages/Register";
import Login from "../pages/Login";

const Index = () => {
  return (
    <Routes>
      {/* All pages that need navbar & footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:gender" element={<GenderCollection />} />
        <Route path="/collection/:gender/:outfitType" element={<OutfitTypeCollection />} />
        <Route path="/tailors" element={<TailorList />} />
        <Route path="/tailor/:id" element={<TailorDetail />} />
        <Route path="/collection/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth pages – no navbar/footer */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default Index