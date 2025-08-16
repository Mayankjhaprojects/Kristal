import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/login',
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, user } = res.data;
      console.log(accessToken);

      if (!accessToken || !user) {
        throw new Error('Invalid server response');
      }
        
      // Store access token and user info
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      alert('✅ Login successful!');
      navigate('/NewDashboard', { state: { user } });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || '❌ Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Fund Management Login</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            🔐 Log In
          </button>
        </form>
      </div>
    </div>
  );
}
