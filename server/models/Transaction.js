// server/models/Transaction.js
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        description: DataTypes.STRING,
        amount: DataTypes.FLOAT,
        type: DataTypes.ENUM('income', 'expense'),
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    });
    return Transaction;
};