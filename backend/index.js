import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./Connection/connectDB.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/products/:id", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is listening...");
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
