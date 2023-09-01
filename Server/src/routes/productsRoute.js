const productsRoutes = require('express').Router();

const { getProducts_C } = require('../controllers/getProducts_C');
const { updateProduct_C } = require('../controllers/updateProducts_C');

productsRoutes.get('/', getProducts_C);
productsRoutes.post('/:id', updateProduct_C);

module.exports = productsRoutes;