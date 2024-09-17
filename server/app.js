const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database.js");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const transactionRoutes = require("./routes/transaction");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/user");

const path = require("path");

// const { User } = require("./models/User.js");
const Product = require("./models/Product.js");
const Cart = require("./models/Cart.js");
const Transaction = require("./models/Transaction.js");
const { Wishlist } = require("./models/Wishlist.js");
const User = require("./models/User.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);

User.hasMany(Transaction, { foreignKey: "user_id" });
User.hasMany(Product, { foreignKey: "user_id" });
User.hasMany(Cart, { foreignKey: "user_id" });

Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

Cart.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });

Transaction.belongsTo(User, { foreignKey: "user_id" });

console.log(Transaction.associations);
console.log(User.associations);
console.log(Cart.associations);
console.log(Product.associations);

// Connect to PostgreSQL database and start the server
sequelize.sync({ alter: true }).then(() => {
  app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
  });
});
