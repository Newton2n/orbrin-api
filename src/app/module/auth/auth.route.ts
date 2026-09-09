import { Router } from "express";
import { authController, authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authValidation } from "./auth.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/register-owner",
  validate(authValidation.registerOrgOwnerSchema),
  authController.registerOrgOwner,
);

router.post(
  "/register-member",
  validate(authValidation.registerMemberSchema),
  authController.registerMember,
);

router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login,
);

router.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.getMe,
);

router.post(
  "/refresh-token",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.refreshToken,
);

export const authRoutes = router;
