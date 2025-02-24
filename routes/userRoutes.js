const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Display all users (Home page)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { users });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Add new user
router.post('/add', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        await user.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).render('error', { message: err.message });
    }
});

// Show edit form
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        res.render('edit', { user });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Update user
router.post('/update/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        res.redirect('/');
    } catch (err) {
        res.status(400).render('error', { message: err.message });
    }
});

// Delete user
router.post('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

module.exports = router;
