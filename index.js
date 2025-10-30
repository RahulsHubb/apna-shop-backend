import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
connectDB();


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


// ✅ Default Route
app.get("/", (req, res) => {
    res.status(200).send("Server is running & MongoDB connected successfully!");
});
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
