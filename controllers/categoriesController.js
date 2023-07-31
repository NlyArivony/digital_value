const Categories = require('../models/categoriesModel');
const CategoriesClosure = require('../models/categoriesClosureModel');
const {
    serializeCategories,
    serializeCategoriesWithStructure,
} = require('../serializers/categoriesSerializer');

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

// Helper function to get the children categories for a given parent id
const getChildrenCategories = (categories, parentId) => {
    return categories
        .filter((category) => category.parent_id === parentId)
        .map((child) => ({ id: child.id, name: child.name }));
};

// Helper function to get the parent categories for a given category id
const getParentCategories = async (categoryId) => {
    const ancestorsData = await Categories.findAll({
        include: [
            {
                model: CategoriesClosure,
                as: 'ancestor',
                where: { descendant_id: categoryId },
                attributes: [],
            },
        ],
        attributes: ['id', 'name'],
    });

    // Filter out the category with the same ID as the current category
    const filteredAncestors = ancestorsData.filter(
        (ancestor) => ancestor.id !== categoryId
    );

    return filteredAncestors;
};

// Controller to get all categories with trees of parent and children
exports.getAllCategoriesWithStructure = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        const categoriesWithStructure = await Promise.all(
            categories.map(async (category) => {
                const { id, name } = category;
                const ancestors = await getParentCategories(id);
                const children = getChildrenCategories(categories, id);
                return { id, name, children, ancestors };
            })
        );

        const serializedCategories = categoriesWithStructure.map(
            serializeCategoriesWithStructure
        );

        res.json(serializedCategories);
    } catch (error) {
        console.error('Error querying the database:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
