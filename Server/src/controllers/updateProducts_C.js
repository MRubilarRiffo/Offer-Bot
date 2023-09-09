const { updateProduct_H } = require("../handlers/products/updateProducts_H");

const updateProduct_C = async (req, res, next) => {
    try {
        const sent = req.body;
        const { id } = req.params;

        const result = await updateProduct_H(sent, { product_id: id })

        if (result.error) {
            res.status(400).send(result.error);
        } else {
            const response = {
                message: `Product with id: ${id} updated successfully`
            };
            
            res.json(response);
        };
    } catch (error) {
        next(error)
    };
};

module.exports = { updateProduct_C };