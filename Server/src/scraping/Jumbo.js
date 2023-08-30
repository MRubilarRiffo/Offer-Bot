const { createProduct } = require("../handlers/store requests/createProduct");
const { getProduct } = require("../handlers/store requests/getProduct");
const { requestsAPI } = require("../helpers/requestsAPI");
const { sleep } = require("../helpers/sleep");


const getJumbo = async () => {
    try {
        const headers = { Apikey: 'WlVnnB7c1BblmgUPOfg' };
        const product_x_page = 40;
        
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
            let total_products = 1;
            let total_page = Math.ceil(total_products / product_x_page);

            while (page <= total_page) {
                console.log("Categorie: " + categorie);
                console.log("Page: " + page);
                console.log("Total Page: " + total_page);
    
                const api = `https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/${categorie}?s=promotion%3Ayes&page=${page}`
    
                const data = await requestsAPI(api, headers);
                if (data && data.products && data.recordsFiltered > 0) {
                    total_products = data.recordsFiltered;
                    total_page = Math.ceil(total_products / product_x_page);
                    const products = data.products;
                    
                    for (let product of products) {
                        const id = product.productId ? `Jumbo-${product.productId}` : null;
                        const existingProduct = await getProduct(id);
                        
                        if (!existingProduct) {
                            const result = await createProduct({
                                name: product.productName,
                                product_id: id,
                                first_price: product.items[0].sellers[0].commertialOffer.Price,
                                last_price: product.items[0].sellers[0].commertialOffer.ListPrice,
                                url: `https://www.jumbo.cl/${product.linkText}/p`,
                                store: [product.items[0].sellers[0].sellerName],
                                discount: Math.round(100-(product.items[0].sellers[0].commertialOffer.Price * 100 / product.items[0].sellers[0].commertialOffer.ListPrice)),
                                image_url: product.items[0].images[0].imageUrl
                            });

                            if (result) {
                                console.log("El producto se creó exitosamente:", result.id);
                            } else {
                                console.log("La creación del producto falló.");
                            };
                        } else {
                            console.log("El producto ya existe.");
                        };
                    };
                };
                page++;

                await sleep(10);
            };
        };
    } catch (error) {
        console.error(`Error: ${error}`);
    };
};

module.exports = { getJumbo };