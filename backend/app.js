const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const { User, Store, Rating } = require("./models");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");
const resetUserPassword = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/store-owner", storeOwnerRoutes);

app.get("/", (req, res) => res.send("API is running..."));

sequelize.sync().then(() => {
  console.log("Database connected & synced");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});
