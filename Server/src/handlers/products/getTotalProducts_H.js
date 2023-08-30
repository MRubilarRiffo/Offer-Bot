const { Product } = require('../../db');
const { whereClause } = require('../../helpers/whereClause');

const getTotalProducts = async (filters) => {
    try {
        const where = await whereClause(filters);

        const totalProducts = await Product.count({
            where: where,
        });

        return totalProducts;
    } catch (error) {
        throw new Error('Error al obtener la cantidad total de productos');
    };
};

module.exports = { getTotalProducts };
