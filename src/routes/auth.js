const { Router } = require('express');
const { registerController, loginController, logoutController } = require('../controllers/auth/auth');


const router = Router();
router.post('/register', [], registerController);
router.post('/login', [], loginController);
router.post('/logout', [], logoutController);

module.exports = router;