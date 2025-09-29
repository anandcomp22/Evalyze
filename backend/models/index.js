const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

User.hasMany(Store, { foreignKey: "owner_id", as: "stores" });
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

Store.hasMany(Rating, { foreignKey: "store_id", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "store_id", as: "store" });

module.exports = {
  User,
  Store,
  Rating,
};
