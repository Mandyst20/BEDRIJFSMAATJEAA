const asyncHandler = require('../middleware/asyncHandler');
const subscribers = new Set(['anna@example.com']);

exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'E-mail is verplicht' });
    return;
  }

  subscribers.add(email);
  res.status(201).json({ success: true, message: 'Ingeschreven voor nieuwsbrief', data: { email } });
});

exports.unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !subscribers.has(email)) {
    res.status(404).json({ success: false, message: 'Abonnee niet gevonden' });
    return;
  }

  subscribers.delete(email);
  res.json({ success: true, message: 'Uitschrijven geslaagd', data: { email } });
});

exports.listSubscribers = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: Array.from(subscribers) });
});
