require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const db = require('./models');

const app = express();

// --- MIDDLEWARE SETUP ---

// 1. IMPORTANT: JSON body parser. This MUST come before your routes.
// This line is what allows your server to read the data from the forms.
app.use(express.json());

// 2. CORS Configuration to allow requests from your frontend
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://uboard.netlify.app',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// 3. Passport Middleware (for Google OAuth)
app.use(passport.initialize());
require('./services/passport');


// --- ROUTES ---
// We apply the routes after all the middleware is correctly set up.
require('./routes/authRoutes')(app);
require('./routes/localAuthRoutes')(app);
require('./routes/apiRoutes')(app);


// --- DATABASE CONNECTION ---
db.sequelize.authenticate()
    .then(() => console.log('✅ PostgreSQL connected successfully.'))
    .catch(err => console.error('❌ Failed to connect to PostgreSQL:', err));

db.sequelize.sync({ alter: true }) // Use { force: true } if you need a clean start
    .then(() => console.log('🔄 Database schema synced.'))
    .catch(err => console.error('❌ Failed to sync database schema:', err));


// --- ROOT ROUTE ---
app.get('/', (req, res) => res.send('Backend is running 🚀'));


// --- START SERVER ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
