import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router(); // ✅ still correct

// ✅ changed `app.post()` → `router.post()`
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ changed `app.get()` → `router.get()`
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Auth routes working fine!" });
});

export default router;
