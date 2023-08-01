const { Op } = require('sequelize');
const Volumes = require('../models/volumesModel');
const Categories = require('../models/categoriesModel');
const CategoriesClosure = require('../models/categoriesClosureModel');
const { serializeAverageMonthlyVolume } = require('../serializers/volumesSerializer');

// Helper function to check if a category is a leaf (has a parent_id)
const isNonLeafCategory = async (categoryId) => {
    const closure = await CategoriesClosure.findOne({
        where: { ancestor_id: categoryId, descendant_id: { [Op.ne]: categoryId } },
    });
    return closure === null;
};

// Helper function to calculate the average of an array of numbers
const calculateAverage = (values) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
};

// Helper function to get the average monthly volume for a category and its descendants from past months to now()
const getAverageMonthlyVolume = async (categoryId, monthsAgo, currentDate) => {
    // Fetch all descendants' IDs using the closure table
    const descendants = await CategoriesClosure.findAll({
        where: { ancestor_id: categoryId },
    });
    const descendantIds = descendants.map((descendant) => descendant.descendant_id);

    // Include the current category ID as well
    descendantIds.push(categoryId);

    // Get the volumes data for all descendants in the last 24 months
    const volumesData = await Volumes.findAll({
        where: {
            category_id: {
                [Op.in]: descendantIds,
            },
            date: {
                [Op.between]: [monthsAgo, currentDate],
            },
        },
        attributes: ['volume'],
    });

    // Extract the volumes from the data
    const volumes = volumesData.map((data) => data.volume);

    // Calculate averageVolume
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

        // Get the current date and 24 months ago from the current date
        const currentDate = new Date();
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - 24);

        const isLeaf = !(await isNonLeafCategory(categoryId));
        const averageMonthlyVolume = await getAverageMonthlyVolume(
            categoryId,
            monthsAgo.toISOString(),
            currentDate.toISOString()
        );

        const result = serializeAverageMonthlyVolume(category, isLeaf, averageMonthlyVolume);

        res.json(result);
    } catch (error) {
        console.error('Error querying the database:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
