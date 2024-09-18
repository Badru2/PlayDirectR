const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Find the product to check stock availability
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCart = await Cart.findOne({ where: { user_id, product_id } });

    // Check if adding more quantity exceeds the available stock
    const totalQuantity = existingCart
      ? existingCart.quantity + quantity
      : quantity;
    if (totalQuantity > product.quantity) {
      return res
        .status(400)
        .json({ message: "Cart limit reached, not enough stock" });
    }

    if (existingCart) {
      // Update the existing cart item
      existingCart.quantity += quantity;
      await existingCart.save();

      return res
        .status(200)
        .json({ message: "Cart updated successfully", cart: existingCart });
    } else {
      // Create a new cart item
      const cart = await Cart.create({
        user_id,
        product_id,
        quantity,
      });

      return res
        .status(201)
        .json({ message: "Cart created successfully", cart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  const { userId } = req.query;

  try {
    const carts = await Cart.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "images"],
        },
      ],
    }).catch((error) => {
      console.log(error);
    });
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

    // limit by product quantity
    const product = await Product.findByPk(cart.product_id);
    if (quantity > product.quantity) {
      res.status(400).json({ message: "Cart limit reached" });
      return;
    }

    cart.quantity = quantity;

    // if 0 quantity, delete cart
    if (cart.quantity === 0) {
      await cart.destroy();
      return res.status(200).json({ message: "Cart deleted successfully" });
    }

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

router.delete("/clear", async (req, res) => {
  const { userId } = req.query;

  try {
    await Cart.destroy({
      where: {
        user_id: userId,
      },
    });
    res.status(200).json({ message: "Carts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
