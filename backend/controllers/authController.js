const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const generateToken = (user) => {
    return jwt.sign(
        {
            id:user.id, role: user.role, email: user.email
        },
        process.env.JWTSECRETKEY,
        { expiresIn: "1d"}
    );;
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password)) {
            return res.status(400).json({ message: "Password must be 8-16 chs, include uppercase & special char" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        role = role ? role.toUpperCase() : "USER"; 

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
        });

        const token = generateToken(user);

        return res.status(200).json({ message: "User registered successfully", token, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Signup failed" });
    }
};


exports.signin = async (req,res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: {email}});
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password"});
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch) {
            return res.status(400).json({ message: "Invalid emailor password"});
        } 

        const token = generateToken(user);

        return res.json({
            message: "Login successful",
            token, 
            user: { id:user.id, role: user.role, name: user.name, email:user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login Failed"});
    }
};

exports.logout = async (req, res) => {
  try {
    return res.json({ message: `${req.user.role} logged out successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};