const express = require('express');
const subscriptionsController = require('../controllers/subscriptionsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(subscriptionsController.listSubscriptions)
  .post(subscriptionsController.createSubscription);

router
  .route('/:id')
  .get(subscriptionsController.getSubscription)
  .put(subscriptionsController.updateSubscription)
  .delete(subscriptionsController.cancelSubscription);

module.exports = router;
