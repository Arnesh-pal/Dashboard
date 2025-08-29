// server/models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        googleId: { type: DataTypes.STRING, unique: true, allowNull: true },
        displayName: DataTypes.STRING,
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        photo: DataTypes.STRING,
        password: { type: DataTypes.STRING, allowNull: true }, // For local auth
    });
    return User;
};