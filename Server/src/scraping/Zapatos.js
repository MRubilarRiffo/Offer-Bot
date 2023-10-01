const { getTotalProducts } = require("../handlers/products/getTotalProducts_H");
const { createMessageHTML } = require("../helpers/createMessageHTML");
const { existingProduct_ } = require("../helpers/existingProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");

const BASE_URL = 'https://www.zapatos.cl';
const VARIABLES_TEMPLATE = 'eyJoaWRlVW5hdmFpbGFibGVJdGVtcyI6ZmFsc2UsInNrdXNGaWx0ZXIiOiJBTExfQVZBSUxBQkxFIiwic2ltdWxhdGlvbkJlaGF2aW9yIjoiZGVmYXVsdCIsImluc3RhbGxtZW50Q3JpdGVyaWEiOiJNQVhfV0lUSE9VVF9JTlRFUkVTVCIsInByb2R1Y3RPcmlnaW5WdGV4Ijp0cnVlLCJtYXAiOiJwcm9tb3Rpb24scHJvZHVjdGNsdXN0ZXJuYW1lcyIsInF1ZXJ5Ijoic2kvdG9kby16YXBhdG9zLWNsIiwib3JkZXJCeSI6Ik9yZGVyQnlSZWxlYXNlRGF0ZURFU0MiLCJmcm9tIjowLCJ0byI6NDcsInNlbGVjdGVkRmFjZXRzIjpbeyJrZXkiOiJwcm9tb3Rpb24iLCJ2YWx1ZSI6InNpIn0seyJrZXkiOiJwcm9kdWN0Y2x1c3Rlcm5hbWVzIiwidmFsdWUiOiJ0b2RvLXphcGF0b3MtY2wifV0sInNlYXJjaFN0YXRlIjpudWxsLCJmYWNldHNCZWhhdmlvciI6IlN0YXRpYyIsImNhdGVnb3J5VHJlZUJlaGF2aW9yIjoiZGVmYXVsdCIsIndpdGhGYWNldHMiOmZhbHNlLCJ2YXJpYW50IjoiIn0'
const PRODUCT_X_PAGE = 48;
const MARKET = 'Zapatos.cl'

const modifyURL = (variablesTemplate, from, to) => {
    
    const decodedVariables = Buffer.from(variablesTemplate, 'base64').toString('utf8');
    const obj = JSON.parse(decodedVariables);

    obj.hideUnavailableItems = true
    obj.from = from
    obj.to = to

    const newEncodedString = Buffer.from(JSON.stringify(obj)).toString('base64');

    return `${BASE_URL}/_v/segment/graphql/v1?variables=%7B%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%225582a05af7ee7b8a43406c6041335d5e4f0a6eea4a16f4bef9d2599218766e82%22%2C%22sender%22%3A%22vtex.store-resources%400.x%22%2C%22provider%22%3A%22vtex.search-graphql%400.x%22%7D%2C%22variables%22%3A%22${newEncodedString}%3D%22%7D`;
};

const getZapatos = async () => {
    try {
        const countProducts = await getTotalProducts({ market: MARKET });

        let totalPages = 1;
        let page = 1;
        while (page <= totalPages) {
            logMessage(`${MARKET} | Page: ${page} of ${totalPages}`);

            const from = (page - 1) * PRODUCT_X_PAGE;
            const to = from + PRODUCT_X_PAGE - 1

            const api = modifyURL(VARIABLES_TEMPLATE, from, to);

            const data = await requestsAPI(api);

            const products = data?.data?.productSearch?.products;
            const totalProducts = data?.data?.productSearch?.recordsFiltered;

            if (countProducts === totalProducts) break;

            totalPages = Math.ceil(totalProducts / PRODUCT_X_PAGE);

            if (!products || !totalProducts) break;

            for (let product of products) {
                const id = product.productId ? `${MARKET}-${product.productId}` : null;
                const name = product?.productName;
                const market = MARKET;
                const priceNormal = product?.priceRange?.listPrice?.lowPrice;
                const priceOffer = product?.priceRange?.sellingPrice?.lowPrice;
                const discount = Math.round(100 - (priceOffer * 100 / priceNormal)) || null;
                const productUrl = product?.linkText ? `${BASE_URL}/${product?.linkText}/p` : null;
                const imageUrl = product?.items[0]?.images[0]?.imageUrl;

                if (!id || !name || !priceNormal || !priceOffer || !productUrl) continue;

                const props = createMessageHTML(name, [market], Math.round(priceNormal), Math.round(priceOffer), discount, productUrl, id, imageUrl, market);

                await existingProduct_(props, id);
            };
            page++;
        };
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getZapatos };