const express = require("express");
const Carousel = require("../models/Carousel");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/carousel"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Carousel creation route
router.post("/create", upload.single("image"), async (req, res) => {
  const { description } = req.body;
  try {
    const carousel = await Carousel.create({
      images: req.file.filename,
      description,
    });
    res
      .status(201)
      .json({ message: "Carousel created successfully", carousel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  try {
    const carousels = await Carousel.findAll();
    res.status(200).json(carousels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
