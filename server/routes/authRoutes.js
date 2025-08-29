const passport = require('passport');
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('${CLIENT_URL}/dashboard'); // Redirect to the dashboard after login
        }
    );

    app.get('/api/logout', (req, res, next) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            // Redirect to the frontend's home page after logout
            res.redirect(`${CLIENT_URL}/`);
        });
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
