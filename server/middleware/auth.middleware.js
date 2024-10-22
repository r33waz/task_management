import jwt from "jsonwebtoken";
export const Authentication = async (req, res, next) => {
  try {
    if (!req.headers.Authorization) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
    const token = req.headers.Authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const resp = jwt.verify(token, process.env.JWT_SECRET);

    if (!resp) {
      return res.status(401).json({
        status: false,
        message: "Invalid token. User should be logged in.",
      });
    }

    req.user = resp;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication failed" });
  }
};
