module.exports = (sequelize, DataTypes) => {
    // ✅ 1. Use a capitalized name for the model, which is the standard convention.
    const Schedule = sequelize.define('Schedule', {
        title: {
            type: DataTypes.STRING,
            allowNull: false, // It's good practice to define constraints
        },
        location: {
            type: DataTypes.STRING,
        },
        time: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        },
    }, {
        // ✅ 2. Explicitly tell Sequelize the table name to use in the database.
        tableName: 'schedules',
    });

    return Schedule;
};
