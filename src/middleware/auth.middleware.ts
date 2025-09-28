// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET_KEY || "secret123";

// export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
//     (req as any).user = decoded; 
//     next();
//   } catch (error) {
//     return res.status(403).json({ success: false, message: "Invalid or expired token" });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;


  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    
    (req as any).user = decoded;

    next(); 
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
