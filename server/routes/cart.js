const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const existingCart = await Cart.findOne({ where: { user_id, product_id } });
    if (existingCart) {
      const updatedCart = await Cart.update(
        { quantity: existingCart.quantity + quantity },
        { where: { user_id, product_id } }
      );
      res
        .status(200)
        .json({ message: "Cart updated successfully", updatedCart });
      return;
    } else {
      const cart = await Cart.create({
        user_id,
        product_id,
        quantity,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  const { userId } = req.query;

  try {
    const carts = await Cart.findAll({ where: { user_id: userId } });
    res.status(200).json({ message: "Carts retrieved successfully", carts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findByPk(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.findByPk(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    await cart.destroy();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
