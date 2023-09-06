const { existingProduct_ } = require("../helpers/existingProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");
const { sleep } = require("../helpers/sleep");


const getJumbo = async () => {
    try {
        const HEADERS = { Apikey: 'WlVnnB7c1BblmgUPOfg' };
        
        const PRODUCT_X_PAGE = 40;
        const BASE_URL = 'https://sm-web-api.ecomm.cencosud.com';
        const SLEEP_DURATION = 10;
        
        const categories = [
            "lacteos",
            "despensa",
            "frutas-y-verduras",
            "limpieza",
            "carniceria",
            "botilleria",
            "mascotas"
        ];

        for (let categorie of categories) {
            let page = 1;
            let total_pages = 1;

            while (page <= total_pages) {
                logMessage(`${categorie} | Page: ${page} de ${total_pages}`);
    
                const api = `${BASE_URL}/catalog/api/v4/products/${categorie}?s=promotion%3Ayes&page=${page}`
    
                const data = await requestsAPI(api, HEADERS);

                const products = data?.products;

                total_pages = Math.ceil(data?.recordsFiltered / PRODUCT_X_PAGE);

                if (products.length) {
                    for (let product of products) {
                        const id = product.productId ? `Jumbo-${product.productId}` : null;

                        if (!id) continue;

                        const props = {
                            name: product.productName,
                            product_id: id,
                            offer_price: product.items[0].sellers[0].commertialOffer.Price,
                            normal_price: product.items[0].sellers[0].commertialOffer.ListPrice,
                            url: `https://www.jumbo.cl/${product.linkText}/p`,
                            store: [product.items[0].sellers[0].sellerName],
                            discount: Math.round(100-(product.items[0].sellers[0].commertialOffer.Price * 100 / product.items[0].sellers[0].commertialOffer.ListPrice)),
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

module.exports = { getJumbo };