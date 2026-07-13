const express = require('express');
const router = express.Router();

// GET platform analytics
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      analytics: {
        totalNodesGlobal: 0,
        totalEnergyTraded_kWh: 0,
        totalECTMinted: 0,
        totalVolumeUSDC: 0,
        activeOrders: 0,
        countriesOnboarded: 0,
        carbonOffsetTonnes: 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
