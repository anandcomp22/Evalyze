const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

User.hasMany(Store, { foreignKey: "owner_id" });
Store.belongsTo(User, { foreignKey: "owner_id" });

module.exports = Store;
