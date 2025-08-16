import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Update() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialFund = state?.fund;
  const user = state?.user;

  const [formData, setFormData] = useState(() => {
    const copy = { ...initialFund };
    delete copy.createdAt;
    delete copy.updatedAt;
    delete copy.__v;
    return copy;
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const changes = {};
      for (let key in formData) {
        if (formData[key] !== initialFund[key]) {
          changes[key] = {
            from: initialFund[key],
            to: formData[key],
          };
        }
      }

      if (Object.keys(changes).length === 0) {
        alert("No changes detected.");
        return;
      }

      await axios.put(`http://localhost:5000/api/new/${initialFund._id}`, formData);

      await axios.post('http://localhost:5000/api/audit-log-new', {
  userId: user.id,
  userFullName: user.fullName,
  fundName: initialFund.fundName,
  action: "updated",
  changes,
});


      alert('✅ Fund updated and audit log recorded!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('❌ Update failed. Please try again.');
    }
  };

  if (!initialFund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">⚠️ No fund data available for editing.</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="flex justify-between items-center mb-6">
      <h1></h1>
        {user && (
          <p className="text-md text-gray-600">Hi, <span className="font-semibold text-indigo-700">{user.fullName}</span></p>
        )}
      </div>
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Edit Fund - All Parameters</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formatLabel(key)}
                </label>
                <input
                  name={key}
                  value={value ?? ''}
                  onChange={handleChange}
                  type={typeof value === 'number' ? 'number' : 'text'}
                  className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 shadow-sm text-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
            >
              ✅ Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
