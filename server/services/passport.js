// server/services/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;

// --- Serialize user into the session ---
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// --- Deserialize user out of the session ---
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user) return done(null, false);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// --- Google OAuth Strategy ---
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // IMPORTANT: use full backend URL in production
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
            proxy: true, // trust reverse proxy (Vercel/Render)
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [user] = await User.findOrCreate({
                    where: { googleId: profile.id },
                    defaults: {
                        displayName: profile.displayName,
                        email: profile.emails?.[0]?.value || null,
                        photo: profile.photos?.[0]?.value || null,
                    },
                });
                return done(null, user);
            } catch (err) {
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
                return done(null, false, { message: "Incorrect credentials." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect credentials." });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

module.exports = passport;
