// src/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-100 p-4 shadow-md fixed">
      <h2 className="text-xl font-bold mb-6">Inventory Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/departments" className="hover:text-blue-600">Departments</Link>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <Link to="/inventory-logs" className="hover:text-blue-600">Inventory Logs</Link>
        <Link to="/purchases" className="hover:text-blue-600">Purchases</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
