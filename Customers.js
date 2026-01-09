import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const addCustomer = async () => {
    if (!name || !email || !phone || !address) return;
    try {
      await axios.post('http://localhost:3001/customers', {
        name,
        email,
        phone,
        address
      });
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Customer Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={addCustomer}>Add Customer</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
