// server/services/passport.js
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

// --- Google OAuth Strategy ---
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [user] = await User.findOrCreate({
                    where: { googleId: profile.id },
                    defaults: {
                        displayName: profile.displayName,
                        email: profile.emails?.[0]?.value || `${profile.id}@google-oauth.local`,
                        photo: profile.photos?.[0]?.value || null,
                    },
                });

                // Sign JWT instead of using session
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                return done(null, { user, token });
            } catch (err) {
                console.error("Google OAuth Error:", err);
                return done(err, null);
            }
        }
    )
);

// --- Local Email/Password Strategy ---
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user || !user.password) {
                return done(null, false, { message: "Invalid credentials." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Invalid credentials." });
            }

            // Sign JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return done(null, { user, token });
        } catch (err) {
            console.error("Local Auth Error:", err);
            return done(err);
        }
    })
);

module.exports = passport;
