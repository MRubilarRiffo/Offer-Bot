const { Sequelize } = require('sequelize');
const { Product } = require('../../db');
const { whereClause } = require('../../helpers/whereClause');

const getProducts_H = async (page, limit, filters, sortOrder, selectedFields) => {
    try {
        const offset = (page - 1) * limit;
        
        const where = whereClause(filters);
        
        const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
        
        const allowedFields = ['name', 'product_id', 'offer_price', 'normal_price', 'url', 'store', 'discount', 'image_url', 'message'];
        
        let attributes = selectedFields && selectedFields.filter(field => allowedFields.includes(field));
        
        return await Product.findAll({
            where: where,
            order: sortOrder === 'random' ? Sequelize.literal('random()') : [['id', order]],
            limit: limit,
            offset: offset,
            attributes: attributes
        });
    } catch (error) {
        throw new Error(`Error al obtener productos: ${error}`);
    };
};

module.exports = { getProducts_H };