const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware
// ============================================================

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve views
app.use('/views', express.static(path.join(__dirname, 'views')));

// ============================================================
// API Routes
// ============================================================

// Quiz routes (public)
app.use('/api/quiz', require('./backend/routes/quiz.routes'));

// Admin routes (protected)
app.use('/api/admin', require('./backend/routes/admin.routes'));

// ============================================================
// Frontend Routes - Serve HTML Pages
// ============================================================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// EMI Calculator
app.get('/emi-calculator.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'emi-calculator.html'));
});

// SIP Calculator
app.get('/sip-calculator.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sip-calculator.html'));
});

// SWP Calculator
app.get('/swp-calculator.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'swp-calculator.html'));
});

// Quiz Results
app.get('/quiz-results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'quiz-results.html'));
});

// Admin Dashboard
app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

// ============================================================
// Error Handling
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// ============================================================
// Start Server
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('============================================================');
  console.log('🚀 Financial Calculator Server Started');
  console.log('============================================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Public: http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('============================================================');
  console.log('📄 Pages:');
  console.log(`   Home:           http://localhost:${PORT}/`);
  console.log(`   EMI Calculator: http://localhost:${PORT}/emi-calculator.html`);
  console.log(`   SIP Calculator: http://localhost:${PORT}/sip-calculator.html`);
  console.log(`   SWP Calculator: http://localhost:${PORT}/swp-calculator.html`);
  console.log(`   Admin Panel:    http://localhost:${PORT}/admin-dashboard.html`);
  console.log('============================================================');
  console.log('🔌 API Endpoints:');
  console.log(`   Quiz API:  http://localhost:${PORT}/api/quiz`);
  console.log(`   Admin API: http://localhost:${PORT}/api/admin`);
  console.log('============================================================');
});

module.exports = app;
