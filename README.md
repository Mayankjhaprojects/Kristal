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

### Create .env file in backend folder


1.MONGO_URI=your_mongo_connection_string
2.GITHUB_TOKEN=your_github_token   # or OpenAI API key if replacing GPT logic
3. JWT_ACCESS_SECRET=your_access_secret
4. JWT_REFRESH_SECRET=your_refresh_secret
5. JWT_ACCESS_EXPIRES_IN=15m
6. JWT_REFRESH_EXPIRES_IN=7d

## 📋 Installation Steps

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd financial-ai-platform
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment variables file:**
   ```bash
   cp env.example .env  # Copy the example file and rename it
   ```

5. **Configure your `.env` file** with your API keys:
   ```env
   # Required
   OPENAI_API_KEY=your_openai_api_key_here

   # Optional - for news features
   NEWS_API_KEY=your_news_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   
   # Optional - for advanced vector storage
   VECTORIZE_API_TOKEN=your_vectorize_api_token_here
   ```

6. **Start the backend server:**
   ```bash
   python main.py
   ```

   The backend will start at `http://localhost:8000`

### Step 3: Frontend Setup

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

   The frontend will start at `http://localhost:3000`

### Step 4: Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. You should see the Financial AI Platform interface
3. Try uploading a sample PDF document to test the system

## 📱 How to Use

### Uploading Documents

1. **Bank Statements**: Click the "Upload Statement" button and select a PDF bank statement
2. **Investment Factsheets**: Use the "Upload Factsheet" section for investment documents

### Asking Questions

Once documents are uploaded, you can ask questions like:

- "What's my account balance?"
- "Show me my largest transactions this month"
- "What fees were charged to my account?"
- "Analyze my investment portfolio"
- "What's the latest news about Apple stock?"

### Understanding Responses

The AI will provide detailed answers and indicate which document or source the information came from.

## 🛠️ Technology Stack

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [LangChain](https://python.langchain.com/) - LLM application framework
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [OpenAI API](https://openai.com/api/) - GPT-4.1 Mini and embeddings

**Frontend:**
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Modern component library

**AI/ML:**
- **Text Embeddings**: `text-embedding-3-small` for document vectorization
- **Chat Completions**: `gpt-4.1-mini-2025-04-14` for intelligent responses
- **Vector Storage**: FAISS for fast similarity search

## 📂 Project Structure

```
financial-ai-platform/
├── backend/
│   ├── agents/                 # AI agent implementations
│   │   ├── orchestrator.py    # Coordinates all agents
│   │   ├── statement_analyst.py # Bank statement analysis
│   │   ├── factsheet_analyst.py # Investment document analysis
│   │   └── news_agent.py      # Financial news fetching
│   ├── storage/               # Document storage
│   │   ├── statements/        # Processed bank statements
│   │   └── factsheets/       # Processed factsheets
│   ├── main.py               # FastAPI server
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   ├── components/       # React components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── AnalysisResults.tsx
│   │   │   └── ui/           # Shadcn/ui components
│   │   └── hooks/            # React hooks
│   ├── package.json          # Node.js dependencies
│   └── next.config.ts        # Next.js configuration
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional - News Features
NEWS_API_KEY=your-news-api-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key

# Optional - Advanced Vector Storage
VECTORIZE_API_TOKEN=your-vectorize-token
VECTORIZE_ORG_ID=your-org-id
VECTORIZE_PIPELINE_ID=your-pipeline-id
```

### Customization Options

1. **Model Selection**: Change the AI model in `agents/orchestrator.py`
2. **Embedding Model**: Modify the embedding model in `agents/statement_analyst.py`
3. **UI Theme**: Customize colors in `frontend/src/app/globals.css`

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**:
   - Ensure virtual environment is activated: `source venv/bin/activate`
   - Reinstall dependencies: `pip install -r requirements.txt`

2. **OpenAI API errors**:
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the key has proper permissions

3. **Frontend not connecting to backend**:
   - Verify backend is running on `http://localhost:8000`
   - Check CORS settings in `main.py`

4. **PDF processing fails**:
   - Ensure the PDF is not password-protected
   - Try with a smaller PDF file first
   - Check file permissions

### Getting Help

If you encounter issues:

1. Check the terminal/console for error messages
2. Verify all API keys are correctly set
3. Ensure all dependencies are installed
4. Try restarting both frontend and backend servers

## 🚀 Deployment

For production deployment:

1. **Backend**: Deploy to services like Railway, Render, or AWS
2. **Frontend**: Deploy to Vercel, Netlify, or similar platforms
3. **Environment Variables**: Set all required API keys in your deployment platform

## 🤝 Contributing

This is a learning project demonstrating multi-agent AI systems. Feel free to:

- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📄 License

This project is intended for educational purposes. Please ensure you comply with the terms of service of all third-party APIs used.

## 🎓 Learning Resources

### Next Steps to Extend This Project

1. **Add More Agent Types**: Create agents for different financial tasks
2. **Implement Caching**: Add Redis for better performance
3. **Add Authentication**: Implement user accounts and security
4. **Mobile App**: Create a React Native version
5. **Advanced Analytics**: Add charts and data visualization

### Related Learning Materials

- [Building AI Agents with LangChain](https://python.langchain.com/docs/tutorials/agents)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Vector Databases Explained](https://www.pinecone.io/learn/vector-database/)

---

Built with ❤️ using AI, Python, and TypeScript. Perfect for learning about multi-agent systems and modern web development! 
