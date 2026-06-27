const prisma = require('../config/prisma');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createPurchaseOrder = asyncHandler(async (req, res, next) => {
    const { product_id, supplier_id, qty_req, price } = req.body;
    if (!product_id || !supplier_id || !qty_req || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await prisma.$transaction(async (tx) => {
            // Step 1: Insert the Purchase Order
            await tx.purchase_orders.create({
                data: {
                    product_id,
                    supplier_id,
                    qty_req: Number(qty_req),
                    price: Number(price)
                }
            });

            // Step 2: Update the product quantity (add to stock)
            await tx.products.update({
                where: { product_id },
                data: {
                    qty: {
                        increment: Number(qty_req)
                    }
                }
            });
        });

        res.status(201).json({ message: 'Purchase Order created and stock updated!' });

    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Error: Product ID not found. PO was not created.' });
        }
        throw err;
    }
});

exports.getPurchaseOrders = asyncHandler(async (req, res) => {
    const rows = await prisma.purchase_orders.findMany({
        orderBy: { order_date: 'desc' }
    });
    res.json(rows);
});

exports.getPurchaseOrderById = asyncHandler(async (req, res) => {
    const row = await prisma.purchase_orders.findUnique({
        where: { po_id: Number(req.params.id) }
    });
    res.json(row || null);
});

exports.updatePurchaseOrder = asyncHandler(async (req, res) => {
    const { product_id, supplier_id, qty_req, price } = req.body;
    if (!product_id || !supplier_id || qty_req === undefined || price === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    await prisma.purchase_orders.update({
        where: { po_id: Number(req.params.id) },
        data: {
            product_id,
            supplier_id,
            qty_req: Number(qty_req),
            price: Number(price)
        }
    });
    res.json({ message: 'PO updated successfully!' });
});

exports.deletePurchaseOrder = asyncHandler(async (req, res) => {
    await prisma.purchase_orders.delete({
        where: { po_id: Number(req.params.id) }
    });
    res.json({ message: 'PO deleted successfully!' });
});
