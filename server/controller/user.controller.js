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

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const accessToken = generateAccessToken({ id: user.email });
    const refreshToken = generateRefreshToken({ id: user.email });

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, refreshToken]
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user:{
        id: user.id,
        email: user.email
      },
    });
  } catch (error) {
    console.error("error in login", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const RefreshAccressToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken({ id: user.id });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Logout = async (req, res) => {
  const { token } = req.body;
  try {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
