const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Routes
app.use('/api/nodes', require('./routes/nodes'));
app.use('/api/trading', require('./routes/trading'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/wallet', require('./routes/wallet'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'GDEG — Global Decentralized Energy Grid',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'GDEG API',
    version: '1.0.0',
    description: 'Global Decentralized Energy Grid — Blockchain P2P Energy Trading',
    endpoints: {
      nodes: '/api/nodes',
      trading: '/api/trading',
      analytics: '/api/analytics',
      wallet: '/api/wallet',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`GDEG API running on port ${PORT}`);
});

module.exports = app;
