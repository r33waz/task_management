import express from "express";
import { Login, RefreshAccressToken, Signup } from "../controller/user.controller.js";

const router = express.Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/refresh-token",RefreshAccressToken)
export default router;
