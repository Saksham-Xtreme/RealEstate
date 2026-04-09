import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/Landing";
import Listings from "./pages/Listing";
import ListingDetail from "./pages/ListingDetail";
import MyInterests from "./pages/MyInterests";
import Authentication from "./pages/Authentication";

// Employee
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeLayout from "./layouts/EmployeeLayout";
import CreateListing from "./pages/Employee/CreateListing";
// Owner
import OwnerDashboard from "./pages/owner/OwnerDashboard";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Authentication />} />

        {/* USER ROUTES */}
        <Route
          path="/listings"
          element={
            <ProtectedRoute allowedRoles={["user", "owner"]}>
              <Listings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listing/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "owner"]}>
              <ListingDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-interests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyInterests />
            </ProtectedRoute>
          }
        />

        {/* OWNER ROUTES */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE ROUTES (NESTED) */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<EmployeeDashboard />} />
          <Route path="create-listing" element={<CreateListing />} /> 
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;