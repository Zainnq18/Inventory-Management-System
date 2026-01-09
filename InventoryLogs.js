import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [changeType, setChangeType] = useState('in');
  const [changeDate, setChangeDate] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchProducts();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/inventory-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching inventory logs:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products/products-names');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddLog = async () => {
    if (!productId || !quantity || !changeType || !changeDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/inventory-logs', {
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        change_type: changeType.toLowerCase(),
        change_date: changeDate,
      });

      setProductId('');
      setQuantity('');
      setChangeType('in');
      setChangeDate('');

      fetchLogs();
    } catch (err) {
      console.error('Error adding inventory log:', err);
      alert('Failed to add inventory log');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Inventory Logs</h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <select
          value={changeType}
          onChange={(e) => setChangeType(e.target.value)}
          className="border p-2 rounded-lg w-full"
        >
          <option value="in">Add</option>
          <option value="out">Remove</option>
          <option value="purchase">Purchase</option>
        </select>

        <input
          type="date"
          value={changeDate}
          onChange={(e) => setChangeDate(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <button
          onClick={handleAddLog}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all w-full"
        >
          Add Log
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-left">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="py-3 px-5 border-b">Product</th>
              <th className="py-3 px-5 border-b">Quantity</th>
              <th className="py-3 px-5 border-b">Change Type</th>
              <th className="py-3 px-5 border-b">Change Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No inventory logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3 px-5 border-b">{log.product?.name || '—'}</td>
                  <td className="py-3 px-5 border-b">{log.quantity}</td>
                  <td className="py-3 px-5 border-b capitalize">{log.type}</td>
                  <td className="py-3 px-5 border-b">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryLogs;