// src/Departments.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/departments')  // ✅ Corrected port
      .then(response => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  return (
    <div className="relative bg-yellow-100 p-8 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto mt-8">
      {/* Watermark */}
      <div className="absolute bottom-2 right-4 text-black opacity-10 text-5xl select-none pointer-events-none">
        IG
      </div>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Departments
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-yellow-300">
            <th className="p-3 text-sm font-semibold">#</th>
            <th className="p-3 text-sm font-semibold">Department Name</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept.id} className="odd:bg-white even:bg-yellow-50 hover:bg-yellow-200 transition-colors">
              <td className="p-3 text-sm">{index + 1}</td>
              <td className="p-3 text-sm">{dept.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Departments;
