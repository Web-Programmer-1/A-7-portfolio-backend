
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

  const token =
    (req.cookies?.token as string | undefined) ||
    (req.headers["authorization"]?.toString().startsWith("Bearer ")
      ? req.headers["authorization"].toString().split(" ")[1]
      : req.headers["authorization"]);

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
