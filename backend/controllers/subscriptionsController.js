const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const subscriptions = [
  { id: 's-1', userId: 'u-1', plan: 'starter', status: 'active' },
  { id: 's-2', userId: 'u-2', plan: 'pro', status: 'trial' }
];

exports.listSubscriptions = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: subscriptions });
});

exports.getSubscription = asyncHandler(async (req, res) => {
  const subscription = subscriptions.find((item) => item.id === req.params.id);
  if (!subscription) {
    throw new ErrorResponse('Abonnement niet gevonden', 404);
  }

  res.json({ success: true, data: subscription });
});

exports.createSubscription = asyncHandler(async (req, res) => {
  const { userId, plan } = req.body;
  if (!userId || !plan) {
    throw new ErrorResponse('userId en plan zijn verplicht', 400);
  }

  const newSubscription = {
    id: `s-${subscriptions.length + 1}`,
    userId,
    plan,
    status: 'active'
  };
  subscriptions.push(newSubscription);

  res.status(201).json({ success: true, data: newSubscription });
});

exports.updateSubscription = asyncHandler(async (req, res) => {
  const subscription = subscriptions.find((item) => item.id === req.params.id);
  if (!subscription) {
    throw new ErrorResponse('Abonnement niet gevonden', 404);
  }

  Object.assign(subscription, req.body);

  res.json({ success: true, data: subscription });
});

exports.cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = subscriptions.find((item) => item.id === req.params.id);
  if (!subscription) {
    throw new ErrorResponse('Abonnement niet gevonden', 404);
  }

  subscription.status = 'canceled';
  res.json({ success: true, data: subscription });
});
