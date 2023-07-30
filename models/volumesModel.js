const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Import the Sequelize connection

const Volumes = sequelize.define(
    'volumes', // Model name
    {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        volume: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'volumes', // Actual table name
        timestamps: false,
        // Optional: Add indexes if needed
        // indexes: [
        //   {
        //     unique: false,
        //     fields: ['category_id', 'date'],
        //   },
        // ],
    }
);

module.exports = Volumes;