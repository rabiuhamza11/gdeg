const express = require('express');
const router = express.Router();

// GET open orders
router.get('/orders', async (req, res) => {
  try {
    res.json({ success: true, orders: [], total: 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create order
router.post('/orders', async (req, res) => {
  try {
    const { ectAmount, pricePerEct, durationHours, walletAddress } = req.body;
    // TODO: call TradingEngine.createOrder()
    res.json({ success: true, message: 'Order created', orderId: Date.now() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST fill order
router.post('/orders/:orderId/fill', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { walletAddress } = req.body;
    // TODO: call TradingEngine.fillOrder()
    res.json({ success: true, message: 'Order filled', orderId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
