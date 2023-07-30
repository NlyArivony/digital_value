// Serializer function to format categories data for API responses
exports.serializeCategories = (categories) => {
    return {
        id: categories.id,
        name: categories.name
    };
};
