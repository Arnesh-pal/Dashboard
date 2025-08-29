// server/models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require('./User.js')(sequelize, Sequelize);
db.Profile = require('./Profile.js')(sequelize, Sequelize);
db.Transaction = require('./Transaction.js')(sequelize, Sequelize);
db.Schedule = require('./Schedule.js')(sequelize, Sequelize);
db.Sale = require('./Sale.js')(sequelize, Sequelize); // New Sale model

// Define associations
db.User.hasMany(db.Profile, { foreignKey: 'userId' });
db.User.hasMany(db.Transaction, { foreignKey: 'userId' });
db.User.hasMany(db.Schedule, { foreignKey: 'userId' });
db.User.hasMany(db.Sale, { foreignKey: 'userId' }); // New Sale association

module.exports = db;