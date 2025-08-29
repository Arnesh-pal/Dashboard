// server/models/Sale.js
module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('sale', {
        productName: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    });
    return Sale;
};