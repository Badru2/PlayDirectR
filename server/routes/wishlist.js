const express = require("express");
const Wishlist = require("../models/Wishlist");
const AppLog = require("../models/AppLog");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const wishlist = await Wishlist.create({
      user_id,
      product_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res
      .status(201)
      .json({ message: "Wishlist created successfully", wishlist });
  } catch (error) {
    await AppLog.create({
      message: "Error creating wishlist: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const wishlists = await Wishlist.findAll({
      where: { user_id: req.user.id },
    });
    res
      .status(200)
      .json({ message: "Wishlists retrieved successfully", wishlists });
  } catch (error) {
    await AppLog.create({
      message: "Error retrieving wishlists: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const wishlist = await Wishlist.findByPk(id);
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    await wishlist.destroy();
    res
      .status(200)
      .json({ message: "Wishlist deleted successfully", wishlist });
  } catch (error) {
    await AppLog.create({
      message: "Error deleting wishlist: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
