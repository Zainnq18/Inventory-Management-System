import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mrp, setMrp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products and departments when component mounts or when page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`http://localhost:5001/api/products?page=${currentPage}`);
        setProducts(productsResponse.data.products);
        setTotalPages(productsResponse.data.totalPages);

        const departmentsResponse = await axios.get('http://localhost:5001/api/departments');
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('There was an error fetching the data.');
      }
    };

    fetchData();
  }, [currentPage]);

  const addProduct = async () => {
    if (!name || !departmentId || !quantity || !mrp) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Check if the product already exists
      const existingProduct = products.find(
        (product) => product.name.toLowerCase() === name.toLowerCase()
      );
      if (existingProduct) {
        setError('This product already exists.');
        return;
      }

      // Add a new product to the store
      await axios.post('http://localhost:5001/api/products', {
        name,
        department_id: parseInt(departmentId),
        quantity: parseInt(quantity),
        mrp: parseFloat(mrp),
      });

      // Reset fields and show success message
      setSuccess(true);
      setName('');
      setDepartmentId('');
      setQuantity('');
      setMrp('');
      setError('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('There was an error adding the product.');
      setSuccess(false);
    }
  };

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Success or Error Messages */}
      {success && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Product added successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}

      {/* Product Input Form */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded w-40"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border p-2 rounded w-40"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 rounded w-32"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="MRP"
          className="border p-2 rounded w-32"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
        />
        <button
          onClick={addProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <table className="min-w-full table-auto border border-gray-200 mt-4">
        <thead>
          <tr className="bg-blue-200 text-left">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">MRP (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-100 text-left">
                <td className="px-4 py-2 border">{prod.id}</td>
                <td className="px-4 py-2 border">{prod.name}</td>
                <td className="px-4 py-2 border">{prod.department_name || 'N/A'}</td>
                <td className="px-4 py-2 border">{prod.quantity}</td>
                <td className="px-4 py-2 border">
                  ₹{!isNaN(parseFloat(prod.mrp)) ? parseFloat(prod.mrp).toFixed(2) : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No products available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
