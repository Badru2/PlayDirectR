const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

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
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    transaction.status = status || transaction.status;
    await transaction.save();
    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
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
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
