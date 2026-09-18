import type { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../lib/redis";

const ratelimit = new Ratelimit({
	redis,

	// Maximum 25 requests per IP per 1 minute
	limiter: Ratelimit.slidingWindow(25, "1 m"),

	prefix: "orbrin:rate-limit",

	analytics: true,
});

const rateLimiter = async (
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

		const { success, limit, reset, pending } =
			await ratelimit.limit(identifier);

		const resetInSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));

		await pending;

		res.setHeader("RateLimit-Limit", limit);
		res.setHeader("RateLimit-Reset", reset);

		if (!success) {
			res.status(429).json({
				success: false,
				message: "Rate limit exceeded",
				errors: [
					{
						message: "Too many requests. Please try again later.",
						limit,
						resetInSeconds,
					},
				],
			});

			return;
		}

		next();
	} catch (error) {
		console.error("Rate limiter error:", error);

		// In case of an error, allow the request to proceed
		next();
	}
};

export default rateLimiter;
