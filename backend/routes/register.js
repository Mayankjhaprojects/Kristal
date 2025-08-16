require("dotenv").config();  // must be at the top
const express = require('express');
const Fund = require('../models/Fund_schema');
const router = express.Router(); 
const OpenAI = require('openai');
const AuditLog = require('../models/AuditLog');
const { spawn } = require('child_process');
const path = require('path');

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN, // Ensure this is set in your .env
});



// Route: Register a new fund with vector embedding
// Route: POST /register-fund
// routes/register.js


router.post('/register-funds', async (req, res) => {
  try {
    const { funds } = req.body; // Expecting: { funds: [ {...}, {...} ] }
    if (!Array.isArray(funds) || funds.length === 0) {
      return res.status(400).json({ error: 'No funds provided' });
    }

    const scriptPath = path.join(__dirname, '..', 'generate_fund_embedding.py');

    const inserted = [];
    const failed = [];

    // Helper: generate embedding via Python
    const generateEmbedding = (fundData) =>
      new Promise((resolve, reject) => {
        const py = spawn('python', [scriptPath]);

        let embedding = '';
        let errorOutput = '';

        py.stdin.write(JSON.stringify(fundData));
        py.stdin.end();

        py.stdout.on('data', (data) => {
          embedding += data.toString();
        });

        py.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        py.on('close', (code) => {
          if (code !== 0) {
            return reject(errorOutput || 'Python process failed');
          }
          try {
            const embeddingVector = JSON.parse(embedding);
            resolve(embeddingVector);
          } catch (err) {
            reject('Invalid embedding JSON');
          }
        });
      });

    // Process each fund sequentially
    for (const fundData of funds) {
      try {
        const embeddingVector = await generateEmbedding(fundData);

        const newFund = new Fund({
          ...fundData,
          embedding: embeddingVector,
        });

        await newFund.save();
        inserted.push(fundData.fundName || fundData._id || 'Unnamed Fund');
      } catch (err) {
        console.error('Error registering fund:', fundData, err);
        failed.push({
          fund: fundData.fundName || 'Unnamed Fund',
          reason: err.toString(),
        });
      }
    }

    return res.status(201).json({
      message: `Processed ${funds.length} funds`,
      inserted,
      failed,
    });
  } catch (err) {
    console.error('Bulk register failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/get-funds', async (req, res) => {
  try {
    const funds = await Fund.find().sort({ createdAt: -1 });
    res.status(200).json(funds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fund data', details: err.message });
  }
});

router.post('/pdf-download', async (req, res) => {
  const { funds, params, numericParams } = req.body;

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, '../templates/comparisonTemplate.ejs'),
      { funds, params, numericParams }
    );

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=fund_comparison.pdf',
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Generation Error:", err);
    res.status(500).send("Failed to generate PDF");
  }
});


router.post('/analyze-funds-kristal', async (req, res) => {
  const { funds, params, prompt } = req.body;

  if (!Array.isArray(funds) || !Array.isArray(params)) {
    return res.status(400).json({ error: 'Invalid input: funds or params are missing or invalid' });
  }

  const selectedData = funds.map(fund => {
    const partial = {};
    params.forEach(param => {
      partial[param] = fund[param];
    });
    return partial;
  });

  const fullPrompt = `Compare the following funds:\n\n${JSON.stringify(selectedData, null, 2)}\n\nUser Prompt: ${prompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o", // GitHub-hosted model
      messages: [
        { role: "system", content: "You are a financial analyst assistant." },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 1
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("GPT API Error:", error.message);
    res.status(500).json({ error: "Failed to get response from GitHub AI", details: error.message });
  }
});

router.put('/new/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  

  try {
    // Find fund by ID
    const fund = await Fund.findById(id);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }

    // Update fund fields
    Object.keys(updatedData).forEach(key => {
      fund[key] = updatedData[key];
    });

    // Save updated fund
    const savedFund = await fund.save();
    res.json(savedFund);
  } catch (err) {
    console.error('Error updating fund:', err);
    res.status(500).json({ message: 'Server error while updating fund' });
  }
});


router.post('/audit-log-new', async (req, res) => {
  const { action, userId, userFullName, fundName, changes } = req.body;
  console.log(req.body);

  if (!action || !userId || !userFullName || (action === 'updated' && !changes)) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const log = new AuditLog({
      action,
      userId,
      userFullName,
      fundName,
      changes,
    });

    await log.save();
    res.status(201).json({ message: 'Audit log saved', log });
  } catch (err) {
    console.error('Failed to save audit log:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/generate-summary', async (req, res) => {
  const { fund } = req.body;

  if (!fund) {
    return res.status(400).json({ error: 'No fund data provided.' });
  }

  try {
    const prompt = `You are a financial analyst. Write a short 3-4 line summary in investor-friendly language based on this fund:\n\n${Object.entries(fund)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
      .join('\n')}`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are a financial analyst." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = response.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    console.error('GPT ERROR:', err);
    res.status(500).json({ error: 'Summary generation failed', details: err.message });
  }
});

module.exports = router;
















