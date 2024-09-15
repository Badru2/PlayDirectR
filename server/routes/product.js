const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Images only! (jpg, jpeg, png)"));
    }
  },
});

// Product creation route
router.post("/create", upload.array("images", 5), async (req, res) => {
  const { name, user_id, description, price, quantity, category } = req.body;

  // Validate required fields
  if (!name || !user_id || !price || !quantity || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Handle uploaded files
  const images = req.files.map((file) => {
    return `${file.filename}`;
  });

  try {
    // Create the product
    const product = await Product.create({
      name,
      user_id,
      images: images,
      description,
      price,
      quantity,
      category,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  try {
    const products = await Product.findAll();
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/detail", async (req, res) => {
  const { productId } = req.query;

  try {
    const product = await Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, user_id, description, price, quantity, category } = req.body;

  try {
    // Update the product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    product.name = name || product.name;
    product.user_id = user_id || product.user_id;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;

    // Save the updated product
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
