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
const historyAdminRoutes = require("./routes/historyAdmin");
const applogRoutes = require("./routes/appLog");

const path = require("path");

const Product = require("./models/Product.js");
const Cart = require("./models/Cart.js");
const Transaction = require("./models/Transaction.js");
const Wishlist = require("./models/Wishlist.js");
const User = require("./models/User.js");
const Carousel = require("./models/Carousel.js");
const AppLog = require("./models/AppLog.js");
const HistoryAdmin = require("./models/HistoryAdmin.js");

const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");

const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const allowedOrigins = [
  `http://localhost:${process.env.VITE_APP_PORT}`,
  `http://${process.env.SERVER_LOCAL_HOST}:${process.env.VITE_APP_PORT}`,
  `http://127.0.0.1:${process.env.VITE_APP_PORT}`, // Include 127.0.0.1 as well
  `http://192.168.18.13:${process.env.VITE_APP_PORT}`,
  `${process.env.PUBLIC_HOST}`,
];

console.log(allowedOrigins);

// Enable CORS for the frontend URL
app.use(
  cors({
    origin: function (origin, callback) {
      // If there's no origin (i.e., for non-browser requests), allow it
      if (!origin) return callback(null, true);
      // Allow the request if the origin is in the allowedOrigins array
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // If the origin is not allowed, reject the request
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Create the HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // If there's no origin (i.e., for non-browser requests), allow it
      if (!origin) return callback(null, true);
      // Allow the request if the origin is in the allowedOrigins array
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // If the origin is not allowed, reject the request
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

// Define your routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/history", historyAdminRoutes);
app.use("/api/applog", applogRoutes);

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

AppLog.belongsTo(User, { foreignKey: "user_id" });

HistoryAdmin.belongsTo(User, { foreignKey: "user_id" });

// Sequelize associations
console.log(User.associations);
console.log(Cart.associations);
console.log(Product.associations);
console.log(Transaction.associations);
console.log(Wishlist.associations);
console.log(AppLog.associations);
console.log(HistoryAdmin.associations);

// WebSocket connection setup
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("message", (data) => {
    console.log("Message from client: ", data);
    io.emit("message", data); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

app.set("socketio", io);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Connect to PostgreSQL database and start the server
sequelize.sync({ alter: true }).then(() => {
  server.listen(8000, () => {
    // Use server.listen instead of app.listen
    console.log("Server running on http://localhost:8000");
  });
});
