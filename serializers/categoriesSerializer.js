// Serializer function to format categories data for API responses
exports.serializeCategories = (categories) => {
    return {
        id: categories.id,
        name: categories.name
    };
};

// Serializer function to format categories with children for API responses
exports.serializeCategoriesWithChildren = (category) => {
    const { id, name, children } = category;
    return {
        id,
        name,
        children: children.map((child) => ({ id: child.id, name: child.name })),
    };
};
