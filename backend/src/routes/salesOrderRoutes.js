const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrderController');

router.route('/')
    .get(salesOrderController.getSalesOrders)
    .post(salesOrderController.createSalesOrder);

router.route('/:id')
    .get(salesOrderController.getSalesOrderById)
    .put(salesOrderController.updateSalesOrder)
    .delete(salesOrderController.deleteSalesOrder);

module.exports = router;
