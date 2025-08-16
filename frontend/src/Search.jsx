

import React, { useState } from 'react';
import axios from 'axios';

export default function FundSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setError('');
    setType('');

    try {
      const res = await axios.post('http://localhost:5000/api/search-funds', { query });

      if (res.data?.results?.length > 0) {
        setResults(res.data.results);
        const isSemantic = res.data.results.some(f => 'similarityScore' in f);
        setType(isSemantic ? 'semantic' : 'structured');
        console.log('✅ Results:', res.data.results.map(r => r.fundName || r.fund?.fundName));
      } else {
        setError('No matching funds found.');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔍 AI-Powered Fund Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='e.g. "Sortino > 2 and low volatility" or "long term growth fund"'
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Showing {results.length} result(s) — Query type: <span className="font-medium">{type}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((fund, i) => (
              <div key={fund._id || i} className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{fund.fundName || fund.fund?.fundName}</h3>
                  {fund.similarityScore !== undefined && (
                    <span className="text-xs text-green-600">
                      Score: {fund.similarityScore.toFixed(4)}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  {fund.riskLevel && <p>Risk: {fund.riskLevel}</p>}
                  {fund.investmentAmount && <p>Investment: ₹{fund.investmentAmount}</p>}
                  {fund.rating && <p>Rating: {fund.rating}</p>}
                  {fund.approvalStatus && <p>Status: {fund.approvalStatus}</p>}
                </div>

                {fund.fundUrl && (
                  <a
                    href={fund.fundUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                  >
                    View More
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
