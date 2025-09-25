const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
});

User.belongsToMany(Store, { through: Rating, foreignKey: "user_id" });
Store.belongsToMany(User, { through: Rating, foreignKey: "store_id" });

module.exports = Rating;
