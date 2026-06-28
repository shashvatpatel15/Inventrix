const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const supplierRoutes = require('./supplierRoutes');
const warehouseRoutes = require('./warehouseRoutes');
const purchaseOrderRoutes = require('./purchaseOrderRoutes');
const salesOrderRoutes = require('./salesOrderRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Public Auth routes
router.use('/auth', authRoutes);

// Protected resource routes
router.use(authMiddleware);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/sales-orders', salesOrderRoutes);

module.exports = router;
