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
		thread_id: {
			type: DataTypes.ARRAY(DataTypes.INTEGER)
		},
		sent: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		publishing_time: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		state: {
			type: DataTypes.STRING,
			defaultValue: 'PREMIUM'
		},
		market: {
			type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});
};