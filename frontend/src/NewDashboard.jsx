import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Eye, Pencil, Plus, FileSearch,Bot } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

const allParams = [
  "fundName", "fundCode", "DATE", "DOCUMENTS_FOLDER", "KRISTAL_TICKER", "CREDIBILITY_BAND",
  "PAC_DECISION", "COUNTRIES_APPROVED_FOR", "PAC_DECISION_RATIONALE", "IS_PART_OF_PAC_FOCUS_LIST_YES_NO",
  "PAC_FOCUS_LIST_DECISION_RATIONALE", "FORWARD_LOOKING_PAC_VIEW", "EXPECTED_RETURNS",
  "SHOULD_FUND_BE_INCLUDED_IN_THE_MODEL_PORTFOLIO", "RANK", "CAGR", "COMPLETE_RETURN",
  "MAX_DRAWDOWN", "CALMAR", "TOTAL_NEGATIVE_RETURNS", "TOTAL_POSITIVE_RETURNS", "SHARPE",
  "LAST_1_YEARS_SHARPE", "LAST_2_YEARS_SHARPE", "LAST_3_YEARS_SHARPE", "SORTINO", "LAST_1_YEARS_SORTINO",
  "LAST_2_YEARS_SORTINO", "LAST_3_YEARS_SORTINO", "RETURN_2019", "RETURN_2020", "RETURN_2021", "RETURN_2022",
  "RETURN_2023", "RETURN_2024", "RETURN_2025", "MIN_YEARLY_RETURNCAGR", "YEARLY_VOLCAGR",
  "MAR2020_RETURN", "APR2022_RETURN", "SEP2022_RETURN", "POSITIVE_RETURN_MONTHS", "VOL",
  "LAST_1_YEARS_VOL", "LAST_2_YEARS_VOL", "LAST_3_YEARS_VOL", "MAX_MIN_RETURN", "KIRSTAL_NAME_AND_KRISTAL_ALIAS",
  "KRISTAL_UNIQUE_ID", "SPONSORED_BY", "HORIZON", "INVESTORS", "CURRENCY", "NAV", "NET_ACCRUED",
  "ISALLOWEDSUBSCRIPTION", "NAV_WITHOUT_ACCRUED", "START_DATE", "BENCHMARK", "STRATEGY_TYPE",
  "REQUIRED_BROKER", "KRISTAL_VISIBILITY", "SOURCE_KRISTAL_ID", "SOURCE_KRISTAL_NAME",
  "RESIDUAL_CASH_MULTIPLIER", "SOPHISTICATION", "FUND_DESCRIPTION", "ABOUT_THE_FUND", "REASON_TO_INVEST",
  "RISKS", "MONEY_MARKET_FUND", "DRAWDOWN_RISK", "ASSET_TYPE_EXPOSURE", "SUB_CATEGORY", "STYLE",
  "TARGET_IRR", "REGION", "IC_CATEGORY", "NOTE_BELOW_RETURNS", "SHARE_CLASS", "INVESTOR_CATEGORY",
  "FUND_AUM", "FUND_AUM_DATE", "DISCLAIMER", "RISK_DISCLAIMER", "MINIMUM_TICK_SIZE", "FUND_SOURCE",
  "FUND_MANAGED_BY", "ISIN", "FUND_MANAGER", "FUND_ADMIN_NAME", "AML_AGENT_NAME", "TOP_HOLDINGS",
  "DEALING_INFORMATION", "SUBSCRIPTION_MINIMUM_INITIAL", "SUBSCRIPTION_MINIMUM_SUBSEQUENT",
  "MINIMUM_HOLDING_VALUE", "SUBSCRIPTION_FREQUENCY", "DEFAULT_NAV", "REDEMPTION_FREQUENCY",
  "NO_OF_DECIMALS_ALLOWED_UNITS", "LOCK_IN_PERIOD_FOR_REDEMPTION", "APPLICABLE_FROM", "DETAILS_OF_LOCK_IN",
  "FUND_HOUSE_DAYS_TYPE", "NOTICE_DAYS_BUY", "NOTICE_DAYS_SELL", "ISSUER", "ISSUER_DESCRIPTION",
  "PORTFOLIO_MANAGER", "FUND_MANAGER_AUM", "FUND_MANAGER_AUM_DATE", "ISSUER_WEBSITE", "EXPENSE_RATIO",
  "FUND_SALES_CHARGE", "FUND_MANAGEMENT_FEE", "FUND_PERFORMANCE_FEE", "HURDLE_RATE", "HIGH_WATER_MARK",
  "FUND_REDEMPTION_FEE", "OTHER_CHARGES", "KRISTAL_ACCESS_FEE", "KRISTAL_PLATFORM_FEE", "REVENUE_TYPE",
  "WHITELISTING", "VERSION"
];

