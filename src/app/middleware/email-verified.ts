import { NextFunction, Request, Response } from "express";

export const requireEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401).json({
      status: "error",
      message: "You are not logged in. Please log in to access this resource.",
    });
    return;
  }

  const user = req.user;

  if (!user) {
    res.status(404).json({
      status: "error",
      message: "User not found.",
    });
    return;
  }

  if (!user.emailVerified) {
    res.status(403).json({
      status: "error",
      message: "Please verify your email before accessing this resource.",
    });
    return;
  }

  next();
};
