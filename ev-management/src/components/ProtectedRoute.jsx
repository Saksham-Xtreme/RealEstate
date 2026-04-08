import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Usage:
 *   <ProtectedRoute allowedRoles={["user"]}> <Listings /> </ProtectedRoute>
 *   <ProtectedRoute allowedRoles={["owner"]}> <OwnerDashboard /> </ProtectedRoute>
 *   <ProtectedRoute allowedRoles={["employee"]}> <EmployeeHome /> </ProtectedRoute>
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const token = localStorage.getItem("token");
  const raw   = localStorage.getItem("user");

  /* not logged in at all → go to login */
  if (!token || !raw) return <Navigate to="/login" replace />;

  let user;
  try { user = JSON.parse(raw); }
  catch { return <Navigate to="/login" replace />; }

  const userRole = user?.role || "user";

  /* wrong role → redirect to their correct home */
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "employee") return <Navigate to="/employee/home"      replace />;
    if (userRole === "owner")    return <Navigate to="/owner/dashboard"    replace />;
    return                              <Navigate to="/listings"           replace />;
  }

  return children;
};

export default ProtectedRoute;