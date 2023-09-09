const { Product } = require('../../db');

const updateProduct_H = async (props, where) => {
    try {
        if (!where || typeof where !== 'object') {
            throw new Error('El parámetro "where" no es válido.');
        };

        return await Product.update(props, { where });
    } catch (error) {
        throw new Error(`Error al actualizar producto: ${error}`);
    };
};

module.exports = { updateProduct_H };