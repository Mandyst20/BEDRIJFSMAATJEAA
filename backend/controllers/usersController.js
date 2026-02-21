const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const users = [
  { id: 'u-1', name: 'Anna Bedrijf', email: 'anna@example.com' },
  { id: 'u-2', name: 'Bas Ondernemer', email: 'bas@example.com' }
];

exports.listUsers = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = users.find((item) => item.id === req.params.id);
  if (!user) {
    throw new ErrorResponse('Gebruiker niet gevonden', 404);
  }

  res.json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new ErrorResponse('Naam en e-mail zijn verplicht', 400);
  }

  const newUser = { id: `u-${users.length + 1}`, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, data: newUser });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = users.find((item) => item.id === req.params.id);
  if (!user) {
    throw new ErrorResponse('Gebruiker niet gevonden', 404);
  }

  Object.assign(user, req.body);

  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const index = users.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    throw new ErrorResponse('Gebruiker niet gevonden', 404);
  }

  const [removed] = users.splice(index, 1);
  res.json({ success: true, data: removed });
});
