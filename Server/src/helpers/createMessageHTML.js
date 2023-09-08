const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
    return formattedPrice;
};

const createMessageHTML = (name, store, normal_price, offer_price, discount, url, id, image, thread_id) => {
    const messageHTML = `<b>⚠️ | ${name.toUpperCase()}</b>\n\n<i>🏬 | Vendedor:</i> ${store.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' - ')}\n\n<i>✅ | ${discount}% de descuento</i>\n\n💰 | <code>${formatPrice(normal_price)} ➔ ${formatPrice(offer_price)}</code>\n\n<a href="${url}">👁️‍🗨️ | Ver Producto</a>`;

    return {
        name: name,
        product_id: id,
        offer_price: offer_price,
        normal_price: normal_price,
        url: url,
        store: store,
        discount: discount,
        image_url: image,
        message: messageHTML,
        thread_id: thread_id
    };
};

module.exports = { createMessageHTML };