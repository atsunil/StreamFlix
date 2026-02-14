const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const mockStorage = require('../utils/mockStorage');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_for_demo';
const TOKEN_EXPIRY = '7d'; // 7 days instead of 1 hour

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
        console.log('📝 Using Mock Storage for registration');
        const existingUser = mockStorage.userStorage.getOne(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = await mockStorage.userStorage.create({ name, email, password });
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        return res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
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

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                watchlist: newUser.watchlist
            }
        });
    } catch (error) {
        console.error('Register error:', error);
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

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
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

        if (!user.passwordHash) {
            return res.status(500).json({ message: 'User data corrupted (missing password)' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
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
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
            const user = mockStorage.userStorage.getById(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            return res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                watchlist: user.watchlist || []
            });
        }

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
        console.error('getCurrentUser error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};