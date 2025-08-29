// server/models/Profile.js
module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('profile', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        youtube: DataTypes.STRING,
        instagram: DataTypes.STRING,
    });
    return Profile;
};