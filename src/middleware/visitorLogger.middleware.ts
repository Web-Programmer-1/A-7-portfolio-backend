
import { Request, Response, NextFunction } from "express";

import UAParser from "ua-parser-js";
import { prisma } from "../config/db";

export const visitorLogger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    const parser = new (UAParser as any)(userAgent);
    const result = parser.getResult();

    const deviceType = result.device.type || "Desktop";
    const osName = result.os.name || "Unknown";
    const browserName = result.browser.name || "Unknown";

    await prisma.visitorLog.create({
      data: {
        ip: String(ip),
        userAgent,
        device: deviceType,
        os:osName,
        browser: browserName,
        page: req.originalUrl,
      },
    });
  } catch (error) {
    console.error("Visitor log error:", error);
  }
  next();
};
