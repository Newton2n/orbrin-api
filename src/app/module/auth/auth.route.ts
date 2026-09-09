import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authValidation } from "./auth.schema";

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

  authController.getMe,
);

router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
