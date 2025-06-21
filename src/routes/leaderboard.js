const { Router } = require('express');
const { getLeaderboardController } = require('../controllers/user/leaderboard');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();
router.get('/get-leaderboard', [authorizationMiddleware], getLeaderboardController);

module.exports = router;