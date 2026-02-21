const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const mockUser = {
  id: 'u-12345',
  name: 'Demo User',
  email: 'demo@bedrijfsmaatje.test',
  role: 'user'
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new ErrorResponse('Naam en e-mail zijn verplicht', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Gebruiker geregistreerd',
    data: {
      id: 'u-registered',
      name,
      email
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorResponse('E-mail is verplicht', 400);
  }

  res.json({
    success: true,
    message: 'Inloggen succesvol',
    token: 'mock-jwt-token',
    data: { ...mockUser, email }
  });
});

exports.logout = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    message: 'Uitgelogd'
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user || mockUser
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorResponse('E-mail is verplicht', 400);
  }

  res.json({
    success: true,
    message: `Reset-instructies verzonden naar ${email}`
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: `Wachtwoord gereset voor token ${req.params.resettoken}`
  });
});

exports.updatePassword = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    message: 'Wachtwoord bijgewerkt'
  });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: `E-mailadres geverifieerd voor token ${req.params.token}`
  });
});
