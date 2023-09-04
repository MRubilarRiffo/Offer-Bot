const { updateProduct_H } = require("../handlers/products/updateProducts_H");
const { createProduct } = require("../handlers/store requests/createProduct");
const { getProduct } = require("../handlers/store requests/getProduct");
const { logMessage } = require("../helpers/logMessage");
const { requestsAPI } = require("../helpers/requestsAPI");
const { sleep } = require("../helpers/sleep");
const axios = require('axios');
const cheerio = require('cheerio');

const fetchAndAnalyzeURL = async () => {
    try {
        const url = 'https://www.unimarc.cl'; 

        const response = await axios.get(url);
        const html = response.data;
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
        console.error('Error al hacer la solicitud:', error);
    };
};

const getUnimarc = async () => {
    try {
        const KEY = await fetchAndAnalyzeURL();

        const PRODUCT_X_PAGE = 50;
        const SLEEP_DURATION = 10;
        const BASE_URL = "https://www.unimarc.cl";

        const categories = [
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

        for (let categorie of categories) {
            let total_pages = 1;
            let page = 1;
            while (page <= total_pages) {
                logMessage("Categorie: " + categorie);
                logMessage("Page: " + page);
                logMessage("Total Page: " + total_pages);
    
                const api = `${BASE_URL}/_next/data/${KEY}/category/${categorie}.json?page=${page}`;

                const data = await requestsAPI(api);
    
                const { pageProps: { dehydratedState: { queries: [ { state: { data: { data: { availableProducts, resource } = {} } = {} } = {} } ] = [] } = {} } = {} } = data || {};
    
                total_pages = Math.ceil(resource / PRODUCT_X_PAGE);

                if (availableProducts.length) {
                    for (let product of availableProducts) {
                        const id = product.itemId ? `Unimarc-${product.itemId}` : null;
                        
                        if (!id) continue;
    
                        const existingProduct = await getProduct(id);
    
                        const props = {
                            name: product.name,
                            product_id: id,
                            offer_price: parseInt(product.sellers[0].price),
                            normal_price: parseInt(product.sellers[0].priceWithoutDiscount),
                            url: `https://www.unimarc.cl/product${product.slug}`.slice(0, -2),
                            store: ['Unimarc'],
                            discount: Math.round(100-(product.sellers[0].price * 100 / product.sellers[0].priceWithoutDiscount)),
                            image_url: product.images[0],
                            sent: false
                        };
    
                        if (!existingProduct) {
                            await createProduct(props);
                        } else {
                            logMessage(`El producto con id: ${id} ya existe.`);
                            if (parseInt(product.sellers[0].price) !== existingProduct.offer_price) {
                                logMessage(`El producto con id: ${id} cambió de precio.`);
                                const result = await updateProduct_H(props, id);
                                if (result) logMessage(`El producto con id: ${id} fue actualizado.`);
                            };
                        };
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