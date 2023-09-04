const { Product } = require('../../db');

const createProduct = async (product) => {
    try {
        const result = await Product.create({
            name: product.name,
            product_id: product.product_id,
            offer_price: product.offer_price,
            normal_price: product.normal_price,
            url: product.url,
            store: product.store,
            discount: product.discount,
            image_url: product.image_url,
            sent: false
        });
    
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(`Error al crear producto: ${error}`);
    };
};

module.exports = { createProduct };