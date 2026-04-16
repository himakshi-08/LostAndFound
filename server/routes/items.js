const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');
const User = require('../models/User');
const { findMatches } = require('../utils/aiMatch');

const sanitizeVerificationQuestions = (questions = []) => {
    return questions
        .filter(q => q?.question?.trim() && q?.answer?.trim())
        .map(q => ({ question: q.question.trim(), answer: q.answer.trim() }));
};

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
        const itemData = { ...req.body, user: req.user };
        if (itemData.type !== 'found') {
            itemData.verificationQuestions = [];
        } else {
            itemData.verificationQuestions = sanitizeVerificationQuestions(itemData.verificationQuestions);
        }

        const newItem = new Item(itemData);
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

// Get notification alerts for the current user
router.get('/notifications', auth, async (req, res) => {
    try {
        const userItems = await Item.find({ user: req.user, status: 'active' });
        const notifications = [];

        for (const item of userItems) {
            const oppositeType = item.type === 'lost' ? 'found' : 'lost';
            const potentialMatches = await Item.find({ type: oppositeType, status: 'active' });
            const matches = findMatches(item, potentialMatches);
            if (matches.length > 0) {
                notifications.push({
                    item,
                    totalMatches: matches.length,
                    topMatches: matches.slice(0, 3)
                });
            }
        }

        res.json({ notifications });
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

// Claim an item
router.post('/:id/claim', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const { claimerItemId } = req.body;
        if (!claimerItemId) return res.status(400).json({ message: 'claimerItemId is required for claims.' });

        const claimerItem = await Item.findById(claimerItemId);
        if (!claimerItem || claimerItem.user.toString() !== req.user) {
            return res.status(400).json({ message: 'Invalid claim report or unauthorized.' });
        }

        if (claimerItem.type === item.type) {
            return res.status(400).json({ message: 'Claim must be made with an opposite-type report.' });
        }

        const alreadyClaimed = item.claims.find(c => c.user.toString() === req.user);
        if (!alreadyClaimed) {
            item.claims.push({
                user: req.user,
                claimerItemId,
                status: 'pending'
            });
            await item.save();
        }

        res.json({ message: 'Claim submitted successfully', item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify security question
router.post('/:id/verify', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (!Array.isArray(req.body.answers)) {
            return res.status(400).json({ message: 'Answers must be provided in an array.', success: false });
        }

        if (!item.verificationQuestions || item.verificationQuestions.length === 0) {
            return res.status(400).json({ message: 'No verification questions are configured for this item.', success: false });
        }

        const claim = item.claims.find(c => c.user.toString() === req.user);
        if (!claim) {
            return res.status(400).json({ message: 'No pending claim found for this user.', success: false });
        }

        const answers = req.body.answers.map(a => (a || '').toString().toLowerCase().trim());
        let allCorrect = item.verificationQuestions.length === answers.length;

        item.verificationQuestions.forEach((q, i) => {
            if (!answers[i] || answers[i] !== (q.answer || '').toLowerCase().trim()) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            claim.status = 'verified';
            item.status = 'matched';
            await item.save();

            if (claim.claimerItemId) {
                const claimerReport = await Item.findById(claim.claimerItemId);
                if (claimerReport) {
                    const finder = await User.findById(claimerReport.user);
                    if (finder) {
                        finder.reputationScore = (finder.reputationScore || 0) + 10;
                        await finder.save();
                    }
                }
            }

            return res.json({ message: 'Verification successful!', success: true });
        }

        res.json({ message: 'Incorrect answers. Please try again.', success: false });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete item

module.exports = router;
