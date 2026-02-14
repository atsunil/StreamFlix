require('dotenv').config();
const express = require('express');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Test server working' });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`);
  
  // Keep process alive
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Server still running...`);
  }, 10000);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Prevent process from exiting
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
});
