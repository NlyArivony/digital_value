// Base serializer function to format categories data for API responses
const baseSerializeCategories = (category) => {
    return {
        id: category.id,
        name: category.name,
    };
};

// Serializer function to format categories with children and ancestors for API responses
const serializeCategoriesWithStructure = (category) => {
    const serializedCategory = baseSerializeCategories(category);

    if (category.ancestors) {
        serializedCategory.ancestors = category.ancestors.map((ancestor) => ({
            id: ancestor.id,
            name: ancestor.name,
        }));
    }

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
    serializeCategoriesWithStructure: serializeCategoriesWithStructure,
};
