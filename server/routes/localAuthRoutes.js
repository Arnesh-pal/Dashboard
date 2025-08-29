// server/routes/localAuthRoutes.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;

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
            // Log the user in immediately after registration
            req.login(user, (err) => {
                if (err) return res.status(500).send(err);
                res.send(user);
            });
        } catch (err) {
            res.status(500).send({ error: 'Registration failed.' });
        }
    });

    // Local Login Route
    app.post('/auth/login', passport.authenticate('local'), (req, res) => {
        res.send(req.user); // Send back the logged-in user
    });
};