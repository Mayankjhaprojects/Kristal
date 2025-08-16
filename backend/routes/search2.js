const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const Fund = require('../models/Fund_schema');
const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});

function cosineSimilarity(vec1, vec2) {
  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dot / (mag1 * mag2);
}

const SIMILARITY_THRESHOLD = 0.1;

async function callGPT(prompt) {
  const res = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 1024,
  });
  return res.choices[0].message.content.trim();
}

const SchemaFields = [
  // include all your fields here...
 'fundName', 'fundCode', 'DATE', 'DOCUMENTS_FOLDER', 'KRISTAL_TICKER',
  'CREDIBILITY_BAND', 'PAC_DECISION', 'COUNTRIES_APPROVED_FOR',
  'PAC_DECISION_RATIONALE', 'IS_PART_OF_PAC_FOCUS_LIST_YES_NO',
  'PAC_FOCUS_LIST_DECISION_RATIONALE', 'FORWARD_LOOKING_PAC_VIEW',
  'EXPECTED_RETURNS', 'SHOULD_FUND_BE_INCLUDED_IN_THE_MODEL_PORTFOLIO',
  'RANK', 'CAGR', 'COMPLETE_RETURN', 'MAX_DRAWDOWN', 'CALMAR',
  'TOTAL_NEGATIVE_RETURNS', 'TOTAL_POSITIVE_RETURNS', 'SHARPE',
  'LAST_1_YEARS_SHARPE', 'LAST_2_YEARS_SHARPE', 'LAST_3_YEARS_SHARPE',
  'SORTINO', 'LAST_1_YEARS_SORTINO', 'LAST_2_YEARS_SORTINO',
  'LAST_3_YEARS_SORTINO', 'RETURN_2019', 'RETURN_2020', 'RETURN_2021',
  'RETURN_2022', 'RETURN_2023', 'RETURN_2024', 'RETURN_2025',
  'MIN_YEARLY_RETURNCAGR', 'YEARLY_VOLCAGR', 'MAR2020_RETURN',
  'APR2022_RETURN', 'SEP2022_RETURN', 'POSITIVE_RETURN_MONTHS', 'VOL',
  'LAST_1_YEARS_VOL', 'LAST_2_YEARS_VOL', 'LAST_3_YEARS_VOL',
  'MAX_MIN_RETURN', 'KIRSTAL_NAME_AND_KRISTAL_ALIAS', 'KRISTAL_UNIQUE_ID',
  'SPONSORED_BY', 'HORIZON', 'INVESTORS', 'CURRENCY', 'NAV',
  'NET_ACCRUED', 'ISALLOWEDSUBSCRIPTION', 'NAV_WITHOUT_ACCRUED',
  'START_DATE', 'BENCHMARK', 'STRATEGY_TYPE', 'REQUIRED_BROKER',
  'KRISTAL_VISIBILITY', 'SOURCE_KRISTAL_ID', 'SOURCE_KRISTAL_NAME',
  'RESIDUAL_CASH_MULTIPLIER', 'SOPHISTICATION', 'FUND_DESCRIPTION',
  'ABOUT_THE_FUND', 'REASON_TO_INVEST', 'RISKS', 'MONEY_MARKET_FUND',
  'DRAWDOWN_RISK', 'ASSET_TYPE_EXPOSURE', 'SUB_CATEGORY', 'STYLE',
  'TARGET_IRR', 'REGION', 'IC_CATEGORY', 'NOTE_BELOW_RETURNS',
  'SHARE_CLASS', 'INVESTOR_CATEGORY', 'FUND_AUM', 'FUND_AUM_DATE',
  'DISCLAIMER', 'RISK_DISCLAIMER', 'MINIMUM_TICK_SIZE', 'FUND_SOURCE',
  'FUND_MANAGED_BY', 'ISIN', 'FUND_MANAGER', 'FUND_ADMIN_NAME',
  'AML_AGENT_NAME', 'TOP_HOLDINGS', 'DEALING_INFORMATION',
  'SUBSCRIPTION_MINIMUM_INITIAL', 'SUBSCRIPTION_MINIMUM_SUBSEQUENT',
  'MINIMUM_HOLDING_VALUE', 'SUBSCRIPTION_FREQUENCY', 'DEFAULT_NAV',
  'REDEMPTION_FREQUENCY', 'NO_OF_DECIMALS_ALLOWED_UNITS',
  'LOCK_IN_PERIOD_FOR_REDEMPTION', 'APPLICABLE_FROM', 'DETAILS_OF_LOCK_IN',
  'FUND_HOUSE_DAYS_TYPE', 'NOTICE_DAYS_BUY', 'NOTICE_DAYS_SELL', 'ISSUER',
  'ISSUER_DESCRIPTION', 'PORTFOLIO_MANAGER', 'FUND_MANAGER_AUM',
  'FUND_MANAGER_AUM_DATE', 'ISSUER_WEBSITE', 'EXPENSE_RATIO',
  'FUND_SALES_CHARGE', 'FUND_MANAGEMENT_FEE', 'FUND_PERFORMANCE_FEE',
  'HURDLE_RATE', 'HIGH_WATER_MARK', 'FUND_REDEMPTION_FEE',
  'OTHER_CHARGES', 'KRISTAL_ACCESS_FEE', 'KRISTAL_PLATFORM_FEE',
  'REVENUE_TYPE', 'WHITELISTING', 'VERSION', 'embedding' // shorten for this example
];

