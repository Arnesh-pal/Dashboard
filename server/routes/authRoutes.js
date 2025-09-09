// server/routes/authRoutes.js
const passport = require("passport");

module.exports = (app) => {
    // --- Google OAuth start ---
    app.get(
        "/auth/google",
        passport.authenticate("google", { scope: ["profile", "email"] })
    );

    // --- Google OAuth callback ---
    app.get(
        "/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/login", session: false }),
        (req, res) => {
            // req.user contains { user, token } from passport.js
            const { user, token } = req.user;

            // Redirect frontend with token in query param
            res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
        }
    );

    // --- Local login (email/password) ---
    app.post(
        "/auth/login",
        passport.authenticate("local", { session: false }),
        (req, res) => {
            // req.user contains { user, token } from passport.js
            const { user, token } = req.user;
            res.json({ token, user });
        }
    );
};
