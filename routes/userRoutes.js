const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Show all users (Home page)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { users: users });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Show add user form
router.get('/add', (req, res) => {
    res.render('add');
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
        res.render('edit', { user: user });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Update user
router.put('/update/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        
        user.name = req.body.name;
        user.email = req.body.email;
        user.age = req.body.age;
        
        await user.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).render('error', { message: err.message });
    }
});

// Delete user
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        await User.deleteOne({ _id: req.params.id });
        res.redirect('/');
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

module.exports = router;
