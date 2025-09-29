const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {len:[20,60]},
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },

    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING(400),
    },

    role: {
        type: DataTypes.ENUM("ADMIN","User","OWNER"),
        allowNull: false,
    }, 
});


module.exports = User;