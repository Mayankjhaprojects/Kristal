import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function View() {
  const state = useLocation();
  const navigate = useNavigate();
   
 const fund = state.state?.fund || null;
  const user = state.state?.user || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  if (!fund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">⚠️ No fund data found.</h1>
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

  const hiddenKeys = ['createdAt', 'updatedAt', '__v'];

  const sharpeData = [
    { year: '1 Year', value: fund.LAST_1_YEARS_SHARPE },
    { year: '2 Years', value: fund.LAST_2_YEARS_SHARPE },
    { year: '3 Years', value: fund.LAST_3_YEARS_SHARPE },
  ].filter(d => d.value !== undefined && d.value !== null);

  const returnData = [
    { year: '2019', value: fund.RETURN_2019 },
    { year: '2020', value: fund.RETURN_2020 },
    { year: '2021', value: fund.RETURN_2021 },
    { year: '2022', value: fund.RETURN_2022 },
    { year: '2023', value: fund.RETURN_2023 },
    { year: '2024', value: fund.RETURN_2024 },
    { year: '2025', value: fund.RETURN_2025 },
  ].filter(d => d.value !== undefined && d.value !== null);

  const filteredEntries = Object.entries(fund)
    .filter(([key]) => !hiddenKeys.includes(key))
    .filter(([key, value]) => {
      const label = formatLabel(key).toLowerCase();
      return label.includes(searchTerm.toLowerCase()) || key.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setSummary('');
    setSummaryError('');

    try {
      const res = await fetch("http://localhost:5000/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fund })
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setSummaryError("❌ Failed to generate summary.");
      }
    } catch (err) {
      console.error("Summary generation failed:", err);
      setSummaryError("❌ Something went wrong.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-10">
      <div className="flex justify-between items-center mb-6">
      <h1></h1>
        {user && (
          <p className="text-md text-gray-600">Hi, <span className="font-semibold text-indigo-700">{user.fullName}</span></p>
        )}
      </div>
      {/* Fund Details Section */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-indigo-700">Fund Detail View</h1>
          <input
            type="text"
            placeholder="Search parameter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-700"
          />
        </div>

        <div className="overflow-y-auto pr-2 flex-grow">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 hover:shadow-sm transition-all duration-200"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    {formatLabel(key)}
                  </h4>
                  <p className="text-gray-900 break-words text-sm">
                    {renderValue(value)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No matching parameters found.</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={handleGenerateSummary}
            className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Generate Fund Summary (AI)
          </button>
        </div>

        {/* Summary Display */}
        {loadingSummary && <p className="mt-4 text-yellow-600">Generating summary...</p>}
        {summary && (
          <div className="mt-4 bg-indigo-50 p-4 rounded-md border">
            <h3 className="font-semibold mb-2 text-indigo-800">AI Summary</h3>
            <p className="text-gray-800 whitespace-pre-line">{summary}</p>
          </div>
        )}
        {summaryError && <p className="mt-4 text-red-600">{summaryError}</p>}
      </div>

      {/* Charts Section */}
      {(sharpeData.length > 0 || returnData.length > 0) && (
        <div className="max-w-7xl mx-auto mt-10 grid md:grid-cols-2 gap-8">
          {sharpeData.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-indigo-700 mb-2">Sharpe Ratio (Last 3 Years)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sharpeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {returnData.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-indigo-700 mb-2">Returns (2019–2025)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={returnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
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

function renderValue(value) {
  if (value === null || value === undefined) return '—';

  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
        {value}
      </a>
    );
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return value.toString();
}
