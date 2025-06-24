const { Router } = require('express');
const {
    getAvailableBattlepassController,
    activateBattlepassController,
    getActiveBattlepassQuestsController
} = require('../controllers/battlepass/battlepass');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();

router.get('/available', [], getAvailableBattlepassController);
router.post('/:battlepass_id/activate', [authorizationMiddleware], activateBattlepassController);
router.get('/active/quests', [authorizationMiddleware], getActiveBattlepassQuestsController);

module.exports = router;