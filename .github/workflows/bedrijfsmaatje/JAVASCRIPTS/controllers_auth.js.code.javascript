/**
 * Authentication Controller
 * Functies voor gebruikersregistratie, login en wachtwoordbeheer
 */

const crypto = require('crypto');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Registreer gebruiker
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, company, phone, industry, package } = req.body;

  // Controleer of e-mail al bestaat
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Dit e-mailadres is al geregistreerd', 400));
  }

  // Maak verificatietoken
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');

  // Gebruiker aanmaken
  const user = await User.create({
    name,
    email,
    password,
    company,
    phone,
    industry: industry || 'overig',
    emailVerificationToken
  });

  // Maak proefabonnement aan
  const subscription = await Subscription.create({
    user: user._id,
    plan: package || 'starter',
    status: 'trialing',
    billingCycle: 'monthly',
    price: getPlanPrice(package || 'starter', 'monthly'),
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dagen
  });

  // Update user met subscription ID
  await User.findByIdAndUpdate(user._id, {
    subscriptionId: subscription._id,
    subscriptionStatus: 'trial'
  });

  // Stuur verificatie e-mail
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;
  
  const message = `
    <h1>Bedankt voor je registratie bij Bedrijfsmaatje!</h1>
    <p>We zijn blij dat je ons platform wilt uitproberen.</p>
    <p>Om je account te activeren, klik op de onderstaande link:</p>
    <a href="${verifyUrl}" target="_blank">Activeer mijn account</a>
    <p>Deze link is 24 uur geldig.</p>
    <p>Als je deze registratie niet hebt aangevraagd, kun je deze e-mail negeren.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Activeer je Bedrijfsmaatje account',
      message
    });

    sendTokenResponse(user, 200, res, 'Registratie succesvol. Controleer je e-mail om je account te activeren.');
  } catch (err) {
    console.error('Email error:', err);

    // Verwijder gebruiker als e-mail niet kan worden verzonden
    await User.findByIdAndRemove(user._id);
    await Subscription.findByIdAndRemove(subscription._id);

    return next(new ErrorResponse('E-mail kon niet worden verzonden', 500));
  }
});

/**
 * @desc    Verifieer e-mailadres
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token });

  if (!user) {
    return next(new ErrorResponse('Ongeldige verificatietoken', 400));
  }

  // Update gebruiker
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  // Redirect naar frontend met succes bericht
  res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
});

/**
 * @desc    Login gebruiker
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Valideer email & password
  if (!email || !password) {
    return next(new ErrorResponse('Vul een e-mailadres en wachtwoord in', 400));
  }

  // Controleer gebruiker
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Ongeldige inloggegevens', 401));
  }

  // Controleer wachtwoord
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Ongeldige inloggegevens', 401));
  }

  // Update laatste login
  user.lastLogin = Date.now();
  user.usage.loginCount += 1;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Uitloggen gebruiker / cookie wissen
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 sec
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Huidige ingelogde gebruiker ophalen
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Abonnement informatie ophalen
  const subscription = await Subscription.findById(user.subscriptionId);

  res.status(200).json({
    success: true,
    data: {
      user,
      subscription
    }
  });
});

/**
 * @desc    Wachtwoord vergeten
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('Er bestaat geen gebruiker met dit e-mailadres', 404));
  }

  // Reset token genereren
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Reset URL maken
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `
    <h1>Wachtwoord reset aangevraagd</h1>
    <p>Je ontvangt deze e-mail omdat je een wachtwoord reset hebt aangevraagd.</p>
    <p>Klik op de onderstaande link om je wachtwoord te resetten:</p>
    <a href="${resetUrl}" target="_blank">Reset mijn wachtwoord</a>
    <p>Deze link is 10 minuten geldig.</p>
    <p>Als je geen wachtwoord reset hebt aangevraagd, kun je deze e-mail negeren.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Wachtwoord reset - Bedrijfsmaatje',
      message
    });

    res.status(200).json({ success: true, data: 'E-mail verzonden' });
  } catch (err) {
    console.error('Email error:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('E-mail kon niet worden verzonden', 500));
  }
});

/**
 * @desc    Reset wachtwoord
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Token hashen
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  // Gebruiker zoeken met token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Ongeldige token', 400));
  }

  // Nieuw wachtwoord instellen
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Wachtwoord succesvol gewijzigd');
});

/**
 * @desc    Update wachtwoord
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Controleer huidig wachtwoord
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Huidig wachtwoord is onjuist', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Wachtwoord succesvol gewijzigd');
});

/**
 * Helper functie om token response te genereren
 */
const sendTokenResponse = (user, statusCode, res, message = 'Succesvol ingelogd') => {
  // Token aanmaken
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Secure cookie in productie
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token
    });
};

/**
 * Helper functie om prijs te bepalen op basis van pakket en cyclus
 */
const getPlanPrice = (plan, cycle) => {
  const prices = {
    starter: {
      monthly: 29,
      yearly: 278
    },
    groei: {
      monthly: 79,
      yearly: 758
    },
    zakelijk: {
      monthly: 199,
      yearly: 1910
    }
  };

  return prices[plan]?.[cycle] || prices.starter.monthly;
};