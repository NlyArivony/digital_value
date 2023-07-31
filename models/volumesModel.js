const { DataTypes } = require('sequelize');
const sequelize = require('../database');

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
    }
);

module.exports = Volumes;
