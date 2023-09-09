const { Op } = require('sequelize');
const { logMessage } = require("./logMessage");
const { updateProduct_H } = require('../handlers/products/updateProducts_H');

const verifyProduct = async () => {
    logMessage('Verificando productos...')
    try {
        const currentDateSeconds = Math.floor(Date.now() / 1000);

        const props = {
            sent: false,
        };

        const where = {
            publishing_time: {
                [Op.lt]: currentDateSeconds,
            },
        };

        await updateProduct_H(props, where);
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { verifyProduct };