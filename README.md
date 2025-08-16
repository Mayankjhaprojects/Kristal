📊 Kristal.AI – Fund Management Dashboard

An advanced MERN stack platform for managing, analyzing, and comparing investment funds. Designed to handle large-scale fund data, provide AI-powered insights, and allow hybrid search for fund discovery.

🎯 What This Project Does

This dashboard enables fund managers, analysts, and investors to:

Upload and store fund data from Excel into MongoDB.

Select and compare up to 10 funds across 10 key parameters (from 127 total fields).

Visualize fund performance through interactive charts & tables.

Generate AI-powered insights using GPT.

Export comparisons and insights to PDF reports.

Perform hybrid fund search combining structured queries and semantic vector search.

✨ Key Features

📄 Excel Upload – Import fund data seamlessly from .xlsx files.

📊 Fund Comparison – Compare multiple funds across chosen parameters.

📈 Charts & Visualizations – Interactive graphs built with Recharts.

🤖 AI Insights – Natural language analysis powered by GPT API.

📑 Report Export – Save comparisons & insights as PDF.

🔐 Authentication – JWT-based login/signup with access & refresh tokens.

🔍 Hybrid Search – Combine structured filtering with semantic similarity search.

🧠 Key Concepts Explained

If you’re new to the underlying technologies, here are some resources:

Hybrid Search

Vector Search Basics – How semantic embeddings improve search.

Combining Structured + Semantic – Why hybrid search is powerful.

JWT Authentication

JWT Guide – How tokens secure APIs.

Excel → MongoDB Pipelines

Excel Parsing in Node.js – Library used to process fund files.

GPT Integration

OpenAI Docs – How to call GPT for financial insights.

🏗️ Architecture Overview
┌──────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Frontend       │     │   Backend        │     │   AI & Database    │
│  (React + Vite)  │◄──► │ (Node.js + Exp.) │ ◄──►│ GPT API + MongoDB │
│                  │     │                  │     │ Vector Search      │
│ • Fund Upload    │     │ • Auth (JWT)     │     │ (Embeddings)       │
│ • Comparison UI  │     │ • Excel Parsing  │     │ PDF Generation     │
│ • Charts         │     │ • Fund Storage   │     │                    │
└──────────────────┘     └──────────────────┘     └────────────────────┘

🚀 Getting Started
🔹 Prerequisites

Make sure you have installed:

Node.js 18+

MongoDB (local or cloud)

Git

🔹 Required API Keys

MongoDB Connection String

OpenAI API Key (or GitHub-hosted GPT Token if using GitHub model)

📋 Installation Steps
1️⃣ Clone the Repository
git clone https://github.com/Mayankjhaprojects/Kristal.AI.git
cd Kristal.AI

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend/:

MONGO_URI=your_mongo_connection_string
OPENAI_API_KEY=your_openai_key_here  # or GITHUB_TOKEN if using GitHub GPT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d


Run backend server:

npm run dev


Backend runs at: http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs at: http://localhost:3000

4️⃣ Verify Installation

Open browser → http://localhost:3000

Register & Login.

Upload a sample fund Excel file.

Compare funds & generate AI insights.

📱 How to Use

Upload Fund Data – Import Excel files with fund details.

Compare Funds – Select up to 10 funds and 10 parameters.

Visualize – Switch between tables and charts.

Get AI Insights – Ask questions like:

“Which fund has the best Sharpe ratio?”

“Compare risk-adjusted returns of top 3 funds.”

Export Reports – Download insights as PDF.

🛠️ Technology Stack

Backend

Node.js + Express

MongoDB (Fund storage)

JWT Authentication

OpenAI API (or GitHub GPT)

Frontend

React + Vite

Tailwind CSS + Shadcn UI

Recharts (visualizations)

AI/ML

GPT (insight generation)

Vector embeddings (semantic search)

📂 Project Structure
Kristal.AI/
├── backend/
│   ├── routes/           # Auth, funds, AI endpoints
│   ├── models/           # MongoDB fund schemas
│   ├── utils/            # Excel parsing, JWT handling
│   ├── server.js         # Express server entry
│   └── .env.example      # Env config
├── frontend/
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Dashboard pages
│   │   └── hooks/        # Custom hooks
│   ├── package.json
│   └── vite.config.js
└── README.md

🔧 Configuration

Create .env file inside backend/:

MONGO_URI=your-mongo-uri
OPENAI_API_KEY=sk-your-openai-key
JWT_ACCESS_SECRET=secret123
JWT_REFRESH_SECRET=secret456

🐛 Troubleshooting

Push blocked due to secrets → Ensure .env is in .gitignore.

Excel upload fails → Check Excel format matches schema.

JWT expired → Refresh token via /api/auth/refresh.

AI not responding → Verify OpenAI/GitHub API key in .env.

🚀 Deployment

Backend → Deploy to Render, Railway, or AWS.

Frontend → Deploy to Vercel or Netlify.

Set environment variables securely in deployment platform.

🤝 Contributing

We welcome contributions!

Fork the repo

Create a feature branch

Submit a pull request

📄 License

MIT License – Free to use for learning & development.

🎓 Learning Resources

MongoDB Atlas Setup

OpenAI GPT Docs

MERN Stack Crash Course

JWT Authentication Guide

🔥 Built with ❤️ using MongoDB, Express, React, Node.js, and GPT for smart fund analysis.
