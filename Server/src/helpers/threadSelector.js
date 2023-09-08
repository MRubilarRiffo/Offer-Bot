require('dotenv').config();

const { CANAL_PREMIUM_ID, THREAD_ID_SUPERMARKET, THREAD_ID_10_DCTO, THREAD_ID_30_DCTO, THREAD_ID_60_DCTO, THREAD_ID_80_DCTO } = process.env;

const threadSelector = (discount, supermarket = false) => {
    if (supermarket) {
        return [THREAD_ID_SUPERMARKET];
    } else if (discount >= 80) {
        return [THREAD_ID_80_DCTO];
    } else if (discount >= 60) {
        return [THREAD_ID_60_DCTO];
    } else if (discount >= 30) {
        return [THREAD_ID_30_DCTO];
    } else if (discount >= 10) {
        return [THREAD_ID_10_DCTO];
    };

    return null;
};

module.exports = { threadSelector }