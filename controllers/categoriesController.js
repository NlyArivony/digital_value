const Categories = require('../models/categoriesModel');
const { serializeCategories } = require('../serializers/categoriesSerializer');

// Controller to get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        const serializedCategories = categories.map(serializeCategories);
        res.json(serializedCategories);
    } catch (error) {
        console.error('Error querying the database:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

