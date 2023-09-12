const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");
const { existingProduct_ } = require("../helpers/existingProduct");
const { sleep } = require("../helpers/sleep");
const { threadSelector } = require("../helpers/threadSelector");
const { createMessageHTML } = require("../helpers/createMessageHTML");
const cheerio = require('cheerio');
const { getTotalProducts } = require("../handlers/products/getTotalProducts_H");

const BASE_URL = 'https://www.unimarc.cl'
const PRODUCT_X_PAGE = 50;
const SLEEP_DURATION = 10;
const MARKET = 'Unimarc';

const CATEGORIES = [
    "carnes",
    "frutas-y-verduras",
    "lacteos-huevos-y-refrigerados",
    "quesos-y-fiambres",
    "panaderia-y-pasteleria",
    "congelados",
    "despensa",
    "desayuno-y-dulces",
    "bebidas-y-licores",
    "limpieza",
    "perfumeria",
    "bebes-y-ninos",
    "mascotas",
    "hogar"
];

const fetchAndAnalyzeURL = async () => {
    try {
        const html = await requestsAPI(BASE_URL);
        const $ = cheerio.load(html);

        const regex = /_buildManifest\.js/;

        let foundSrc = null;

        $('script').each((index, element) => {
            const src = $(element).attr('src');
            if (src && regex.test(src)) {
                foundSrc = src.split('/');
                return false; 
            };
        });
        
        return foundSrc[3];
    } catch (error) {
        logMessage(`Error al hacer la solicitud: ${error}`);
    };
};

const getUnimarc = async () => {
    try {
        const KEY = await fetchAndAnalyzeURL();

        const countProducts = await getTotalProducts({ market: MARKET });

        for (let category of CATEGORIES) {
            let total_pages = 1;
            let page = 1;
            while (page <= total_pages) {
                logMessage(`${category} | Page: ${page} of ${total_pages}`);
    
                const api = `${BASE_URL}/_next/data/${KEY}/category/${category}.json?page=${page}`;

                const data = await requestsAPI(api);
    
                const { pageProps: { dehydratedState: { queries: [ { state: { data: { data: { availableProducts, resource } = {} } = {} } = {} } ] = [] } = {} } = {} } = data || {};
    
                total_pages = Math.ceil(resource / PRODUCT_X_PAGE);

                if (countProducts === resource) break;

                if (availableProducts.length) {
                    for (let product of availableProducts) {
                        const id = product.itemId ? `Unimarc-${product.itemId}` : null;
                        
                        if (!id || !product.slug) continue;

                        const thread_id = threadSelector(null, true)

                        const props = createMessageHTML(
                            product.name,
                            ['Unimarc'],
                            parseInt(product.sellers[0].priceWithoutDiscount),
                            parseInt(product.sellers[0].price),
                            Math.round(100-(product.sellers[0].price * 100 / product.sellers[0].priceWithoutDiscount)),
                            `https://www.unimarc.cl/product${product.slug}`.slice(0, -2),
                            id,
                            product.images[0],
                            thread_id,
                            MARKET
                        );
    
                        existingProduct_(props, id);
                    };
                };
                page++;

                await sleep(SLEEP_DURATION);
            };
        };
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getUnimarc };