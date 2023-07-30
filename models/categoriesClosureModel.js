const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

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
        timestamps: false
    }
);

// Define the association between CategoriesClosure and Categories
const Categories = require('./categoriesModel');
Categories.hasMany(CategoriesClosure, { foreignKey: 'ancestor_id', sourceKey: 'id', as: 'ancestor' });
Categories.hasMany(CategoriesClosure, { foreignKey: 'descendant_id', sourceKey: 'id', as: 'descendant' });

module.exports = CategoriesClosure;
