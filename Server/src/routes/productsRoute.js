const productsRoutes = require('express').Router();

const { getProducts_C } = require('../controllers/getProducts_C');

productsRoutes.get('/', getProducts_C);

module.exports = productsRoutes;