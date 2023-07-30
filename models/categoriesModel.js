const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Categories = sequelize.define(
    'categories',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: 'categories', // Replace 'your_table_name' with the actual table name
        timestamps: false, // Set this to true if you have created_at and updated_at columns in the table
    }
);

module.exports = Categories;