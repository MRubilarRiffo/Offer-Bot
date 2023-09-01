const { Product } = require('../../db');

const updateProduct_H = async (props, id) => {
    try {
        const result = await Product.update(props, {
            where: { product_id: id }
        });

        return result;
    } catch (error) {
        throw new Error(`Error updating product: ${error}`);
    };
};

module.exports = { updateProduct_H };