const { getTotalProducts } = require("../handlers/products/getTotalProducts_H");
const { createMessageHTML } = require("../helpers/createMessageHTML");
const { existingProduct_ } = require("../helpers/existingProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");


const BASE_URL = 'https://www.adidas.cl';
const MARKET = 'Adidas';
const HEADERS = {
    'Accept-Language': 'es-ES,es;q=0.9',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    Accept: '*/*',
    Connection: 'keep-alive'
};

const getAdidas = async () => {
    try {
        const countProducts = await getTotalProducts({ market: MARKET });

        let start = 0;
        let count = 1;
        while (start <= count) {
            logMessage(`${MARKET} | Product: ${start} of ${count}`);

            const api = `${BASE_URL}/api/plp/content-engine?query=outlet&start=${start}`;
            
            const data = await requestsAPI(api, HEADERS);

            count = data?.raw?.itemList?.count || null;
            const products = data?.raw?.itemList?.items || null;

            if (countProducts === count) break;

            if (products.length) {
                for (let product of products) {
                    const id = product.productId ? `${MARKET}-${product.productId}` : null;
                    
                    if (!id) continue;

                    const props = createMessageHTML(
                        product.altText,
                        [MARKET],
                        product.price,
                        product.salePrice,
                        Math.round(100 - (product.salePrice * 100 / product.price)),
                        `${BASE_URL}${product.link}`,
                        id,
                        product.image.src,
                        MARKET
                    );

                    await existingProduct_(props, id);
                }
            };
            start += 48
        };
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getAdidas };