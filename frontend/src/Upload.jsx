import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [funds, setFunds] = useState([]);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Read Excel and parse into JSON
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSummary(null);
    setMessage('');

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // First sheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setFunds(jsonData);
        console.log("Parsed Funds:", jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // Send each fund to backend one by one
  const handleUpload = async () => {
    if (!funds.length) return alert("Please upload a valid Excel file first.");

    setLoading(true);
    setMessage("Uploading and registering funds...");
    const inserted = [];
    const failed = [];

    for (let i = 0; i < funds.length; i++) {
      try {
        const res = await axios.post('http://localhost:5000/api/register-fund', funds[i]);
        if (res.data?.fund) {
          inserted.push(res.data.fund.fundName || `Fund ${i + 1}`);
        }
      } catch (err) {
        console.error(`Failed for fund ${i + 1}:`, err.response?.data || err.message);
        failed.push(funds[i].fundName || `Fund ${i + 1}`);
      }
    }

    setLoading(false);
    setMessage("Upload finished!");
    setSummary({ inserted, failed });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">📥 Excel Fund Uploader</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Upload Excel (.xlsx)</span>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-6 py-2 rounded-md transition text-white ${loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"}`}
        >
          {loading ? "Uploading..." : "Upload & Register Funds"}
        </button>

        {message && (
          <p className={`mt-4 font-medium ${message.includes('fail') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        {summary && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">📊 Upload Summary</h3>

            <div className="mb-4">
              <p className="font-medium text-green-700">✅ Inserted ({summary.inserted.length}):</p>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {summary.inserted.map((code, idx) => <li key={idx}>{code}</li>)}
              </ul>
            </div>

            <div>
              <p className="font-medium text-red-700">❌ Failed ({summary.failed.length}):</p>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {summary.failed.map((code, idx) => <li key={idx}>{code}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
