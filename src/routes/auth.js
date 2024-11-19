const express = require('express');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");



const router = express.Router();





router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password:hashedpassword });
        res.json(user);

    } catch (err) {
        res.json(err);
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        else{
            return res.json( 'Success' );
        }

        

    
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});




module.exports = router;