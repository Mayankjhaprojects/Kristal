import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useLocation,useNavigate} from 'react-router-dom';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location=useLocation();
  const user = location.state?.user || {};
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/audit')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch audit logs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6"> Audit Logs</h1>
        {user && (
          <p className="text-md text-gray-600">Hi, <span className="font-semibold text-indigo-700">{user.fullName}</span></p>
        )}
      </div>
      

      {loading ? (
        <p className="text-gray-600">Loading logs...</p>
      ) : (
        <div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Fund Name</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
                <th className="px-4 py-3 text-left">Changes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{log.userFullName}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.fundName || '—'}</td>
                  <td className="px-4 py-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                 <td className="px-4 py-3 whitespace-pre-wrap text-xs text-gray-700">
  {log.changes ? (
    <ul className="space-y-1">
      {Object.entries(log.changes).map(([key, { from, to }]) => (
        <li key={key}>
          <strong className="capitalize">{key}</strong>: <span className="text-red-600 line-through">{String(from)}</span> ➔ <span className="text-green-700">{String(to)}</span>
        </li>
      ))}
    </ul>
  ) : '—'}
</td>

                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
         <div className="flex justify-between items-center mt-6">
            <h1></h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
        </div>
        
      )}
    </div>
    
  );
}
