import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserDashboard from "./pages/User/UserDashboard";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!token || !user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
};

const AppRoutes = () => {
  const { user, token } = useContext(AuthContext);

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          token && user
            ? user.role === "ADMIN"
              ? <Navigate to="/admin/dashboard" />
              : user.role === "OWNER"
              ? <Navigate to="/store-owner/dashboard" />
              : <Navigate to="/user/dashboard" />
            : <Navigate to="/login" />
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboards */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
