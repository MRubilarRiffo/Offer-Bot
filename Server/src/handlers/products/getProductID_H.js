const { Product } = require('../../db');

const getProductID_H = async (id) => {
    try {
        return await Product.findOne({
            where: {
                product_id: id
            }
        });
    } catch (error) {
        throw new Error('Error al obtener productos');
    };
};

module.exports = { getProductID_H };