/**
 * Newsletter Controller
 * Functies voor nieuwsbrief inschrijvingen
 */

const Newsletter = require('../models/Newsletter');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Nieuwsbrief inschrijving
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
exports.subscribe = asyncHandler(async (req, res, next) => {