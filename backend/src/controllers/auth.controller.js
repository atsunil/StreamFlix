const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const mockStorage = require('../utils/mockStorage');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
        console.log('📝 Using Mock Storage for registration');
        const existingUser = mockStorage.userStorage.getOne(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        await mockStorage.userStorage.create({ name, email, password });
        return res.status(201).json({ message: 'User registered successfully (Mock)' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            passwordHash: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
        console.log('📝 Using Mock Storage for login');
        const user = mockStorage.userStorage.getOne(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                watchlist: user.watchlist
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            watchlist: user.watchlist,
            profiles: user.profiles
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};