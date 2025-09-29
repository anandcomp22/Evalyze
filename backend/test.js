const bcrypt = require("bcrypt");
console.log(bcrypt.hashSync("Admin@123", 10));