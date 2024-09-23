const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const User = require("../models/User");
const AppLog = require("../models/AppLog");

router.post("/create", async (req, res) => {
  const { user_id, products, total } = req.body;
  if ((!user_id || !products, !total)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transaction = await Transaction.create({
      user_id,
      products,
      total,
      status: "pending",
    });

    // Update the product quantity
    for (const product of products) {
      const productToUpdate = await Product.findByPk(product.product_id);
      if (productToUpdate) {
        const newQuantity = productToUpdate.quantity - product.quantity;
        await productToUpdate.update({ quantity: newQuantity });
      }
    }

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    await AppLog.create({
      user_id: user_id,
      message: "Error creating transaction: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    await AppLog.create({
      message: "Error getting transactions: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/get", async (req, res) => {
  const userId = req.query.userId;
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
    });
    res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    await AppLog.create({
      user_id: userId,
      message: "Error getting transactions: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/detail", async (req, res) => {
  const { userId, transactionId } = req.query;
  try {
    const transactions = await Transaction.findOne({
      where: { id: transactionId, user_id: userId },
    });
    res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    await AppLog.create({
      user_id: userId,
      message: "Error getting transaction: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  console.log("Updating transaction:", id, status);
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    transaction.status = status;
    await transaction.save();

    // update product stock if cancel
    if (status === "cancelled") {
      for (const product of transaction.products) {
        const productToUpdate = await Product.findByPk(product.product_id);
        if (productToUpdate) {
          const newQuantity = productToUpdate.quantity + product.quantity;
          await productToUpdate.update({ quantity: newQuantity });
        }
      }
    }

    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    await AppLog.create({
      message: "Error updating transaction: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await transaction.destroy();
    res
      .status(200)
      .json({ message: "Transaction deleted successfully", transaction });
  } catch (error) {
    await AppLog.create({
      message: "Error deleting transaction: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
