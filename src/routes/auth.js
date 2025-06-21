const { Router } = require('express');
const { registerController, loginController, logoutController } = require('../controllers/auth/auth');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();
router.post('/register', [], registerController);
router.post('/login', [], loginController);
router.post('/logout', [authorizationMiddleware], logoutController);

module.exports = router;