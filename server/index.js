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
// ✅ Allow Netlify frontend
app.use(cors({
  origin: "https://uboard.netlify.app",  // frontend URL
  credentials: true,                      // allow cookies/sessions
}));

app.use(session({
    secret: process.env.COOKIE_KEY || 'averysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // only https in prod
        httpOnly: true,
        sameSite: 'none', // allow cross-site (Render <-> Netlify)
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
        // Using { alter: true } will update the database tables to match the models
        // It's useful for development but be cautious in production
        await db.sequelize.sync({ alter: true });
        console.log("PostgreSQL connected and models synced successfully.");
    } catch (error) {
        console.error("Failed to connect to PostgreSQL:", error);
    }
});
