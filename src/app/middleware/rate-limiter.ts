import { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import config from "../config";

const redis = new Redis({
  url: config.upstash_redis_rest_url as string,
  token: config.upstash_redis_rest_token as string,
});

const ratelimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(25, "1 m"),

  prefix: "orbrin:rate-limit",

  analytics: true,
});

const reliableRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];

    let ip: string;

    if (Array.isArray(forwardedFor)) {
      ip = forwardedFor[0];
    } else if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else {
      ip = req.ip ?? "unknown-ip";
    }

    const identifier = `ip:${ip}`;

    const { success, limit, remaining, reset, pending } =
      await ratelimit.limit(identifier);

    await pending;

    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", reset);

    if (!success) {
      res.status(429).json({
        status: 429,
        error: "Too Many Requests",
        message:
          "Rate threshold exceeded. Please slow down and try again later.",
        limit,
        remaining,
        reset,
      });

      return;
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);

    next();
  }
};

export default reliableRateLimiter;
