const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Categories = require('./categoriesModel');

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
Categories.hasMany(CategoriesClosure, { foreignKey: 'ancestor_id', sourceKey: 'id', as: 'ancestor' });
Categories.hasMany(CategoriesClosure, { foreignKey: 'descendant_id', sourceKey: 'id', as: 'descendant' });

Categories.belongsToMany(Categories, {
    through: CategoriesClosure,
    foreignKey: 'ancestor_id',
    as: 'ancestor_',
    otherKey: 'descendant_id',
});
Categories.belongsToMany(Categories, {
    through: CategoriesClosure,
    foreignKey: 'descendant_id',
    as: 'descendant_',
    otherKey: 'ancestor_id',
});

module.exports = CategoriesClosure;
