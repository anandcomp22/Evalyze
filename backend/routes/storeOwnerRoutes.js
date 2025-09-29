const express = require("express");
const  authMiddleware  = require("../middleware/authMiddleware");
const { updatePassword, getOwnerDashboard , getAverageRating } = require("../controllers/storeOwnerController");

const router = express.Router();

router.put("/update-password", authMiddleware(["OWNER",]), updatePassword);
router.get("/dashboard",authMiddleware(["OWNER"]), getOwnerDashboard);
router.get("/average-rating",authMiddleware(["OWNER"]), getAverageRating);

module.exports = router;
