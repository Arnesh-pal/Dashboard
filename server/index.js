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

// This tells Express to trust the headers sent by Vercel's proxy
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Requires https
        httpOnly: true,
        sameSite: 'none', // Required for cross-site cookies
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Register Models & Passport ---
require('./services/passport');

// --- Routes ---
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);
require('./routes/localAuthRoutes')(app);

// --- Server & DB Initialization ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.sequelize.sync({ alter: true });
        console.log("PostgreSQL connected and models synced successfully.");
    } catch (error) {
        console.error("Failed to connect to PostgreSQL:", error);
    }
});
