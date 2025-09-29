const express = require("express");
const router = express.Router();
const { updateMyPassword, viewStoresforUser, submitRating, modifyRating } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/update-password", authMiddleware(["USER","OWNER","ADMIN"]), updateMyPassword);
router.get("/dashboard", authMiddleware(["USER","OWNER","ADMIN"]), viewStoresforUser);
router.post("/stores/:storeId/rate", authMiddleware(["USER","OWNER","ADMIN"]), submitRating);
router.put("/stores/:storeId/rate", authMiddleware(["USER","OWNER","ADMIN"]), modifyRating);

module.exports = router;
