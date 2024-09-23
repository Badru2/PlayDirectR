const express = require("express");
const AppLog = require("../models/AppLog");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await AppLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/create", async (req, res) => {
  const { user_id, message } = req.body;
  try {
    const log = await AppLog.create({ user_id, message });
    res.status(201).json({ message: "Log created successfully", log });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
