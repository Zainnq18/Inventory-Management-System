// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // Redirect to login if not logged in
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
