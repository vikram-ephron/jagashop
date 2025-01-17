import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useCart();
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (adminOnly) {
    return adminUser?.role === 'admin' ? children : <Navigate to="/admin/login" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 