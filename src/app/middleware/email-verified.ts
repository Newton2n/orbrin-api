import type { NextFunction, Request, Response } from "express";

export const emailVerificationMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		res.status(401).json({
			success: false,
			message: "You are not logged in. Please log in to access this resource.",
			errors: [],
		});
		return;
	}

	const user = req.user;

	if (!user) {
		res.status(404).json({
			success: false,
			message: "User not found.",
			errors: [],
		});
		return;
	}

	if (!user.emailVerified) {
		res.status(403).json({
			success: false,
			message: "Please verify your email before accessing this resource.",
			errors: [],
		});
		return;
	}

	next();
};
