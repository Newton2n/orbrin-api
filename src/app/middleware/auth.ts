import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { Role } from "../../../prisma/generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get access token via cookies or headers
    const accessToken = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization;

    if (!accessToken) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }

    // 2. Verify access token
    const verifyAccessToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret!,
    );

    if (!verifyAccessToken.success) {
      throw new Error(verifyAccessToken.error);
    }

    const { id, email, name } = verifyAccessToken.data as JwtPayload;

    // 3. Check user and fetch their organization membership from database
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new Error("User not found. Please log in again.");
    }

    // Optional: If you use user status
    if (user.status !== "ACTIVE") {
      throw new Error(
        "Your account has been suspended or inactive. Please contact support."
      );
    }

    // 4. Ensure the user belongs to an organization (Single-org MVP rule)
    const membership = user.memberships[0]; // Gets their primary organization membership
    if (!membership) {
      throw new Error("User does not belong to any organization.");
    }

    const userRole = membership.role as Role;
    const organizationId = membership.organizationId;

    // 5. Enforce RBAC Role Check
    if (requiredRoles.length && !requiredRoles.includes(userRole)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }

    // 6. Attach contextual data to req.user for downstream controllers
    req.user = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: userRole,
      organizationId: organizationId,
    };

    next();
  });
};

export const authMiddleware = { auth };