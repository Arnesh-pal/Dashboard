// server/models/Schedule.js
module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('schedule', {
        title: DataTypes.STRING,
        location: DataTypes.STRING,
        time: DataTypes.STRING,
        date: DataTypes.DATE,
    });
    return Schedule;
};