// 🧠 Main Search Route
router.post('/search-funds', async (req, res) => {
  try {
    const { query } = req.body;
    console.log("🔍 Received query:", query);

    // Step 1: Classify query type
    const classificationPrompt = `
You are a query classifier for a fund search system.

Classify the query into one of the following:
- "structured" if it contains only numeric or field-based conditions.
- "semantic" if it's descriptive and needs interpretation.
- "mixed" if it contains both structured conditions and semantic language.

Respond with just one word: structured, semantic, or mixed.

Query: "${query}"
    `.trim();

    const queryType = (await callGPT(classificationPrompt)).toLowerCase();
    console.log(`📌 GPT classified query as: ${queryType}`);

    // Function to generate MongoDB query using GPT
    const generateMongoQuery = async (inputQuery) => {
      const mongoPrompt = `
You are a MongoDB query generator. Convert the following query into a valid MongoDB filter using only the fields below:
${SchemaFields.join(', ')}

Query: "${inputQuery}"

Return ONLY a valid JSON object (no markdown, no explanation).
      `.trim();
      const raw = await callGPT(mongoPrompt);
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    };

    // Function to perform vector embedding search using Python
    const runSemanticSearch = async (queryText, fundCandidates) => {
      return new Promise((resolve, reject) => {
        const py = spawn('python', ['generate_fund_embedding.py']);
        let result = '';

        py.stdin.write(JSON.stringify({ type: "query", text: queryText }));
        py.stdin.end();

        py.stdout.on('data', (data) => result += data.toString());
        py.stderr.on('data', (err) => console.error("❌ Python stderr:", err.toString()));

        py.on('close', async (code) => {
          if (code !== 0) return reject('Python script failed');

          let queryEmbedding;
          try {
            queryEmbedding = JSON.parse(result);
          } catch {
            return reject('Failed to parse embedding');
          }

          const scored = fundCandidates.map(fund => {
            const score = cosineSimilarity(queryEmbedding, fund.embedding);
            return { fund, score };
          });

          const filtered = scored
            .filter(item => item.score >= SIMILARITY_THRESHOLD)
            .sort((a, b) => b.score - a.score);

          const finalResults = filtered.map(({ fund, score }) => ({
            ...fund.toObject(),
            similarityScore: score,
          }));

          resolve(finalResults);
        });
      });
    };

    // Route logic based on classification
    if (queryType === 'structured') {
      const mongoQuery = await generateMongoQuery(query);
      const results = await Fund.find(mongoQuery);
      console.log(`📦 Structured matched ${results.length} fund(s)`);
      return res.json({ results });
    }

    if (queryType === 'semantic') {
      const allFunds = await Fund.find({ embedding: { $exists: true } });
      const results = await runSemanticSearch(query, allFunds);
      return res.json({ results });
    }

    if (queryType === 'mixed') {
      const extractStructuredPrompt = `
Extract only the structured part of this query (numeric/field conditions):

Query: "${query}"

Respond with only the structured portion of the query.
      `.trim();

      const structuredPart = await callGPT(extractStructuredPrompt);
      console.log(`🧩 Extracted structured part: ${structuredPart}`);

      let mongoQuery;
      try {
        mongoQuery = await generateMongoQuery(structuredPart);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to generate MongoDB query for structured part' });
      }

      const filteredFunds = await Fund.find({ ...mongoQuery, embedding: { $exists: true } });
      const results = await runSemanticSearch(query, filteredFunds);
      return res.json({ results });
    }

    // Default fallback
    return res.status(400).json({ error: 'Unrecognized query type' });

  } catch (err) {
    console.error("🔥 Search route failed:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
