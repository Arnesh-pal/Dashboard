// server/index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const db = require('./models');

const app = express();
app.use(express.json());

// --- Middleware: CORS ---
app.use(cors({
    origin: "https://uboard.netlify.app", // ✅ your frontend domain
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow common methods
    allowedHeaders: ["Content-Type", "Authorization"],    // allow axios headers
}));

app.set('trust proxy', 1); // ✅ required behind Vercel/Netlify proxies

// --- Session Config ---
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: true, // ✅ ensure cookies work behind proxies
    cookie: {
        secure: true,          // ✅ cookies only over HTTPS
        httpOnly: true,        // ✅ not accessible by JS
        sameSite: "none",      // ✅ allow cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// --- Passport Middleware ---
app.use(passport.initialize());
app.use(passport.session());

// --- Register Passport & Routes ---
require('./services/passport');
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);
require('./routes/localAuthRoutes')(app);

// --- Database Connection ---
db.sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected successfully.'))
    .catch(err => console.error('Failed to connect to PostgreSQL:', err));

// --- Debug Route (to check session & user) ---
app.get("/api/debug-session", (req, res) => {
    res.json({
        session: req.session,
        user: req.user || null
    });
});

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

// --- Export app for Vercel ---
module.exports = app;
