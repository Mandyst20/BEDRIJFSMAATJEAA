const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.get('/', protect, newsletterController.listSubscribers);

module.exports = router;
