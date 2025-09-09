// server/routes/localAuthRoutes.js

const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 👈 1. Import the JWT library
const db = require('../models');
const User = db.User;

// Function to generate a JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email }, // This is the data stored in the token
        process.env.JWT_SECRET, // The secret key from your .env file
        { expiresIn: '1d' } // Token will expire in 1 day
    );
};

module.exports = app => {
    // Registration Route
    app.post('/auth/register', async (req, res) => {
        const { email, password, displayName } = req.body;
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(422).send({ error: 'Email is already in use.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                password: hashedPassword,
                displayName: displayName || email.split('@')[0]
            });

            // ✅ 2. After registering, create a token and send it back
            const token = generateToken(user);
            res.send({ token });

        } catch (err) {
            console.error("Registration Error:", err);
            res.status(500).send({ error: 'Registration failed.' });
        }
    });

    // Local Login Route
    app.post('/api/login', passport.authenticate('local', { session: false }), (req, res) => {
        // ✅ 3. If passport authentication succeeds, create a token and send it
        const token = generateToken(req.user);
        res.send({ token });
    });
};