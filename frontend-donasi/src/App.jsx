import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppChat from "./components/WhatsAppChat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardDonatur from "./pages/DashboardDonatur";
import DashboardPenerima from "./pages/DashboardPenerima";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/donatur" element={<DashboardDonatur />} />
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/penerima" element={<DashboardPenerima />} />
          </Routes>
        </div>
        <Footer />

        {/* Widget Floating Chatbot WhatsApp */}
        <WhatsAppChat />
      </div>
    </Router>
  );
}
