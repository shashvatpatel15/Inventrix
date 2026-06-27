const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.route('/')
    .get(warehouseController.getWarehouses)
    .post(warehouseController.addWarehouse);

router.route('/:id')
    .get(warehouseController.getWarehouseById)
    .put(warehouseController.updateWarehouse)
    .delete(warehouseController.deleteWarehouse);

module.exports = router;
