const { Product } = require('../../db');

const createProduct = async (product) => {
    try {
        const result = await Product.create({
            name: product.name,
            product_id: product.product_id,
            first_price: product.first_price,
            last_price: product.last_price,
            url: product.url,
            store: product.store,
            discount: product.discount,
            image_url: product.image_url
        });
    
        return result;
    } catch (error) {
        throw new Error('Error al crear producto');
    };
};

module.exports = { createProduct };