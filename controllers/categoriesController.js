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
        .filter((c) => c.parent_id === parentId)
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

        const categoriesWithStructure = categories.map(async (category) => {
            const { id, name } = category;

            const ancestors = await getParentCategories(id);
            const children = getChildrenCategories(categories, id);

            return { id, name, children, ancestors };
        });

        const result = await Promise.all(categoriesWithStructure);
        const serializedCategories = result.map(serializeCategoriesWithStructure);
        res.json(serializedCategories);
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


/*
SELECT rqt1.id, rqt1.name, 
group_concat('( "id": ' || rqt2.id || ', "name": "' || rqt2.name || '" )') AS ancestors
FROM
    (SELECT * FROM categories) AS rqt1
LEFT JOIN
    --get parent name
    (SELECT c3.id, c3.name, c2.descendant_id 
    FROM categories_closure c2 
    LEFT JOIN categories c3 ON c2.ancestor_id = c3.id where c2.ancestor_id != descendant_id 
    ) AS rqt2 
ON rqt1.id = rqt2.descendant_id
where rqt1.id = 250222;
*/
