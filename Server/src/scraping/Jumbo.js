const { createMessageHTML } = require("../helpers/createMessageHTML");
const { existingProduct_ } = require("../helpers/existingProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");

const HEADERS = { Apikey: 'WlVnnB7c1BblmgUPOfg' };

const PRODUCT_X_PAGE = 40;
const BASE_URL = 'https://sm-web-api.ecomm.cencosud.com';
const MARKET = 'Jumbo';

const getJumbo = async () => {
    try {
        
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
                const totalProducts = data?.recordsFiltered;

                total_pages = Math.ceil(totalProducts / PRODUCT_X_PAGE);

                if (products.length) {
                    for (let product of products) {
                        const id = product.productId ? `Jumbo-${product.productId}` : null;

                        if (!id) continue;

                        const props = createMessageHTML(
                            product.productName,
                            [MARKET],
                            product.items[0].sellers[0].commertialOffer.Price,
                            product.items[0].sellers[0].commertialOffer.ListPrice,
                            Math.round(100-(product.items[0].sellers[0].commertialOffer.Price * 100 / product.items[0].sellers[0].commertialOffer.ListPrice)),
                            `https://www.jumbo.cl/${product.linkText}/p`,
                            id,
                            product.items[0].images[0].imageUrl,
                            MARKET
                        );

                        await existingProduct_(props, id);
                    };
                };
                page++;
            };
        };
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getJumbo };