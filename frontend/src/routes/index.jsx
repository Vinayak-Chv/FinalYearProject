import { Navigate } from "react-router-dom";

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
import EventCollection from "../pages/EventCollection";
import Cart from "../pages/Cart";
import Messages from "../pages/Messages";
import Consult from "../pages/Consult";
import ConsultDetail from "../pages/ConsultDetail";

// Dashboard Pages
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/dashboard/Profile";
import Orders from "../pages/dashboard/Orders";
import Measurements from "../pages/dashboard/Measurements";
import Settings from "../pages/dashboard/Settings";

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
        <Route path="/messages" element={<Messages />} />
        <Route path="/tailors" element={<TailorList />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/consult/:id" element={<ConsultDetail />} />
        <Route path="/tailor/:id" element={<TailorDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/collection/event/:eventId" element={<EventCollection />} />
        <Route path="/collection/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Dashboard Layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/profile" />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/measurements" element={<Measurements />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
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