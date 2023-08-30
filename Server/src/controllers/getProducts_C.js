const { getProducts_H } = require('../handlers/products/getProducts_H');
const { getTotalProducts } = require('../handlers/products/getTotalProducts_H');

const getProducts_C = async (req, res, next) => {
    try {
        const productsPerPage = 10;
        const currentPage = req.query.page || 1;
        const filters = {
            name: req.query.name,
            store: req.query.store,
            discount: req.query.discount,
        };

        const sortOrder = req.query.sortOrder || 'asc';

        const selectedFields = req.query.fields ? req.query.fields.split(',') : null;

        const random = req.query.random || false;

        const products = await getProducts_H(currentPage, productsPerPage, filters, sortOrder, selectedFields, random);
        
        if (products.error) {
            res.status(400).send(products.error);
        } else {
            const totalProducts = await getTotalProducts(filters);

            const totalPages = Math.ceil(totalProducts / productsPerPage);

            const response = {
                metadata: {
                    totalProducts: totalProducts,
                    totalPages: totalPages,
                    currentPage: currentPage
                },
                data: products
            };
            res.json(response);
        };
    } catch (error) {
        next(error);
        // res.status(500).json({ error: 'Error al obtener productos' });
    };
};

module.exports = { getProducts_C };