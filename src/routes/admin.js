const { Router } = require('express');
const { createBattlepassController, updateBattlepassController, deleteBattlepassController } = require('../controllers/battlepass/battlepass');
const { createItemController, updateItemController, deleteItemController } = require('../controllers/item/item');
const { createQuestController, updateQuestController, deleteQuestController } = require('../controllers/quest/quest');
const { createRoleController, updateRoleController, deleteRoleController } = require('../controllers/role/role');
const { createShopController, updateShopController, deleteShopController } = require('../controllers/shop/shop');
const { authorizationMiddleware } = require('../middlewares/authorization');
const { checkRole } = require('../middlewares/access');

const router = Router();

//battlepass routes
router.post('/battlepass/createBattlepass', [authorizationMiddleware, checkRole(['admin'])], createBattlepassController);
router.put('/battlepass/updateBattlepass/:id', [authorizationMiddleware, checkRole(['admin'])], updateBattlepassController);
router.delete('/battlepass/deleteBattlepass/:id', [authorizationMiddleware, checkRole(['admin'])], deleteBattlepassController);

//item routes
router.post('/item/createItem', [authorizationMiddleware, checkRole(['admin'])], createItemController);
router.put('/item/updateItem/:id', [authorizationMiddleware, checkRole(['admin'])], updateItemController);
router.delete('/item/deleteItem/:id', [authorizationMiddleware, checkRole(['admin'])], deleteItemController);

//quest routes
router.post('/quest/createQuest', [authorizationMiddleware, checkRole(['admin'])], createQuestController);
router.put('/quest/updateQuest/:id', [authorizationMiddleware, checkRole(['admin'])], updateQuestController);
router.delete('/quest/deleteQuest/:id', [authorizationMiddleware, checkRole(['admin'])], deleteQuestController);

//role routes
router.post('/role/createRole', [authorizationMiddleware, checkRole(['admin'])], createRoleController);
router.put('/role/updateRole/:id', [authorizationMiddleware, checkRole(['admin'])], updateRoleController);
router.delete('/role/deleteRole/:id', [authorizationMiddleware, checkRole(['admin'])], deleteRoleController);

//shop routes
router.post('/shop/createShop', [authorizationMiddleware, checkRole(['admin'])], createShopController);
router.put('/shop/updateShop/:id', [authorizationMiddleware, checkRole(['admin'])], updateShopController);
router.delete('/shop/deleteShop/:id', [authorizationMiddleware, checkRole(['admin'])], deleteShopController);

module.exports = router;