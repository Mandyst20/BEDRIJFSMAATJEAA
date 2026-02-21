const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/metrics', analyticsController.getDashboardMetrics);
router.get('/trends', analyticsController.getUsageTrends);

module.exports = router;
