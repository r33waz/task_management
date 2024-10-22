import express from "express";
import "dotenv/config.js";
import mainRoute from "./routes/main.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