const numericParams = [
  "FORWARD_LOOKING_PAC_VIEW", "CAGR", "COMPLETE_RETURN", "MAX_DRAWDOWN", "CALMAR",
  "TOTAL_NEGATIVE_RETURNS", "TOTAL_POSITIVE_RETURNS", "SHARPE", "LAST_1_YEARS_SHARPE",
  "LAST_2_YEARS_SHARPE", "LAST_3_YEARS_SHARPE", "SORTINO", "LAST_1_YEARS_SORTINO",
  "LAST_2_YEARS_SORTINO", "LAST_3_YEARS_SORTINO", "RETURN_2019", "RETURN_2020", "RETURN_2021",
  "RETURN_2022", "RETURN_2023", "RETURN_2024", "RETURN_2025", "MIN_YEARLY_RETURNCAGR",
  "YEARLY_VOLCAGR", "MAR2020_RETURN", "APR2022_RETURN", "SEP2022_RETURN", "POSITIVE_RETURN_MONTHS",
  "VOL", "LAST_1_YEARS_VOL", "LAST_2_YEARS_VOL", "LAST_3_YEARS_VOL", "MAX_MIN_RETURN",
  "NAV", "NET_ACCRUED", "NAV_WITHOUT_ACCRUED", "MINIMUM_TICK_SIZE", "SUBSCRIPTION_MINIMUM_INITIAL",
  "SUBSCRIPTION_MINIMUM_SUBSEQUENT", "MINIMUM_HOLDING_VALUE", "DEFAULT_NAV",
  "NO_OF_DECIMALS_ALLOWED_UNITS", "NOTICE_DAYS_BUY", "NOTICE_DAYS_SELL", "VERSION"
];

const COLORS = [
  '#8884d8', // light purple
  '#82ca9d', // green
  '#ffc658', // yellow-orange
  '#ff8042', // orange
  '#00C49F', // teal
  '#FFBB28', // amber
  '#8dd1e1', // light blue
  '#a4de6c', // light green
  '#d0ed57', // lemon
  '#fa8072', // salmon
  '#b0e0e6', // powder blue
  '#dda0dd', // plum
  '#c71585', // medium violet red
  '#6495ed', // cornflower blue
  '#ff69b4', // hot pink
  '#cd5c5c', // indian red
  '#40e0d0', // turquoise
  '#ffb6c1', // light pink
  '#7b68ee', // medium slate blue
  '#3cb371'  // medium sea green
];

