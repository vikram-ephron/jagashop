import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 