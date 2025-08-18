# 📊 Kristal.AI – Fund Management Dashboard

A modern MERN stack application for managing, comparing, and analyzing investment funds. Users can upload fund data, perform AI-powered analysis, and generate professional PDF reports — all within a secure, intuitive dashboard.



## 🎯 What This Project Does

This platform empowers fund managers and analysts to streamline fund data management and insights:

1. **Data Upload & Storage** -Upload Excel files containing fund data and store them in MongoDB
2. **Fund Comparison Engine** -Compare up to 10 funds across 10 chosen parameters
3. **AI Insights Generator** - Get contextual analysis using GPT-powered models
4. **Hybrid Search System** - Combine structured queries with semantic vector search
5. **Reporting & Visualization** - View insights in tables/charts and export PDF reports
   

### Key Features

- 📂 **Excel Upload** - Import .xlsx files and parse fund details automatically
- 🔐 **Authentication** -Secure JWT-based login and signup (access + refresh tokens)
- 📊 **Visual Analytics** - Compare funds with interactive charts (Recharts)
- 🤖 **AI-Powered Insights** - Natural language analysis of fund performance
- 📄 **PDF Reports** - Export comparison results and insights into professional reports
-🔍 **Smart Search** - Hybrid model (structured queries + vector embeddings)

## 🧠 Key Concepts Explained

If you're new to these concepts, here are some quick guides:

### Hybrid Search
- **What it is**:Combines exact (structured) filtering with semantic (vector) search
- **Why it matters**:Ensures both precision and context-based fund retrieval

### Vector Embeddings & Semantic Search
- **Beginner's Guide**:https://www.pinecone.io/learn/vector-embeddings/
- **Use Here**: Encodes fund data for semantic fund comparison

### GPT Insights
- **What it is**: AI-driven text analysis using GPT models
- **Use Here**: Automatically explains fund performance, risk, and opportunities

### JWT Authentication
- **What it is**:Secure token-based authentication system
- **Use Here**: Protects fund data with access & refresh tokens



## 🏗️ Architecture Overview

```
┌───────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│   Frontend        │     │    Backend (API)   │     │   AI Services   │
│   (React + Vite)  │◄───►│   (Node + Express) │◄───►│   GPT Models    │
│                   │     │                    │     │                 │
│ • Fund Dashboard  │     │ • Fund Data API    │     │ • Insights Gen  │
│ • Upload UI       │     │ • Auth (JWT)       │     │ • Embeddings    │
│ • Visualization   │     │ • Excel Parser     │     │                 │
└───────────────────┘     │ • PDF Generator    │     └─────────────────┘
                          │ • Hybrid Search    │
                          └────────────────────┘
                                   │
                          ┌────────────────────┐
                          │   Database (Mongo) │
                          │ • Fund Records     │
                          │ • User Accounts    │
                          └────────────────────┘

```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **MongoDB** - [Download MongoDB](https://www.mongodb.com/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads)




## 📋 Installation Steps


### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   npm install
   ```
1. **Run Backend:**
   ```bash
   npx nodemon server.js
   ```

2. **Create a .env file inside the backend folder:**
   ```bash
   MONGO_URI=your_mongo_connection_string
   GITHUB_TOKEN=your_github_token   # or OpenAI API key if replacing GPT logic
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   ```




### Step 2: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```


### Step 3: AI Integration

1. **Install OpenAI SDK:** 
   ```bash
   npm install openai
   ```

2. **Replace GPT logic in backend route:**
   ```bash
   import OpenAI from "openai";

   const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

   const response = await client.chat.completions.create({
   model: "gpt-4",
   messages: [{ role: "user", content: "Analyze fund performance..." }],
   });

   ```


### 📄 API Endpoints (Backend)
  

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/api/auth/signup`   | User registration                   |
| POST   | `/api/auth/login`    | User login (returns tokens)         |
| POST   | `/api/funds/upload`  | Upload Excel file and parse to DB   |
| GET    | `/api/funds`         | Get all funds                       |
| GET    | `/api/funds/:id`     | Get single fund details             |
| POST   | `/api/funds/compare` | Compare selected funds              |
| POST   | `/api/funds/search`  | Hybrid structured + semantic search |
| POST   | `/api/ai/insights`   | Generate GPT-powered insights       |


## 📊 Fund Comparison Features  

- Select up to **10 funds**  
- Select up to **10 parameters** (from 127 schema fields)  
- Compare funds in **table view**  
- View insights via **charts (Recharts)**  
- **Export results as PDF**  