export default function FundDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFundIds, setSelectedFundIds] = useState([]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [compareReady, setCompareReady] = useState(false);
  const [showParamSelection, setShowParamSelection] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/get-funds")
      .then(res => setFunds(res.data))
      .catch(err => console.error("Failed to load funds", err));
  }, []);

  const toggleFundSelect = (id) => {
    setSelectedFundIds(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) :
      prev.length < 10 ? [...prev, id] : prev
    );
    setCompareReady(false);
  };

  const toggleParamSelect = (param) => {
    setSelectedParams(prev =>
      prev.includes(param) ? prev.filter(p => p !== param) :
      prev.length < 10 ? [...prev, param] : prev
    );
  };

  const handleCompare = () => {
    if (selectedFundIds.length && selectedParams.length) {
      setCompareReady(true);
    }
  };

  const handleExportBackendPDF = async () => {
    try {
      const selectedFunds = funds.filter(f => selectedFundIds.includes(f._id));
      const res = await axios.post('http://localhost:5000/pdf-download', {
        funds: selectedFunds,
        params: selectedParams,
        numericParams
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fund_comparison.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

   const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    
    alert('👋 You have been logged out.');

    
    navigate(-1);
  };

  const handleAIAnalyze = async () => {
    const selectedFunds = funds.filter(f => selectedFundIds.includes(f._id));
    const fundInfo = selectedFunds.map(fund => {
      const partial = {};
      selectedParams.forEach(param => partial[param] = fund[param]);
      return partial;
    });

    setLoading(true);
    setAiResponse("");

    try {
      const res = await axios.post('http://localhost:5000/api/analyze-funds-kristal', {
        funds: fundInfo,
        params: selectedParams,
        prompt: customPrompt
      });
      setAiResponse(res.data.response);
    } catch (err) {
      console.error("AI analysis failed", err);
      setAiResponse("❌ Failed to analyze with GPT.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = funds.filter(f =>
    f.fundName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFunds = funds.filter(f => selectedFundIds.includes(f._id));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700">Fund Management Portal</h1>
        {user && (
          <p className="text-md text-gray-600">Hi, <span className="font-semibold text-indigo-700">{user.fullName}</span></p>
        )}
      </div>

     <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
  {/* Left group of buttons */}
  <div className="flex gap-4 flex-wrap items-center">
    <button onClick={() => navigate('/register',{state:{user}})} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
      <Plus size={18} /> Register Fund
    </button>
    <button onClick={() => navigate('/audit',{state:{user}})} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
      <FileSearch size={18} /> View Audit Logs
    </button>
    <button
      onClick={() => navigate('/Search',{state:{user}})}
      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
    >
      <Bot size={18} /> AI Fund Search
    </button>
  </div>

  {/* Search bar aligned to right */}
 <input
  type="text"
  placeholder="Search by Fund Name..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="px-4 py-2 w-[400px] border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
/>
     <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
    >
       Logout
     </button>

</div>


      

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-3 text-left">Select</th>
              <th className="px-4 py-3 text-left">Fund Code</th>
              <th className="px-4 py-3 text-left">Fund Name</th>
              <th className="px-4 py-3 text-left">Kristal Ticker</th>
              <th className="px-4 py-3 text-left">Credibility Band</th>
              <th className="px-4 py-3 text-left">PAC Decision</th>
              <th className="px-4 py-3 text-left">Expected Returns</th>
              <th className="px-4 py-3 text-left">Sharpe</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFunds.map(fund => (
              <tr key={fund._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedFundIds.includes(fund._id)}
                    onChange={() => toggleFundSelect(fund._id)}
                    disabled={
                      !selectedFundIds.includes(fund._id) && selectedFundIds.length >= 10
                    }
                    className="accent-indigo-600"
                  />
                </td>
                <td className="px-4 py-3">{fund.fundCode}</td>
                <td className="px-4 py-3">{fund.fundName}</td>
                <td className="px-4 py-3">{fund.KRISTAL_TICKER ?? "—"}</td>
                <td className="px-4 py-3">{fund.CREDIBILITY_BAND ?? "—"}</td>
                <td className="px-4 py-3">{fund.PAC_DECISION ?? "—"}</td>
                <td className="px-4 py-3">{fund.EXPECTED_RETURNS ?? "—"}</td>
                <td className="px-4 py-3">{typeof fund.SHARPE === "number" ? fund.SHARPE.toFixed(2) : "—"}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800 mr-2" title="View" onClick={() => navigate('/NewView', { state: { fund ,user} })}>
                    <Eye size={18} />
                  </button>
                  <button className="text-green-600 hover:text-green-800" title="Edit" onClick={() => navigate('/NewUpdate', { state: { fund, user } })}>
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFundIds.length > 0 && (
        <div className="mt-6">
          {!showParamSelection ? (
            <button
              onClick={() => setShowParamSelection(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Select Parameters
            </button>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Choose up to 10 Parameters</h3>
              <div className="max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border shadow mb-4">
                {allParams.map(param => (
                  <label key={param} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedParams.includes(param)}
                      onChange={() => toggleParamSelect(param)}
                      disabled={!selectedParams.includes(param) && selectedParams.length >= 10}
                      className="accent-teal-600"
                    />
                    <span className="text-sm break-words max-w-[200px]">{param}</span>

                  </label>
                ))}
              </div>
              <button
                onClick={handleCompare}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Compare
              </button>
            </>
          )}
        </div>
      )}

      {compareReady && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Comparison Table</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left">Parameter</th>
                  {selectedFunds.map(f => (
                    <th key={f.fundName} className="px-4 py-3 text-left">{f.fundName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedParams.map(param => (
                  <tr key={param} className="border-t">
                    <td className="px-4 py-3 font-semibold">{param}</td>
                    {selectedFunds.map(f => (
                      <td key={f._id} className="px-4 py-3">
                        {String(f[param] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar + Pie Charts */}
          {selectedParams.some(p => numericParams.includes(p)) && (
            <div className="mt-10 grid md:grid-cols-2 gap-8">
              {selectedParams.filter(p => numericParams.includes(p)).map((param, i) => (
                <div key={param}>
                  <h4 className="text-lg font-semibold mb-3">{param} - Bar Chart</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={selectedFunds.map(f => ({ name: f.fundCode, value: f[param] }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill={COLORS[i % COLORS.length]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <h4 className="text-lg font-semibold mt-6 mb-3">{param} - Pie Chart</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={selectedFunds.map(f => ({ name: f.fundCode, value: f[param] }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {selectedFunds.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}

          {/* PDF + GPT */}
          <div className="mt-10 space-y-6">
          

            <div>
              <h4 className="text-lg font-semibold mb-2"> AI-Powered Insights</h4>
              <textarea
                rows={4}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Write a custom GPT prompt..."
                className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAIAnalyze}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Ask GPT
              </button>

              {loading && <p className="mt-2 text-yellow-600">Loading AI response...</p>}
              {!loading && aiResponse && (
                <div className="mt-4 bg-gray-100 p-4 border rounded-md">
                  <strong>Response:</strong>
                  <pre className="whitespace-pre-wrap">{aiResponse}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
