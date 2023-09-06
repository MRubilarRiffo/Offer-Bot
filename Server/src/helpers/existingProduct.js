const { updateProduct_H } = require("../handlers/products/updateProducts_H");
const { createProduct } = require("../handlers/store requests/createProduct");
const { getProduct } = require("../handlers/store requests/getProduct");
const { logMessage } = require("./logMessage");

const existingProduct_ = async (props, id) => {
    const existingProduct = await getProduct(id);

    if (!existingProduct) {
        const result = await createProduct(props);
        if (result) logMessage(`El producto con id: ${id} se creó exitosamente.`)
    } else {
        logMessage(`El producto con id: ${id} ya existe.`);
        if (parseInt(props.offer_price) !== existingProduct.offer_price) {
            logMessage(`El producto con id: ${id} cambió de precio.`);
            const result = await updateProduct_H(props, id);
            if (result) logMessage(`El producto con id: ${id} fue actualizado.`);
        };
    };
};

module.exports = { existingProduct_ };