const prisma = require('../config/prisma');
const asyncHandler = require('../middlewares/asyncHandler');

exports.addWarehouse = asyncHandler(async (req, res) => {
    const { warehouse_id, name, location } = req.body;
    if (warehouse_id === undefined || !name) {
        return res.status(400).json({ message: 'Warehouse ID and Name are required' });
    }
    await prisma.warehouses.create({
        data: {
            warehouse_id: Number(warehouse_id),
            name,
            location
        }
    });
    res.status(201).json({ message: 'Warehouse added successfully!' });
});

exports.getWarehouses = asyncHandler(async (req, res) => {
    const rows = await prisma.warehouses.findMany({
        orderBy: { name: 'asc' }
    });
    res.json(rows);
});

exports.getWarehouseById = asyncHandler(async (req, res) => {
    const row = await prisma.warehouses.findUnique({
        where: { warehouse_id: Number(req.params.id) }
    });
    res.json(row || null);
});

exports.updateWarehouse = asyncHandler(async (req, res) => {
    const { name, location } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Warehouse Name is required' });
    }
    await prisma.warehouses.update({
        where: { warehouse_id: Number(req.params.id) },
        data: { name, location }
    });
    res.json({ message: 'Warehouse updated successfully!' });
});

exports.deleteWarehouse = asyncHandler(async (req, res) => {
    await prisma.warehouses.delete({
        where: { warehouse_id: Number(req.params.id) }
    });
    res.json({ message: 'Warehouse deleted successfully!' });
});
