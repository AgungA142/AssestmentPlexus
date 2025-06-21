const { Router } = require('express');
const { getScoreByUserIdController, saveHighestScoreByUserIdController } = require('../controllers/user/leaderboard');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();
router.get('/get-score', [authorizationMiddleware], getScoreByUserIdController);
router.post('/save-highest-score', [authorizationMiddleware], saveHighestScoreByUserIdController);

module.exports = router;