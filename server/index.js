// server/index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const db = require('./models');

const app = express();
app.use(express.json());

// --- Middleware ---
app.use(cors({
    origin: "https://uboard.netlify.app", // Your Netlify frontend URL
    credentials: true,
}));

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Register Models, Passport, and Routes ---
require('./services/passport');
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);
require('./routes/localAuthRoutes')(app);

// --- Database Connection (runs on first request) ---
db.sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected successfully.'))
    .catch(err => console.error('Failed to connect to PostgreSQL:', err));

// --- EXPORT THE APP FOR VERCEL ---
// We no longer need app.listen() because Vercel handles the server lifecycle.
module.exports = app;