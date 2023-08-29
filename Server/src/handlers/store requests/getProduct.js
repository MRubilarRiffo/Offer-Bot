const { Product } = require('../../db');

const getProduct = async (id) => {
    try {
        const product = await Product.findOne({
            where: {
                product_id: id
            }
        });
    
        return product;
    } catch (error) {
        throw new Error('Error al obtener productos');
    };
};

module.exports = { getProduct };