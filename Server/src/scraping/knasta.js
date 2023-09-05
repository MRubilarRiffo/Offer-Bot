const { sleep } = require('../helpers/sleep');
const { requestsAPI } = require('../helpers/requestsAPI');
const { logMessage } = require('../helpers/logMessage');
const { existingProduct_ } = require('../helpers/existingProduct');

const getKnasta = async () => {
    try {
        const SLEEP_DURATION = 10;
        const BASE_URL = 'https://knasta.cl';

        let total_pages_ = 1;
        let page = 1;
        while (page <= total_pages_) {
            logMessage(`Page: ${page} de ${total_pages_}`);

            const api = `${BASE_URL}/_next/data/8223c0c755711a83aabf91debc5a3fba60bf78b3/es/results.json?knastaday=1&d=-0&page=${page}`;
            
            const data = await requestsAPI(api);

            const { pageProps: { initialData: { total_pages, products } = {} } = {} } = data || {};

            total_pages_ = total_pages;

            if (products.length) {
                for (let product of products) {
                    const id = product.product_id ? `Knasta-${product.product_id}` : null;

                    if (!id) continue;

                    const props = {
                        name: product.title,
                        product_id: id,
                        offer_price: product.current_price,
                        normal_price: product.last_variation_price,
                        url: product.url,
                        store: product.retail,
                        discount: product.percent,
                        image_url: product.image
                    };

                    existingProduct_(existingProduct, props, id, product.current_price);
                };
            };
            
            page++;

            await sleep(SLEEP_DURATION);
        }
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getKnasta };
