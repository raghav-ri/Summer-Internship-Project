import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized to access this route" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
