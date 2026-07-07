// EXTERNAL MODULES
const express = require('express');

// LOCAL MODULES
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/status', authController.getStatus);
authRouter.post('/signup', authController.postSignup);
authRouter.post('/login', authController.postLogin);
authRouter.post('/logout', authController.postLogOut);

module.exports = authRouter;