const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const categoriesController = require('./controllers/categoriesController');

// Swagger configuration
const swaggerDocument = require('./swagger_output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON data
app.use(express.json());

// Route to get all categories
app.get('/api/categories', categoriesController.getAllCategories);

// Route to get all categories
app.get('/api/categoriesTrees', categoriesController.getAllCategoriesWithStructure);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
