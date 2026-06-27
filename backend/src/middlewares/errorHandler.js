function errorHandler(err, req, res, next) {
    console.error('❌ Error caught by handler:', err);

    // Database error mapping (MySQL raw & Prisma ORM equivalents)
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'P2003') {
        return res.status(400).json({ message: 'Error: Cannot delete: This item is in use by another record.' });
    }
    if (err.code === 'ER_DUP_ENTRY' || err.code === 'P2002') {
        return res.status(400).json({ message: 'Error: This ID already exists.' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server error';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
}

module.exports = errorHandler;
