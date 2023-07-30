const Categories = require('../models/categoriesModel');
const { serializeCategories, serializeCategoriesWithChildren } = require('../serializers/categoriesSerializer');

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

// Controller to get all categories in the desired structure
exports.getAllCategoriesWithStructure = async (req, res) => {
    try {
        const categories = await Categories.findAll();

        const categoriesWithChildren = categories.map((category) => {
            const { id, name } = category;
            const children = categories
                .filter((c) => c.parent_id === id)
                .map((child) => ({ id: child.id, name: child.name }));

            return { id, name, children };
        });

        const serializedCategoriesWithChildren = categoriesWithChildren.map(serializeCategoriesWithChildren);

        res.json(serializedCategoriesWithChildren);
    } catch (error) {
        console.error('Error querying the database:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/*
SELECT
    c1.id AS id,
    c1.name AS name,
     GROUP_CONCAT('( "id": ' || c2.id || ', "name": "' || c2.name || '" )') AS children
FROM
    categories c1
LEFT JOIN
    categories c2 ON c1.id = c2.parent_id
GROUP BY
    c1.id, c1.name;
*/
