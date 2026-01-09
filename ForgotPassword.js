import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', pin: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const result = await resetPassword(form.username, form.pin, form.newPassword);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Invalid PIN or Username');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Password reset successfully! Redirecting to login...</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="pin"
          placeholder="Enter 4-digit PIN"
          value={form.pin}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          maxLength={4}
          pattern="\d{4}"
          title="Enter a 4-digit PIN"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
