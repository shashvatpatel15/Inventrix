const prisma = require('../config/prisma');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createSalesOrder = asyncHandler(async (req, res, next) => {
    const { product_id, supplier_id, qty, price } = req.body;
    const qty_sold = parseInt(qty, 10);
    
    if (!product_id || !supplier_id || isNaN(qty_sold) || qty_sold <= 0 || !price) {
        return res.status(400).json({ message: 'All fields are required. Quantity must be greater than 0.' });
    }

    try {
        await prisma.$transaction(async (tx) => {
            // Step 1: Check stock and lock the product row using a raw query inside the transaction context
            const rows = await tx.$queryRaw`SELECT qty FROM products WHERE product_id = ${product_id} FOR UPDATE`;

            if (rows.length === 0) {
                throw new Error('PRODUCT_NOT_FOUND');
            }

            const currentStock = rows[0].qty;

            // Step 2: If stock is insufficient, abort
            if (currentStock < qty_sold) {
                throw new Error('INSUFFICIENT_STOCK');
            }

            // Step 3: Insert the Sales Order
            await tx.sales_orders.create({
                data: {
                    product_id,
                    supplier_id,
                    qty: qty_sold,
                    price: Number(price)
                }
            });

            // Step 4: Update the product quantity (subtract from stock)
            await tx.products.update({
                where: { product_id },
                data: {
                    qty: {
                        decrement: qty_sold
                    }
                }
            });
        });

        res.status(201).json({ message: 'Sales Order created and stock updated!' });

    } catch (err) {
        if (err.message === 'PRODUCT_NOT_FOUND') {
            return res.status(404).json({ message: 'Error: Product ID not found.' });
        }
        if (err.message === 'INSUFFICIENT_STOCK') {
            return res.status(400).json({ message: 'Error: Not enough stock.' });
        }
        throw err;
    }
});

exports.getSalesOrders = asyncHandler(async (req, res) => {
    const rows = await prisma.sales_orders.findMany({
        orderBy: { sale_date: 'desc' }
    });
    res.json(rows);
});

exports.getSalesOrderById = asyncHandler(async (req, res) => {
    const row = await prisma.sales_orders.findUnique({
        where: { so_id: Number(req.params.id) }
    });
    res.json(row || null);
});

exports.updateSalesOrder = asyncHandler(async (req, res) => {
    const { product_id, supplier_id, qty, price } = req.body;
    const qty_sold = parseInt(qty, 10);
    if (!product_id || !supplier_id || isNaN(qty_sold) || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    await prisma.sales_orders.update({
        where: { so_id: Number(req.params.id) },
        data: {
            product_id,
            supplier_id,
            qty: qty_sold,
            price: Number(price)
        }
    });
    res.json({ message: 'SO updated successfully!' });
});

exports.deleteSalesOrder = asyncHandler(async (req, res) => {
    await prisma.sales_orders.delete({
        where: { so_id: Number(req.params.id) }
    });
    res.json({ message: 'SO deleted successfully!' });
});
