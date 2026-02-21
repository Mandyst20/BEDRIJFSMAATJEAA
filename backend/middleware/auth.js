const asyncHandler = require('./asyncHandler');

exports.protect = asyncHandler(async (req, _res, next) => {
  req.user = {
    id: 'u-12345',
    name: 'Demo User',
    email: 'demo@bedrijfsmaatje.test',
    role: 'user'
  };
  next();
});
