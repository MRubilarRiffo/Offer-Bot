const { updateProduct_H } = require("../handlers/products/updateProducts_H");
const { createProduct_H } = require("../handlers/products/createProduct_H");
const { getProductID_H } = require("../handlers/products/getProductID_H");
const { logMessage } = require("./logMessage");

const existingProduct_ = async (props, id) => {
    const existingProduct = await getProductID_H(id);

    if (!existingProduct) {
        const result = await createProduct_H(props);
        
        if (result) logMessage(`El producto id: ${id} se creó exitosamente.`)
    } else {
        logMessage(`El producto id: ${id} ya existe.`);

        if (parseInt(props.offer_price) !== existingProduct.offer_price) {
            const where = { product_id: id }

            const result = await updateProduct_H(props, where);
            
            if (result) logMessage(`El producto id: ${id} fue actualizado de precio.`);
        };
    };
};

module.exports = { existingProduct_ };