const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const categoriesController = require('./controllers/categoriesController');
const volumesController = require('./controllers/volumesController');

// Swagger configuration
const swaggerDocument = require('./swagger_output.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON data
app.use(express.json());

// Route to get all categories
app.get('/categories', categoriesController.getAllCategories);

// Route to get all categories with trees of parent and children
app.get('/categories/trees', categoriesController.getAllCategoriesWithStructure);

// Route to get the average monthly volumes in the last 24 months of a category
app.get('/categories/:categoryId/average', volumesController.getAverageMonthlyVolume);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
