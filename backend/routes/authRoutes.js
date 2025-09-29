const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {signup, signin, logout } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", authMiddleware(), logout);

module.exports = router;