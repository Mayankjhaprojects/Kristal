require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const authRoute = require('./routes/auth');
const auditRoute = require('./routes/audit');
const registerRoute = require('./routes/register');

const search2Route=require('./routes/search2');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());

// Route Mounting
 
app.use('/api', authRoute);            // example: POST /api/auth/login
app.use('/api', auditRoute);          // example: GET /api/audit
app.use('/api', registerRoute);    // example: POST /api/register
 
app.use('/api',search2Route);   // example: GET /api/search

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
