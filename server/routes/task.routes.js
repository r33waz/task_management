import express from "express";
import {
  CreateTask,
  DeletePost,
  GetSingleUserTask,
  UpdateTask,
} from "../controller/task.controller.js";
import { upload } from "../utils/multer.js";
import { Authentication } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create-task",Authentication, upload.single("file"), CreateTask);
router.get("/signle-user-task/:id",Authentication, GetSingleUserTask);
router.delete("/delete-post/:id",Authentication, DeletePost);
router.patch("/update-post/:id",Authentication, upload.single("file"), UpdateTask);
export default router;
