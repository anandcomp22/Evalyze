const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      include: [
        {
          model: Rating,
          attributes: ["id", "rating", "comment", "user_id"],
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"]
            }
          ]
        }
      ]
    });

    if (!stores.length) {
      return res.status(404).json({ message: "No stores found for this owner" });
    }

    const dashboardData = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating);
      const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null;

      const usersRated = store.Ratings.map(r => ({
        id: r.User.id,
        name: r.User.name,
        email: r.User.email,
        rating: r.rating,
        comment: r.comment
      }));

      return {
        storeId: store.id,
        storeName: store.name,
        averageRating,
        usersRated
      };
    });

    return res.status(200).json({ dashboardData });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { owner_id: ownerId } });
    if (!store) return res.status(404).json({ message: "Store not found for this owner" });

    const ratings = await Rating.findAll({ where: { store_id: store.id } });
    if (ratings.length === 0) return res.json({ average: 0 });

    const avg = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

    return res.json({ store: store.name, averageRating: avg.toFixed(2) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch average rating" });
  }
};
