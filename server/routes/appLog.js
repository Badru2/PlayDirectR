const express = require("express");
const AppLog = require("../models/AppLog");
const User = require("../models/User");
const router = express.Router();

router.get("/show", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters (defaults to page 1 and limit 10)

  try {
    const offset = (page - 1) * limit;

    const { count, rows: logs } = await AppLog.findAndCountAll({
      include: [{ model: User, attributes: ["username"] }],
      limit: parseInt(limit), // Number of records to return per page
      offset: parseInt(offset), // Starting index for the records
      order: [["createdAt", "DESC"]], // Optional: Order logs by creation date, newest first
    });

    res.status(200).json({
      totalLogs: count, // Total number of logs
      totalPages: Math.ceil(count / limit), // Calculate the total number of pages
      currentPage: parseInt(page), // Current page number
      logs, // Paginated logs for this page
    });
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
