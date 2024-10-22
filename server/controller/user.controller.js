import pool from "../utils/dbConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please provide email",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Please provide password",
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    return res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
      return;
    }

    const user = result.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      res.status(401).json({
        status: false,
        message: "Invalid username or password",
      });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        status: true,
        message: "Login successful",
        token: token,
      });
    }
  } catch (error) {
    console.error("error in signup", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
