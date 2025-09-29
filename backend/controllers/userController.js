const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const { Op } = require("sequelize");

exports.viewStoresforUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address } = req.query;

    const filters = {};
    if (name) filters.name = { [Op.like]: `%${name}%` };
    if (address) filters.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: filters,
      attributes: ["id", "name", "address", "owner_id", "createdAt", "updatedAt"],
      include: [
        {
          model: Rating,
          attributes: ["id", "rating", "user_id"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const result = stores.map((store) => {
      
      const ratings = store.Ratings.map(r => r.rating);
      const averageRating = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;

      const userRatingObj = store.Ratings.find(r => r.user_id === userId);
      const userRating = userRatingObj ? userRatingObj.rating : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner_id: store.owner_id,
        averageRating,
        userRating,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      };
    });

    return res.status(200).json({ stores: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch stores" });
  }
};


exports.updateMyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update password" });
  }
};


exports.submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.storeId;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this store. Use modify endpoint to change." });
    }

    const newRating = await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating,
      comment
    });

    return res.status(201).json({ message: "Rating submitted successfully", rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

exports.modifyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.storeId;
    const { rating, comment } = req.body;

    const existingRating = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found. Submit a rating first." });
    }

    if (rating) existingRating.rating = rating;
    if (comment) existingRating.comment = comment;

    await existingRating.save();

    return res.status(200).json({ message: "Rating updated successfully", rating: existingRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update rating" });
  }
};
