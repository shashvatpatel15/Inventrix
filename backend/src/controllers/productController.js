const prisma = require('../config/prisma');
const asyncHandler = require('../middlewares/asyncHandler');

exports.addProduct = asyncHandler(async (req, res) => {
    const { product_id, name, qty, price, warehouse_id } = req.body;
    if (!product_id || !name || qty === undefined || price === undefined || !warehouse_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    await prisma.products.create({
        data: {
            product_id,
            name,
            qty: Number(qty),
            price: Number(price),
            warehouse_id: Number(warehouse_id)
        }
    });
    res.status(201).json({ message: 'Product added successfully!' });
});

exports.getProducts = asyncHandler(async (req, res) => {
    const rows = await prisma.products.findMany({
        orderBy: { name: 'asc' }
    });
    res.json(rows);
});

exports.getProductById = asyncHandler(async (req, res) => {
    const row = await prisma.products.findUnique({
        where: { product_id: req.params.id }
    });
    res.json(row || null);
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, qty, price, warehouse_id } = req.body;
    if (!name || qty === undefined || price === undefined || !warehouse_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    await prisma.products.update({
        where: { product_id: req.params.id },
        data: {
            name,
            qty: Number(qty),
            price: Number(price),
            warehouse_id: Number(warehouse_id)
        }
    });
    res.json({ message: 'Product updated successfully!' });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    await prisma.products.delete({
        where: { product_id: req.params.id }
    });
    res.json({ message: 'Product deleted successfully!' });
});
