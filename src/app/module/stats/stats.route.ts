
import { Router } from "express";

import { statsController } from "./stats.controller";
import { statsValidation } from "./stats.schema";
import { validateQuery } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

// Admin dashboard, including organization billing statistics.
router.get(
  "/admin",
  authMiddleware.auth(Role.ADMIN),
  statsController.getAdminOverview,
);

// Manager dashboard, excluding billing information.
router.get(
  "/manager",
  authMiddleware.auth(Role.MANAGER),
  statsController.getManagerOverview,
);

// Authenticated member's personal dashboard.
router.get(
  "/member",
  authMiddleware.auth(Role.MEMBER),
  statsController.getMemberOverview,
);

// Organization report, accessible to admins only.
router.get(
  "/reports",
  authMiddleware.auth(Role.ADMIN),
  validateQuery(statsValidation.reportQuerySchema),
  statsController.getReports,
);

export const statsRouter = router;
