import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchPurchases();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/purchases');
      setPurchases(res.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products/all');
      setProducts(res.data); // ✅ access 'products' key
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]); // fallback in case of error
    }
  };

  const addPurchase = async () => {
    if (!customerId || !productId || !quantity) return;

    try {
      await axios.post('http://localhost:5001/api/purchases', {
        customer_id: customerId,
        product_id: productId,
        quantity: parseInt(quantity),
      });
      setCustomerId('');
      setProductId('');
      setQuantity('');
      fetchPurchases();
    } catch (err) {
      console.error('Error adding purchase:', err);
    }
  };

  // Helper function to get customer name by ID
  const getCustomerNameById = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : '';
  };

  // Helper function to get product name by ID
  const getProductNameById = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : '';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Record a Purchase</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded w-1/4"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 rounded w-1/4"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded w-1/6"
        />

        <button
          onClick={addPurchase}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Purchase
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">All Purchases</h3>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-green-100 text-gray-800">
            <th className="py-2 px-4 border-b text-left">Purchase ID</th>
            <th className="py-2 px-4 border-b text-left">Customer</th>
            <th className="py-2 px-4 border-b text-left">Product</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{purchase.id}</td>
              <td className="py-2 px-4 border-b">{getCustomerNameById(purchase.customer_id)}</td>
              <td className="py-2 px-4 border-b">{getProductNameById(purchase.product_id)}</td>
              <td className="py-2 px-4 border-b">{purchase.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Purchases;


