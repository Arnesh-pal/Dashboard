// server/models/index.js

require('dotenv').config();
const { Sequelize } = require('sequelize');

// ✅ Safer debug logging
if (process.env.NODE_ENV !== "production") {
    console.log("Connecting to DB Host:", process.env.DATABASE_URL?.split("@")[1]);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false,
    // --- THIS IS THE FIX ---
    // Apply SSL settings for all environments because your database requires it.
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // This is often required for cloud databases
        },
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- Load Models ---
db.User = require('./User.js')(sequelize, Sequelize);
db.Profile = require('./Profile.js')(sequelize, Sequelize);
db.Transaction = require('./Transaction.js')(sequelize, Sequelize);
db.Schedule = require('./Schedule.js')(sequelize, Sequelize);
db.Sale = require('./Sale.js')(sequelize, Sequelize);

// --- Associations ---

// One-to-Many
db.User.hasMany(db.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.User.hasMany(db.Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.User.hasMany(db.Schedule, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.User.hasMany(db.Sale, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Reverse relations (Many-to-One)
db.Profile.belongsTo(db.User, { foreignKey: 'userId' });
db.Transaction.belongsTo(db.User, { foreignKey: 'userId' });
db.Schedule.belongsTo(db.User, { foreignKey: 'userId' });
db.Sale.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;