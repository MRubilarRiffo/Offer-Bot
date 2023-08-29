const { Product } = require('../db');
const { sleep } = require('../helpers/sleep');
const { requestsAPI } = require('../helpers/requestsAPI');
const { getProduct } = require('../handlers/store requests/getProduct');
const { createProduct } = require('../handlers/store requests/createProduct');


const getKnasta = async () => {
    try {
        let total_page = 1;
        let page = 1;
        
        const api = `https://knasta.cl/_next/data/8223c0c755711a83aabf91debc5a3fba60bf78b3/es/results.json?knastaday=1&d=-0&page=${page}`;
        
        while (page <= total_page) {
            console.log("Page: " + page);
            console.log("Total Page: " + total_page);
            
            const data = await requestsAPI(api);

            if (data && data.pageProps && data.pageProps.initialData) {
                total_page = data.pageProps.initialData.total_pages;
                const products = data.pageProps.initialData.products;

                for (let product of products) {
                    const id = product.product_id || null;
                    const existingProduct = await getProduct(id);

                    if (!existingProduct) {
                        await createProduct(product);
                    };
                };
            };

            if (page === 3) break; //Eliminar linea
            page++;

            await sleep(10);
        }
    } catch (error) {
        console.error("Error:", error);
    };
};

module.exports = { getKnasta };
