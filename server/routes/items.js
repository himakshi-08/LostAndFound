const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');
const { findMatches } = require('../utils/aiMatch');

// Middleware to protect routes
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Report Item
router.post('/report', auth, async (req, res) => {
    try {
        const newItem = new Item({ ...req.body, user: req.user });
        await newItem.save();

        // Trigger AI matching
        const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
        const potentialMatches = await Item.find({ type: oppositeType, status: 'active' }).populate('user', 'name email');
        
        const matches = findMatches(newItem, potentialMatches);

        res.status(201).json({ item: newItem, matches });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Active Items (for Activity Feed)
router.get('/all', auth, async (req, res) => {
    try {
        const items = await Item.find({ status: 'active' }).sort({ createdAt: -1 }).populate('user', 'name');
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get My Items
router.get('/my-items', auth, async (req, res) => {
    try {
        const items = await Item.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Item Matches
router.get('/:id/matches', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        const oppositeType = item.type === 'lost' ? 'found' : 'lost';
        const potentialMatches = await Item.find({ type: oppositeType, status: 'active' }).populate('user', 'name email');
        
        const matches = findMatches(item, potentialMatches);
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!item) return res.status(404).json({ message: 'Item not found or unauthorized' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
