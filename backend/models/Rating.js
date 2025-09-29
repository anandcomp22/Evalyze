const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");


const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.STRING}
}, { timestamps: true });


User.hasMany(Rating, { foreignKey: 'user_id' });
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = Rating;
