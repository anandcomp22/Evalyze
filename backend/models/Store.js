const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  id: { type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
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
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  owner_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
}, {
    timestamps: false
  });


module.exports = Store;
