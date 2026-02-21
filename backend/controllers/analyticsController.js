const asyncHandler = require('../middleware/asyncHandler');

exports.getDashboardMetrics = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      activeUsers: 128,
      churnRate: 0.02,
      avgSessionDuration: 12,
      mostUsedFeature: 'coaching-modules'
    }
  });
});

exports.getUsageTrends = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: [
      { month: 'januari', activeUsers: 90 },
      { month: 'februari', activeUsers: 104 },
      { month: 'maart', activeUsers: 128 }
    ]
  });
});
