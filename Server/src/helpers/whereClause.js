const { Op } = require('sequelize');

const whereClause = (filters) => {
    const whereClause = {};

    if (filters.name) {
        whereClause.name = {
            [Op.iLike]: `%${filters.name}%`
        };
    };

    if (filters.store) {
        whereClause.sport = {
            [Op.contains]: [filters.sport]
        };
    };

    if (filters.discount) {
        whereClause.discount = {
            [Op.gte]: filters.discount
        };
    };

    return whereClause;
};

module.exports = { whereClause };