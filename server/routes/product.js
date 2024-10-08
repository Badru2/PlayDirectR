const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");
const AppLog = require("../models/AppLog");
const HistoryAdmin = require("../models/HistoryAdmin");

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
  // fileFilter: (req, file, cb) => {
  //   // Check file type
  //   const filetypes = /jpeg|webp|svg|jpg|png/;
  //   const extname = filetypes.test(
  //     path.extname(file.originalname).toLowerCase()
  //   );
  //   const mimetype = filetypes.test(file.mimetype);

  //   if (extname && mimetype) {
  //     return cb(null, true);
  //   } else {
  //     cb(new Error("Images only! (jpg, jpeg, png)"));
  //   }
  // },
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

    // History create
    await HistoryAdmin.create({
      user_id: user_id,
      product_id: product.id,
      old_product_name: null,
      new_product_name: name,
      old_product_description: null,
      new_product_description: description,
      old_product_price: null,
      new_product_price: price,
      old_product_quantity: null,
      new_product_quantity: quantity,
      old_product_category: null,
      new_product_category: category,
      old_product_images: null,
      new_product_images: images,
      status: "create",
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    await AppLog.create({
      message: "Error creating product: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/show", async (req, res) => {
  try {
    const products = await Product.findAll({
      limit: 30,
    });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    await AppLog.create({
      message: "Error getting products: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/all", async (req, res) => {
  // create pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
    });
    res.status(200).json({
      totalProducts: count, // Total number of products
      totalPages: Math.ceil(count / limit), // Calculate the total number of pages
      currentPage: page, // Current page number
      products, // Paginated products for this page
    });
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
    await AppLog.create({
      message: "Error getting product: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/related", async (req, res) => {
  const { category } = req.query;

  try {
    const products = await Product.findAll({
      limit: 10,
      where: {
        category: {
          [Op.iLike]: `%${category}%`,
        },
      },
    });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    await AppLog.create({
      message: "Error getting products: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", upload.array("images", 5), async (req, res) => {
  const id = req.params.id;
  const { name, user_id, description, price, quantity, category } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Keep track of old values for history logging
    const oldProduct = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
      images: product.images,
    };

    // Update product details
    product.name = name || product.name;
    product.user_id = user_id || product.user_id;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;

    let imagePaths;
    // Update product images if any files are uploaded
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.filename); // Store file names in the database
      product.images = imagePaths; // Update the product's images field
    }

    // Save the updated product
    await product.save();

    // Only create history if the product was updated successfully
    await HistoryAdmin.create({
      user_id: user_id,
      product_id: id,
      old_product_name: oldProduct.name,
      new_product_name: product.name,
      old_product_price: oldProduct.price,
      new_product_price: product.price,
      old_product_quantity: oldProduct.quantity,
      new_product_quantity: product.quantity,
      old_product_description: oldProduct.description,
      new_product_description: product.description,
      old_product_category: oldProduct.category,
      new_product_category: product.category,
      old_product_images: oldProduct.images,
      new_product_images: imagePaths || oldProduct.images,
      status: "update",
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    await AppLog.create({
      user_id: user_id,
      message: "Error updating product: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/search", async (req, res) => {
  const { productName } = req.query;

  if (!productName) {
    return res.status(400).json({ message: "Product Name is required fields" });
  }

  try {
    const products = await Product.findAll({
      limit: 5,
      where: {
        name: {
          [Op.iLike]: `%${productName}%`,
        },
      },
    });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    await AppLog.create({
      message: "Error getting products: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

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
    await AppLog.create({
      message: "Error deleting product: " + error.message,
      route: req.originalUrl,
    }); // Log error to the database

    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
