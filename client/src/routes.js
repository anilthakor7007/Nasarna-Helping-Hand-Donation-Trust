// src/AppRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/Admin";
import AuthLayout from "layouts/Auth";
import Index from "views/Index";
import Profile from "views/examples/Profile";
import Register from "views/examples/Register";
import Login from "views/examples/Login";
import Trustees from "views/examples/Trustess";
import Donors from "views/examples/Donors";
import Donations from "views/examples/Donations";
import Causes from "views/examples/Causes";
import ProtectedRoute from "./components/protected routes/protectedRoutes"; // Import ProtectedRoute

function AppRoutes() {

  
  return (
    <Routes>
    {/* Admin Layout Routes - Protected by ProtectedRoute */}


    <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route path="index" element={<Index />} />
      <Route path="trustees" element={<Trustees />} />
      <Route path="donors" element={<Donors />} />
      <Route path="donations" element={<Donations />} />
      <Route path="causes" element={<Causes />} />
      <Route path="user-profile" element={<Profile />} />
    </Route>
  
    {/* Auth Layout Routes */}
    <Route path="/auth/*" element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}
    </Route>
  
    {/* Default Route */}
    <Route path="*" element={<Navigate to="/auth/login" replace />} />
  </Routes>
  
  );
}

export default AppRoutes;
