import express from "express";
import userRoute from "./user.routes.js";
import taskRoute from "./task.routes.js";

const router = express.Router();
router.use("/api/v1", userRoute);
router.use("/api/v1", taskRoute);
export default router;
