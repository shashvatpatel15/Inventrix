const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.route('/')
    .get(supplierController.getSuppliers)
    .post(supplierController.addSupplier);

router.route('/:id')
    .get(supplierController.getSupplierById)
    .put(supplierController.updateSupplier)
    .delete(supplierController.deleteSupplier);

module.exports = router;
