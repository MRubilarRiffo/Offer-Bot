const { requestsAPI } = require('../helpers/requestsAPI');
const { logMessage } = require('../helpers/logMessage');
const { existingProduct_ } = require('../helpers/existingProduct');
const { createMessageHTML } = require('../helpers/createMessageHTML');
const { getTotalProducts } = require('../handlers/products/getTotalProducts_H');

const BASE_URL = 'https://knasta.cl';
const MARKET = 'Knasta'

const getKnasta = async () => {
    try {
        const countProducts = await getTotalProducts({ market: MARKET });
        
        let totalPages = 1;
        let page = 1;
        while (page <= totalPages) {
            logMessage(`Kanasta | Page: ${page} of ${totalPages}`);

            const api = `${BASE_URL}/_next/data/197f4d1f7608fdf96f146b11b2e4203002700ea5/es/results.json?knastaday=1&d=-0&page=${page}`;
            
            const data = await requestsAPI(api);

            const { pageProps: { initialData: { total_pages, products, count } = {} } = {} } = data || {};

            totalPages = total_pages;

            if (countProducts === count) break;

            if (products.length) {
                for (let product of products) {
                    const id = product.product_id ? `Knasta-${product.product_id}` : null;

                    if (!id || !product.url) continue;

                    const props = createMessageHTML(
                        product.title,
                        product.retail,
                        product.last_variation_price,
                        product.current_price,
                        product.percent * -1,
                        product.url,
                        id,
                        product.image,
                        MARKET
                    );

                    await existingProduct_(props, id);
                };
            };
            page++;
        };
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getKnasta };