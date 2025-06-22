const { Router } = require('express');
const {
    getAllShopsController,
    getShopByIdController,
    purchaseItemController
} = require('../controllers/shop/shop');
const { authorizationMiddleware } = require('../middlewares/authorization');

const router = Router();

router.get('/getAllShop', [], getAllShopsController);
router.get('/getDetailShop/:id',[], getShopByIdController);
router.post('/:shop_id/items/:item_id/purchase', [authorizationMiddleware], purchaseItemController);

module.exports = router;