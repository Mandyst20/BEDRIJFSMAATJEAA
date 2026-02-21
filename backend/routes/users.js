const express = require('express');
const usersController = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(usersController.listUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
