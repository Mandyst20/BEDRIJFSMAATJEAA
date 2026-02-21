const express = require('express');
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', contactController.submitContact);
router.get('/', protect, contactController.listMessages);

module.exports = router;
