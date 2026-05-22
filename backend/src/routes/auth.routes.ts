import express from "express";
import { register, login, logout, googleLogin, getUserProfile } from "../controllers/auth.controller";

import isAuthenticated from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/logout", isAuthenticated, logout);

router.get("/profile", isAuthenticated, getUserProfile);
// Endpoint updated to return full user data

export default router;
