const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => done(null, user));
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // This logic is now simplified to only find or create the user.
        // Default data will be created by the API routes on demand.
        const [user] = await User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                displayName: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value
            }
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Local Email/Password Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email: email } });
            if (!user || !user.password) {
                return done(null, false, { message: 'Incorrect credentials.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect credentials.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));