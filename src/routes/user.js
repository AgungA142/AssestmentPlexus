const { Router } = require('express');
const { getProfileController, createProfileController } = require('../controllers/user/profile');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();

router.get('/get-profile', [authorizationMiddleware], getProfileController);
router.post('/create-profile', [authorizationMiddleware], createProfileController);

module.exports = router;