const passport = require('passport');
const jwt = require('jsonwebtoken');

// Function to generate a JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = app => {
    // This route starts the Google OAuth flow
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'], // The permissions we ask from Google
            session: false
        })
    );

    // This is the callback route Google redirects to after the user approves
    app.get(
        '/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: `${process.env.FRONTEND_URL}/login`, // Redirect to login on failure
            session: false
        }),
        (req, res) => {
            // If authentication is successful, passport attaches the user to req.user
            const token = generateToken(req.user);

            // ✅ FIX: Redirect to a special frontend route with the token in the URL
            res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
        }
    );

    // Logout Route
    app.get('/api/logout', (req, res) => {
        req.logout(); // This is a passport function
        res.redirect(process.env.FRONTEND_URL || '/');
    });
};
