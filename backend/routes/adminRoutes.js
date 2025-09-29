const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addUser, addStore, dashboardStats, viewUsers, deleteStore, viewUserDetails, viewStores, resetUserPassword  } = require("../controllers/adminController");


router.post("/add-user", authMiddleware(["ADMIN"]), addUser);
router.post("/add-store", authMiddleware(["ADMIN"]), addStore);
router.get("/dashboard-stats", authMiddleware(["ADMIN"]), dashboardStats);
router.get("/users", authMiddleware(["ADMIN"]), viewUsers);
router.get("/stores", authMiddleware(["ADMIN"]), viewStores)
router.put("/reset-password", authMiddleware(["ADMIN"]), resetUserPassword);
router.get("/users/:id", authMiddleware(["ADMIN"]), viewUserDetails);
router.delete("/store/:id", authMiddleware(["ADMIN"]), deleteStore);



module.exports = router;