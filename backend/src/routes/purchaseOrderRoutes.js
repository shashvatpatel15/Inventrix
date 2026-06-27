const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

router.route('/')
    .get(purchaseOrderController.getPurchaseOrders)
    .post(purchaseOrderController.createPurchaseOrder);

router.route('/:id')
    .get(purchaseOrderController.getPurchaseOrderById)
    .put(purchaseOrderController.updatePurchaseOrder)
    .delete(purchaseOrderController.deletePurchaseOrder);

module.exports = router;
