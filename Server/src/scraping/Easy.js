const { existingProduct_ } = require("../helpers/existingProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");
const { sleep } = require("../helpers/sleep");

const PRODUCT_X_PAGE = 40;
const BASE_URL = 'https://www.easy.cl';
const SLEEP_DURATION = 10;

const getEasy = async () => {
    try {
        const categories = [
            "muebles/muebles-de-dormitorio",
        ];

        for (let category of categories) {
            let page = 1;
            let total_pages = 1;

            while (page <= total_pages) {
                logMessage(`${category} | Page: ${page} de ${total_pages}`);
    
                const api = `${BASE_URL}/${category}?__pickRuntime=queryData&page=${page}`;
    
                const data = await requestsAPI(api);

                const productsData = data?.queryData[0]?.data || null;

                const productsParse = typeof productsData === 'string' ? JSON.parse(productsData) : null;

                const products = productsParse?.productSearch?.products || [];

                const totalProducts = productsParse?.productSearch?.recordsFiltered || null;

                total_pages = Math.ceil(totalProducts / PRODUCT_X_PAGE);

                if (products.length) {
                    for (let product of products) {
                        const id = product.productId ? `Easy-${product.productId}` : null;

                        if (!id) continue;

                        const props = {
                            name: product.productName,
                            product_id: id,
                            offer_price: product.priceRange.sellingPrice.lowPrice,
                            normal_price: product.priceRange.listPrice?.lowPrice || null,
                            url: `${BASE_URL}/${product.link}`,
                            store: ['Easy'],
                            discount: Math.round(100-(product.priceRange.sellingPrice.lowPrice * 100 / product.priceRange.listPrice?.lowPrice)) || 0,
                            image_url: product.items[0].images[0].imageUrl
                        };

                        existingProduct_(props, id);
                    };
                };
                page++;

                await sleep(SLEEP_DURATION);
            };
        };
    } catch (error) {
        console.error(`Error: ${error}`);
    };
};

module.exports = { getEasy };