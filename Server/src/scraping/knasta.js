const { sleep } = require('../helpers/sleep');
const { requestsAPI } = require('../helpers/requestsAPI');
const { getProduct } = require('../handlers/store requests/getProduct');
const { createProduct } = require('../handlers/store requests/createProduct');
const { logMessage } = require('../helpers/logMessage');
const { updateProduct_H } = require('../handlers/products/updateProducts_H');

const getKnasta = async () => {
    try {
        let total_pages_ = 1;
        let page = 1;
        while (page <= total_pages_) {
            logMessage("Page: " + page);
            logMessage("Total Page: " + total_pages_);

            const api = `https://knasta.cl/_next/data/8223c0c755711a83aabf91debc5a3fba60bf78b3/es/results.json?knastaday=1&d=-0&page=${page}`;
            
            const data = await requestsAPI(api);

            const { pageProps: { initialData: { total_pages, products } = {} } = {} } = data || {};

            total_pages_ = total_pages

            if (products.length) {
                for (let product of products) {
                    const id = product.product_id ? `Knasta-${product.product_id}` : null;

                    if (!id) continue;

                    const existingProduct = await getProduct(id);

                    const props = {
                        name: product.title,
                        product_id: id,
                        offer_price: product.current_price,
                        normal_price: product.last_variation_price,
                        url: product.url,
                        store: product.retail,
                        discount: product.percent,
                        image_url: product.image,
                        sent: false
                    };

                    if (!existingProduct) {
                        const result = await createProduct(props);
                        logMessage(result.error
                            ? `La creación del producto con id: ${id} falló.`
                            : `El producto con id ${id} se creó exitosamente.`);
                    } else {
                        logMessage(`El producto con id: ${id} ya existe.`);
                        if (product.current_price !== existingProduct.offer_price) {
                            logMessage(`El producto con id: ${id} cambió de precio.`);
                            const result = await updateProduct_H(props, id);
                            if (result) logMessage(`El producto con id: ${id} fue actualizado.`);
                        };
                    };
                };
            };
            
            page++;

            await sleep(10);
        }
    } catch (error) {
        logMessage(`Error: ${error}`);
    };
};

module.exports = { getKnasta };
