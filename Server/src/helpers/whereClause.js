const { Op } = require('sequelize');

const whereClause = (filters) => {
    const whereClause = {};

    if (filters.name) {
        whereClause.name = {
            [Op.iLike]: `%${filters.name}%`
        };
    };

    if (filters.store) {
        whereClause.store = {
            [Op.contains]: [filters.store]
        };
    };

    if (filters.minDiscount || filters.maxDiscount) {
        whereClause.discount = {};
    
        if (filters.minDiscount) {
            whereClause.discount[Op.gte] = filters.minDiscount;
        };
    
        if (filters.maxDiscount) {
            whereClause.discount[Op.lte] = filters.maxDiscount;
        };
    };

    if (filters.sent_to_group_PREMIUM === 'false' || filters.sent_to_group_PREMIUM === 'true') {
        whereClause.sent_to_group_PREMIUM = filters.sent_to_group_PREMIUM;
    };

    if (filters.sent_to_group_FREE === 'false' || filters.sent_to_group_FREE === 'true') {
        whereClause.sent_to_group_FREE = filters.sent_to_group_FREE;
    };

    if (filters.sent_to_group_FREE && filters.date) {
        whereClause.group_FREE_send_time = {
            [Op.lte]: filters.date
        };
    };
    
    if (filters.sent_to_group_PREMIUM && filters.date) {
        whereClause.group_PREMIUM_send_time = {
            [Op.lte]: filters.date
        };
    };

    return whereClause;
};

module.exports = { whereClause };