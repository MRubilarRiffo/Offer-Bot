const { Product } = require('../../db');

const createProduct = async (product) => {
    try {
        await Product.create({
            name: product.brand_title,
            product_id: product.product_id,
            first_price: product.last_variation_price,
            last_price: product.current_price,
            url: product.url,
            store: product.retail,
            discount: product.percent,
            image_url: product.image.replace(/\[/g, '%5B').replace(/\]/g, '%5D')
        });
    
        return
    } catch (error) {
        throw new Error('Error al crear producto');
    };
};

module.exports = { createProduct };