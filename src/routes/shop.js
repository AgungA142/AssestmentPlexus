const { Router } = require('express');
const {
    getAllShopsController,
    getShopByIdController,
    purchaseItemController,
    topUpGameCurrencyController
} = require('../controllers/shop/shop');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();

router.get('/getAllShop', [], getAllShopsController);
router.get('/getDetailShop/:id',[], getShopByIdController);
router.post('/:shop_id/items/:item_id/purchase', [authorizationMiddleware], purchaseItemController);
router.post('/topup', [authorizationMiddleware], topUpGameCurrencyController);

module.exports = router;