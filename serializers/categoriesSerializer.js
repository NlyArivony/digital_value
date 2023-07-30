// Base serializer function to format categories data for API responses
const baseSerializeCategories = (category) => {
    return {
        id: category.id,
        name: category.name,
    };
};

// Serializer function to format categories with children for API responses
const serializeCategoriesWithChildren = (category) => {
    const serializedCategory = baseSerializeCategories(category);

    if (category.children) {
        serializedCategory.children = category.children.map((child) => ({
            id: child.id,
            name: child.name,
        }));
    }

    return serializedCategory;
};

module.exports = {
    serializeCategories: baseSerializeCategories,
    serializeCategoriesWithChildren: serializeCategoriesWithChildren,
};
