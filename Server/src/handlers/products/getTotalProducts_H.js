const { Product } = require('../../db');

const getTotalProducts = async (where) => {
    try {
        if (!where || typeof where !== 'object') {
            throw new Error('El parámetro "where" no es válido.');
        };

        return await Product.count({ where });
    } catch (error) {
        throw new Error('Error al obtener la cantidad total de productos');
    };
};

module.exports = { getTotalProducts };
