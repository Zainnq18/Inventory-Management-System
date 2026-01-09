// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import Departments from './Departments';
import Products from './Products';
import InventoryLogs from './InventoryLogs';
import Purchases from './Purchases';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './AuthProvider';
import './App.css';

function AppLayout() {
  const { logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-yellow-100 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-green-600">Indiana Sporting Goods</div>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-green-600">Departments</Link>
          <Link to="/products" className="text-gray-600 hover:text-green-600">Products</Link>
          <Link to="/inventory" className="text-gray-600 hover:text-green-600">Inventory Logs</Link>
          <Link to="/purchases" className="text-gray-600 hover:text-green-600">Purchases</Link>
          <button onClick={logout} className="text-red-600 hover:text-red-800 ml-4">Logout</button>
        </div>
      </nav>

      {/* WATERMARK */}
      <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-extrabold text-green-600 pointer-events-none select-none">
        IG
      </div>

      {/* HEADER */}
      <header className="text-center mt-6 mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Indiana Sporting Goods Inventory System
        </h1>
      </header>

      {/* ROUTES */}
      <main className="px-6 space-y-10 pb-10">
        <Routes>
          <Route path="/" element={<PrivateRoute><Departments /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><InventoryLogs /></PrivateRoute>} />
          <Route path="/purchases" element={<PrivateRoute><Purchases /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Auth routes (login/signup/reset) */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
      <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />} />

      {/* All other app routes are wrapped in AppLayout (with navbar/header) */}
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
