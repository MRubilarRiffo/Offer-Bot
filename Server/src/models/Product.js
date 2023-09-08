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
			type: DataTypes.STRING,
		},
		url: {
			type: DataTypes.STRING,
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
		sent: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		message: {
			type: DataTypes.TEXT,
		},
		thread_id: {
			type: DataTypes.ARRAY(DataTypes.INTEGER)
		}
	}, {
		timestamps: false,
	});
};