import jwt from "jsonwebtoken";

const TOKEN_PREFIX = "Bearer ";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return process.env.JWT_SECRET;
};

const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    return null;
  }

  if (authorizationHeader.startsWith(TOKEN_PREFIX)) {
    return authorizationHeader.slice(TOKEN_PREFIX.length).trim();
  }

  return authorizationHeader.trim();
};

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    const token = getTokenFromHeader(authorizationHeader);

    if (!token) {
      return res.status(401).json({
      success: false,
      message: "Access denied",
    });
    }

    const verified = jwt.verify(token, getJwtSecret());

    req.user = verified;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;