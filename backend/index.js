import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Connection/connectDB.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Configuration of environment file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/products/:id", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

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
