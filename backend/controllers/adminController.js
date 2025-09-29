const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const bcrypt = require("bcrypt");
const generateToken = require("./authController").generateToken;

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if(!name || !email || !password || !role) {
            return res.status(400).json({ message: "All field are required"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashedPassword, address, role : role.toUpperCase()
        });
        await user.save();


        return res.status(201).json({ message: "User add successfully", user});
    } catch (err) {
      console.error("Add User Error:", err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Failed to add user"});
    }
};


exports.addStore = async (req, res) => {
    try {
        const { name, email, address} = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const store = await Store.create({ name, email, address });
        await store.save();
        return res.status(201).json({ message: "Store added successfully", store });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add store" });
    }
};


exports.dashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        return res.json({ totalUsers, totalStores, totalRatings});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to get dashboard stats"
        });
    }
};

exports.viewUsers = async (req, res) => {
  try {
    const { name, email, role } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (email) filters.email = email;
    if (role) filters.role = role.toUpperCase();

    const users = await User.findAll({
      where: filters,
      attributes: ["id", "name", "email", "address", "role", "createdAt", "updatedAt"],
      include: [
        {
          model: Store,
          as: "stores", // only for owners
          attributes: ["id", "name", "email", "address"],
          include: [
            {
              model: Rating,
              attributes: ["id", "rating", "comment", "createdAt"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "address", "role", "createdAt", "updatedAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    let stores = [];
    if (user.role.toUpperCase() === "OWNER") {
      stores = await Store.findAll({
        where: { owner_id: user.id },
        attributes: ["id", "name", "email", "address"],
        include: [
          {
            model: Rating,
            attributes: ["id", "rating", "comment", "user_id"],
          },
        ],
      });
    }

    return res.status(200).json({ user, stores });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
};


exports.viewStores = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.query;

    const filters = {};
    if (name) filters.name = { [Op.like]: `%${name}%` };
    if (email) filters.email = { [Op.like]: `%${email}%` };
    if (address) filters.address = { [Op.like]: `%${address}%` };
    if (owner_id) filters.owner_id = owner_id;

    const stores = await Store.findAll({
      where: filters,
      attributes: ["id", "name", "email", "address", "owner_id", "createdAt", "updatedAt"],
      include: [
        {
          model: Rating,
          attributes: ["rating"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const result = stores.map((store) => {
      const ratings = store.Ratings.map(r => r.rating);
      const averageRating = ratings.length ? (ratings.reduce((a,b) => a+b, 0)/ratings.length).toFixed(2) : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner_id: store.owner_id,
        averageRating,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt
      };
    });

    return res.status(200).json({ stores: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch stores" });
  }
};



exports.resetUserPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { userId, newPassword } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Target user not found" });

    const tempPassword = newPassword || crypto.randomBytes(6).toString("base64").replace(/\+/g, "0");

    const hashed = await bcrypt.hash(tempPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({
      message: "User password reset successfully",
      tempPasswordForTesting: newPassword ? undefined : tempPassword
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

exports.deleteStore = async (req, res) => {
  const storeId = req.params.id;

  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.destroy();

    return res.status(200).json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Error deleting store:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
