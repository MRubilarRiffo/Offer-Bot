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
        
        let total_pages_ = 1;
        let page = 1;
        while (page <= total_pages_) {
            logMessage(`Kanasta | Page: ${page} of ${total_pages_}`);

            const api = `${BASE_URL}/_next/data/8223c0c755711a83aabf91debc5a3fba60bf78b3/es/results.json?knastaday=1&d=-0&page=${page}`;
            
            const data = await requestsAPI(api);

            const { pageProps: { initialData: { total_pages, products, count } = {} } = {} } = data || {};

            total_pages_ = total_pages;

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