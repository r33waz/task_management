import jwt from "jsonwebtoken";
export const Authentication = async (req, res, next) => {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid access token" });
      }
      req.user = user; 
      next(); 
    });
  } catch (error) {
    return res.status(500).json({ message: "Authentication failed" });
  }
};
