const asyncHandler = require('../middleware/asyncHandler');

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  res.status(201).json({
    success: true,
    data: {
      name: name || 'Onbekend',
      email: email || 'onbekend@example.com',
      message: message || '',
      ticketId: 'contact-1'
    }
  });
});

exports.listMessages = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'contact-1',
        name: 'Lisa',
        email: 'lisa@example.com',
        message: 'Vraag over premium pakket'
      }
    ]
  });
});
