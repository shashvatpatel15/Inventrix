const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'inventrix_secret_key_123';

exports.register = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.users.create({
            data: { username, password: hashedPassword }
        });
        res.status(201).json({ message: 'User registered successfully! You can now log in.' });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        throw err;
    }
});

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await prisma.users.findUnique({
        where: { username }
    });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Login successful!',
        token,
        username: user.username
    });
});
