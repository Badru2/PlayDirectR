const express = require("express");
const HistoryAdmin = require("../models/HistoryAdmin");
const AppLog = require("../models/AppLog");
const User = require("../models/User");

const router = express.Router();

router.get("/show", async (req, res) => {
  try {
    const history = await HistoryAdmin.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(history);
  } catch (error) {
    AppLog.create({
      message: "Error getting history: " + error.message,
      route: req.originalUrl,
    });
  }
});

module.exports = router;
