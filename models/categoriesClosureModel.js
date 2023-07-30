const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Import the Sequelize connection

const CategoriesClosure = sequelize.define(
    'categories_closure', // Model name
    {
        ancestor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        descendant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'categories_closure', // Actual table name
        timestamps: false,
        // Optional: Add indexes if needed
        // indexes: [
        //     {
        //         unique: false,
        //         fields: ['ancestor_id', 'descendant_id'],
        //     },
        // ],
    }
);

module.exports = CategoriesClosure;