const { Op } = require('sequelize');
const Volumes = require('../models/volumesModel');
const Categories = require('../models/categoriesModel');
const CategoriesClosure = require('../models/categoriesClosureModel');


// Helper function to check if a category is a leaf (has no children)
const isLeafCategory = async (categoryId) => {
    const closure = await CategoriesClosure.findOne({
        where: { descendant_id: categoryId },
    });
    return closure === null;
};

// Helper function to calculate the average of an array of numbers
const calculateAverage = (values) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
};

// Helper function to get the average monthly volume for all categories in the last 24 months
const getAverageMonthlyVolume = async (categoryId) => {
    // Get the current date and 24 months ago from the current date
    const currentDate = new Date();
    const twentyFourMonthsAgo = new Date();
    twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);

    // Fetch volumes data for the specified category and its descendants in the last 24 months
    const volumesData = await Volumes.findAll({
        where: {
            category_id: categoryId,
            date: {
                [Op.between]: [twentyFourMonthsAgo, currentDate],
            },
        },
        attributes: ['volume'],
    });

    // Extract the volumes from the data
    const volumes = volumesData.map((data) => data.volume);

    // Calculate the average
    const averageMonthlyVolume = calculateAverage(volumes);

    return Math.round(averageMonthlyVolume);
};

exports.getAverageMonthlyVolume = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

        // Fetch the category from the database by its ID
        const category = await Categories.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const isLeaf = await isLeafCategory(categoryId);

        const averageMonthlyVolume = await getAverageMonthlyVolume(categoryId);

        res.json({
            category: {
                id: categoryId,
                name: category.name, // Use the actual name of the category fetched from the database
                // isLeaf,
            },
            averageMonthlyVolume,
        });
    } catch (error) {
        console.error('Error querying the database:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


/*
---------------------------------------------------
-- leaf categories calculation, (calculate with the sum of children volume) 
select rqt1.id, rqt1.name, sum(rqt2.volume) as result  FROM
(
-- find leaf categories => children is not null, (get the child id)
SELECT
    c1.id AS id,
    c1.name AS name,
     -- GROUP_CONCAT('( "id": ' || c2.id || ', "name": "' || c2.name || '" )') AS children
     c2.id  as child_id
FROM
    categories c1
LEFT JOIN
    categories c2 ON c1.id = c2.parent_id
WHERE child_id is not null
) rqt1
LEFT JOIN
(
-- get the volume from volumes
SELECT category_id, volume
FROM volumes
WHERE date BETWEEN date('now', '-24 months') AND date('now') 
ORDER BY date DESC
) rqt2 on rqt1.child_id =  rqt2.category_id

--WHERE id=274714  -- change
GROUP BY rqt1.id

---------------------------------------------------
-- non leaf calculation, (calculate average) 
select rqt1.id, rqt1.name, avg(rqt2.volume) as result FROM
(
-- find non leaf id => children is null
    SELECT
        c1.id AS id,
        c1.name AS name,
         c2.id  AS child_id
    FROM
        categories c1
    LEFT JOIN
        categories c2 ON c1.id = c2.parent_id
    WHERE C2.id is null
    GROUP BY
        c1.id, c1.name
) rqt1

LEFT JOIN

(-- get the volume from volumes
SELECT category_id, volume
FROM volumes
WHERE date BETWEEN date('now', '-24 months') AND date('now') 
ORDER BY date DESC) rqt2 on rqt1.id =  rqt2.category_id

where rqt1.id = 250301 -- change
GROUP BY rqt1.id
*/
