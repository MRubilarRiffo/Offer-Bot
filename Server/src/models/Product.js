const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Product', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		product_id: {
			type: DataTypes.STRING,
			unique: true,
		},
		image_url: {
			type: DataTypes.STRING(512),
		},
		url: {
			type: DataTypes.STRING(512),
		},
		store: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		offer_price: {
			type: DataTypes.INTEGER,
		},
		normal_price: {
			type: DataTypes.INTEGER,
		},
		discount: {
			type: DataTypes.INTEGER,
		},
		message: {
			type: DataTypes.TEXT,
		},
		market: {
			type: DataTypes.STRING,
		},
		sent_to_group_PREMIUM: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		sent_to_group_FREE: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		group_PREMIUM_send_time: {
			type: DataTypes.INTEGER,
			defaultValue: Math.floor(Date.now() / 1000)
		},
		group_FREE_send_time: {
			type: DataTypes.INTEGER,
			defaultValue: Math.floor(Date.now() / 1000) + 4 * 60 * 60
		}
	}, {
		timestamps: false,
	});
};