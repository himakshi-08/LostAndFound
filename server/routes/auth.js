const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, studentId, department, year, phone } = req.body;
        
        // Validate campus email (example: @university.edu)
        const emailDomain = email.split('@')[1];
        const allowedDomains = ['university.edu', 'gmail.com', 'srmap.edu.in', 'srmap.ac.in'];
        if (!emailDomain || !allowedDomains.some(domain => emailDomain.includes(domain))) {
             // For testing allowing common domains, but in production we'd restrict further
             // return res.status(400).json({ message: 'Please use your campus email ID.' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, studentId, department, year, phone });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name, email, reputationScore: 0 } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email, reputationScore: user.reputationScore } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
