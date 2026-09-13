import { Router } from "express";
import { authController, authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authValidation } from "./auth.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

// Register Organization Owner routes for authentication
router.post(
  "/register-owner",
  validate(authValidation.registerOrgOwnerSchema),
  authController.registerOrgOwner,
);

//Register Member routes for authentication
router.post(
  "/register-member",
  validate(authValidation.registerMemberSchema),
  authController.registerMember,
);

// local Login route for authentication
router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login,
);

//Get current user details route
router.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.getMe,
);

//Get new access token using refresh token route
router.post(
  "/refresh-token",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.refreshToken,
);

// Google Login route for authentication
router.post(
  "/google-login",
  validate(authValidation.googleLoginSchema),
  authController.googleLogin,
);

export const authRoutes = router;
