const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");
const { existingProduct_ } = require("../helpers/existingProduct");
const { sleep } = require("../helpers/sleep");
const { createMessageHTML } = require("../helpers/createMessageHTML");
const { getTotalProducts } = require("../handlers/products/getTotalProducts_H");

const BASE_URL = 'https://andina.micoca-cola.cl';
const VARIABLES_TEMPLATE = "eyJoaWRlVW5hdmFpbGFibGVJdGVtcyI6ZmFsc2UsInNrdXNGaWx0ZXIiOiJBTExfQVZBSUxBQkxFIiwic2ltdWxhdGlvbkJlaGF2aW9yIjoiZGVmYXVsdCIsImluc3RhbGxtZW50Q3JpdGVyaWEiOiJNQVhfV0lUSE9VVF9JTlRFUkVTVCIsInByb2R1Y3RPcmlnaW5WdGV4IjpmYWxzZSwibWFwIjoiY2F0ZWdvcnktMSIsInF1ZXJ5IjoiY2VydmV6YSIsIm9yZGVyQnkiOiJPcmRlckJ5VG9wU2FsZURFU0MiLCJmcm9tIjo0OCwidG8iOjcxLCJzZWxlY3RlZEZhY2V0cyI6W3sia2V5IjoiY2F0ZWdvcnktMSIsInZhbHVlIjoiY2VydmV6YSJ9XSwib3BlcmF0b3IiOiJhbmQiLCJmdXp6eSI6IjAiLCJzZWFyY2hTdGF0ZSI6bnVsbCwiZmFjZXRzQmVoYXZpb3IiOiJTdGF0aWMiLCJ3aXRoRmFjZXRzIjpmYWxzZX0";
const PRODUCT_X_PAGE = 100;
const MARKET = 'Coca-Cola';

const modifyURL = (variablesTemplate, from, to) => {
    
    const decodedVariables = Buffer.from(variablesTemplate, 'base64').toString('utf8');
    const obj = JSON.parse(decodedVariables);

    obj.hideUnavailableItems = true
    obj.from = from
    obj.to = to
    
    delete obj.selectedFacets
    delete obj.query
    delete obj.map
    delete obj.withFacets
    delete obj.facetsBehavior
    delete obj.searchState
    delete obj.fuzzy

    const newEncodedString = Buffer.from(JSON.stringify(obj)).toString('base64');

    return `${BASE_URL}/_v/segment/graphql/v1?extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2297f345cd1295d67e2e7c6e46f67b7d4e4593b2f97c26b22b9e6b68f787eb12ac%22%2C%22sender%22%3A%22vtex.store-resources%400.x%22%2C%22provider%22%3A%22vtex.search-graphql%400.x%22%7D%2C%22variables%22%3A%22${newEncodedString}%3D%22%7D`;
};

const getCocaCola = async () => {
    try {
        // const countProducts = await getTotalProducts({ market: MARKET });

        let totalPages = 1;
        let page = 1;
        while (page <= totalPages) {
            logMessage(`Coca-Cola | Page: ${page} of ${totalPages}`);

            const from = (page - 1) * PRODUCT_X_PAGE;
            const to = from + PRODUCT_X_PAGE - 1

            const api = modifyURL(VARIABLES_TEMPLATE, from, to);

            const data = await requestsAPI(api);

            const products = data?.data?.productSearch?.products;
            const totalProducts = data?.data?.productSearch?.recordsFiltered;

            totalPages = Math.ceil(totalProducts / PRODUCT_X_PAGE);
            
            if (products.length) {
                for (let product of products) {
                    const id = product.productId ? `Coca-Cola-${product.productId}` : null;
                    
                    if (!id ) continue;
                    const props = createMessageHTML(
                        product.productName,
                        [MARKET],
                        product.items[0].sellers[0].commertialOffer.ListPrice,
                        product.items[0].sellers[0].commertialOffer.Price,
                        Math.round(100 - (product.items[0].sellers[0].commertialOffer.Price * 100 / product.items[0].sellers[0].commertialOffer.ListPrice)),
                        `${BASE_URL}${product.link}`,
                        id,
                        product.items[0].images[0].imageUrl,
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

module.exports = { getCocaCola };
