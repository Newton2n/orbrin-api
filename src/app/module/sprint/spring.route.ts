import { Router } from "express";
import { sprintController } from "./sprint.controller";
import { validate } from "../../middleware/validate";
import { sprintValidation } from "./sprint.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

// Create a new sprint for a project
router.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.createSprintSchema),
  sprintController.createSprint,
);

// Get all sprints for a project
router.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintsByProject,
);

// Get a single sprint by its ID
router.get(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintById,
);

// Update a sprint by its ID
router.patch(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.updateSprintSchema),
  sprintController.updateSprint,
);

// Delete a sprint by its ID
router.delete(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN),
  sprintController.deleteSprint,
);

export const sprintRoutes = router;