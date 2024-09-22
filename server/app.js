const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database.js");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const transactionRoutes = require("./routes/transaction");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/user");
const carouselRoutes = require("./routes/carousel");

const path = require("path");

const Product = require("./models/Product.js");
const Cart = require("./models/Cart.js");
const Transaction = require("./models/Transaction.js");
const Wishlist = require("./models/Wishlist.js");
const User = require("./models/User.js");
const Carousel = require("./models/Carousel.js");

// const { Server } = require("socket.io");
// const { createServer } = require("http");

const app = express();

// const server = createServer(app);
// const io = new Server({
//   cors: {
//     origin: "http://localhost:8000",
//     methods: ["GET", "POST"],
//   },
// });

app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/carousel", carouselRoutes);

// Sequelize associations
User.hasMany(Transaction, { foreignKey: "user_id" });
User.hasMany(Product, { foreignKey: "user_id" });
User.hasMany(Cart, { foreignKey: "user_id" });

Cart.belongsTo(Product, { foreignKey: "product_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Cart, { foreignKey: "product_id" });

Transaction.belongsTo(User, { foreignKey: "user_id" });

Wishlist.belongsTo(Product, { foreignKey: "product_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

console.log(User.associations);
console.log(Cart.associations);
console.log(Product.associations);
console.log(Transaction.associations);
console.log(Wishlist.associations);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Connect to PostgreSQL database and start the server
sequelize.sync({ alter: true }).then(() => {
  app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
  });

  // WebSocket connection setup
  // io.listen(server);
  // io.on("connection", (socket) => {
  //   console.log("a user connected");
  //   socket.on("disconnect", () => {
  //     console.log("user disconnected");
  //   });
  // });
});
