exports.serializeAverageMonthlyVolume = (category, isLeaf, averageMonthlyVolume) => {
    return {
        category: {
            id: category.id,
            name: category.name,
            isLeaf: isLeaf,
        },
        averageMonthlyVolume: averageMonthlyVolume,
    };
};
