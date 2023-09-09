const { getProducts_H } = require('../handlers/products/getProducts_H');
const { getTotalProducts } = require('../handlers/products/getTotalProducts_H');
const { whereClause } = require('../helpers/whereClause');

const getProducts_C = async (req, res, next) => {
    try {
        const productsPerPage = 10;
        const currentPage = req.query.page || 1;
        const filters = {
            name: req.query.name,
            store: req.query.store,
            discount: req.query.discount,
            minDiscount: req.query.minDiscount,
            maxDiscount: req.query.maxDiscount,
            sent: req.query.sent
        };

        const sortOrder = req.query.sortOrder || 'asc';

        const selectedFields = req.query.fields ? req.query.fields.split(',') : null;

        const products = await getProducts_H(currentPage, productsPerPage, filters, sortOrder, selectedFields);
        
        if (products.error) {
            res.status(400).send(products.error);
        } else {
            const where = whereClause(filters)

            const totalProducts = await getTotalProducts(where);

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
    };
};

module.exports = { getProducts_C };