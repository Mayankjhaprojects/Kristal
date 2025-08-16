**Kristal.AI – Fund Management Dashboard**

A MERN stack based Fund Management Dashboard that allows users to:

1) 📂 Upload fund data via Excel

2) 🗄️ Store and manage fund details in MongoDB

3) 📊 Select and compare up to 10 funds across 10 parameters (from 127 total fields)

4) 📈 View data in tables and visualizations

5) 🤖 Get AI-powered insights using GPT

6) 📑 Export analysis to PDF reports

7) 🔎 Perform hybrid fund search (structured SQL-like + semantic vector search)







**🚀 Features**

1) Excel Upload – Upload .xlsx files containing fund data and store in MongoDB

2) Fund Comparison – Select multiple funds and compare chosen parameters

3) Charts & Visualizations – Compare visually using Recharts

4) AI Insights – Generate analysis via GPT API (using GitHub-hosted GPT model by default)

🔹 Can be swapped with OpenAI GPT API easily

5) Export Reports – Download insights and comparisons as PDF

6) Authentication – JWT-based login/signup with access & refresh tokens

7) Hybrid Search – Combines structured filters + semantic vector similarity






⚙️ Installation & Setup
1️⃣ Clone Repository
-- git clone https://github.com/Mayankjhaprojects/Kristal.AI.git
-- cd Kristal.AI

2️⃣ Backend Setup
-- cd backend
-- npm install



**Create a .env file inside backend/**

MONGO_URI=your_mongo_connection_string
GITHUB_TOKEN=your_github_token   # or OpenAI API key if replacing GPT logic
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d



**Run backend:**
-- npx nodemon server.js  or  node server.js



3️⃣ Frontend Setup
-- cd frontend
-- npm install
-- npm start  or  npm run dev




🤖 AI Integration

Currently uses GitHub-hosted GPT model with your GITHUB_TOKEN.

**To use OpenAI GPT API instead:**
**1)Install OpenAI SDK:**
npm install openai


**2)Replace GPT logic in backend route:**

import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Analyze fund performance..." }],
});






📊 Fund Comparison Features

1) Select up to 10 funds

2) Select up to 10 parameters (from 127 schema fields)

3) Compare funds in table view

4) Generate charts with Recharts

5) Export comparisons + insights as PDF






📄 API Endpoints (Backend)
**Method            	Endpoint	                 Description**

POST	          /api/auth/signup	          User registration
POST	          /api/auth/login	            User login (returns tokens)
POST	          /api/funds/upload         	Upload Excel file and parse to DB
GET	            /api/funds	                Get all funds
GET	            /api/funds/:id	            Get single fund details
POST	          /api/funds/compare	        Compare selected funds
POST	          /api/funds/search	          Hybrid structured + semantic search
POST	          /api/ai/insights	          Generate GPT-powered insights






✅ Tech Stack

1) Frontend: React + Tailwind + Recharts

2) Backend: Node.js + Express

3) Database: MongoDB + Mongoose

4) Authentication: JWT (access + refresh tokens)

5)AI: GPT (GitHub-hosted / OpenAI API)



