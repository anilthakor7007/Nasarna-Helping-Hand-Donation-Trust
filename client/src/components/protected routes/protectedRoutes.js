import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const role = localStorage.getItem("role"); 
  const token = localStorage.getItem("token"); 
  console.log("role", role);
  console.log("token", token);

   // Check if either the token or role is missing
   if (!token && !role) {
    // If the token or role is missing, or the role is not admin or trustee, redirect to the login page
    return <Navigate to="/auth/login" replace />;
  }

  // If the user has a valid token and a valid role (admin or trustee), allow access to the route
  return children;
};

export default ProtectedRoute;
