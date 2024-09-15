const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database.js");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const transactionRoutes = require("./routes/transaction");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/user");

const { Product } = require("./models/Product.js");
const { Cart } = require("./models/Cart.js");
const { Transaction } = require("./models/Transaction.js");
const { Wishlist } = require("./models/Wishlist.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);

// Connect to PostgreSQL database and start the server
sequelize.sync({ alter: true }).then(() => {
  app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
  });
});
