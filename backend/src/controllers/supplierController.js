const prisma = require('../config/prisma');
const asyncHandler = require('../middlewares/asyncHandler');

exports.addSupplier = asyncHandler(async (req, res) => {
    const { supplier_id, name, phone_no } = req.body;
    if (!supplier_id || !name) {
        return res.status(400).json({ message: 'Supplier ID and Name are required' });
    }
    await prisma.suppliers.create({
        data: { supplier_id, name, phone_no }
    });
    res.status(201).json({ message: 'Supplier added successfully!' });
});

exports.getSuppliers = asyncHandler(async (req, res) => {
    const rows = await prisma.suppliers.findMany({
        orderBy: { name: 'asc' }
    });
    res.json(rows);
});

exports.getSupplierById = asyncHandler(async (req, res) => {
    const row = await prisma.suppliers.findUnique({
        where: { supplier_id: req.params.id }
    });
    res.json(row || null);
});

exports.updateSupplier = asyncHandler(async (req, res) => {
    const { name, phone_no } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Supplier Name is required' });
    }
    await prisma.suppliers.update({
        where: { supplier_id: req.params.id },
        data: { name, phone_no }
    });
    res.json({ message: 'Supplier updated successfully!' });
});

exports.deleteSupplier = asyncHandler(async (req, res) => {
    await prisma.suppliers.delete({
        where: { supplier_id: req.params.id }
    });
    res.json({ message: 'Supplier deleted successfully!' });
});
