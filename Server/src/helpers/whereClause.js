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

    if (filters.state) {
        whereClause.state = filters.state;
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

    if (filters.sent === 'false' || filters.sent === 'true') {
        whereClause.sent = filters.sent
    };

    return whereClause;
};

module.exports = { whereClause };