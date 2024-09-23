// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const AppLog = require("../models/AppLog");
const { Op } = require("sequelize");

// Set up multer for file upload (e.g., avatar)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/avatars"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  // fileFilter: (req, file, cb) => {
  //   // Check file type
  //   const filetypes = /jpeg|webp|svg|jpg|png/;
  //   const extname = filetypes.test(
  //     path.extname(file.originalname).toLowerCase()
  //   );
  //   const mimetype = filetypes.test(file.mimetype);

  //   if (extname && mimetype) {
  //     return cb(null, true);
  //   } else {
  //     cb(new Error("Images only! (jpg, jpeg, png)"));
  //   }
  // },
});

const SECRET_KEY =
  "7f81798c58db2a591185ef8b098fae196fb791454237a2a370f7f938450f3ed2";

// Registration
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    await AppLog.create({
      message: "Error creating user: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    await AppLog.create({
      message: "Error logging in: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/profile", authMiddleware, (req, res) => {
  // Access user data from req.user
  const { id, email, username, role, avatar, address } = req.user;

  res.status(200).json({
    message: "User profile retrieved successfully",
    user: {
      id,
      email,
      username,
      role,
      avatar,
      address,
    },
  });
});

router.get("/users", async (req, res) => {
  const { username, email } = req.query;
  try {
    const user = await User.findOne({
      where: {
        username: {
          [Op.eq]: username, // Use exact match for username
        },
        email: {
          [Op.eq]: email, // Use exact match for email
        },
      },
    });

    // Return a boolean indicating if the username exists
    res.status(200).json({ exists: !!user }); // '!!' converts truthy/falsy to boolean
  } catch (error) {
    await AppLog.create({
      message: "Error checking username: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ where: { id } });
    res.status(200).json(user);
  } catch (error) {
    await AppLog.create({
      message: "Error getting user: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/get/admin", async (req, res) => {
  try {
    const admins = await User.findAll({ where: { role: "admin" } });
    res.status(200).json(admins);
  } catch (error) {
    await AppLog.create({
      message: "Error getting admins: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/get/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    await AppLog.create({
      message: "Error getting users: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.destroy({ where: { id } });
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    await AppLog.create({
      message: "Error deleting user: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", upload.single("avatar"), async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password, role, address } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // If an avatar file is uploaded, its path will be stored in req.file
    const avatar = req.file ? `${req.file.filename}` : undefined;

    // Update the user information
    const updatedUser = await User.update(
      {
        username: username || user.username,
        email: email || user.email,
        password: hashedPassword || undefined, // don't update if no new password
        role: role || user.role,
        avatar: avatar || user.avatar, // don't update if no avatar uploaded
        address: address || user.address,
      },
      { where: { id } }
    );

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    await AppLog.create({
      message: "Error updating user: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
