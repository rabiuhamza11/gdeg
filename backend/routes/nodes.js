const express = require('express');
const router = express.Router();

// GET all registered nodes
router.get('/', async (req, res) => {
  try {
    // TODO: fetch from NodeRegistry smart contract
    res.json({
      success: true,
      nodes: [],
      total: 0,
      active: 0
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single node
router.get('/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    res.json({ success: true, node: { nodeId, status: 'pending' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST register new node (triggers smart contract)
router.post('/register', async (req, res) => {
  try {
    const { nodeId, country, region, energyType, capacityKwh, walletAddress } = req.body;
    // TODO: call NodeRegistry.registerNode()
    res.json({ success: true, message: 'Node registration submitted', nodeId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
