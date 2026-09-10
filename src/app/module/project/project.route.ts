import { Router } from "express";
import { projectController } from "./project.controller";
import { validate } from "../../middleware/validate";
import { projectValidation } from "./project.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.createProjectSchema),
  projectController.createProject,
);

router.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getAllProjects,
);

router.get(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getProjectById,
);

router.patch(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject,
);

router.delete(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.deleteProject,
);

router.post(
  "/:projectId/teams",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.assignTeamSchema),
  projectController.assignTeamToProject,
);

router.delete(
  "/:projectId/teams/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.removeTeamFromProject,
);

export const projectRoutes = router;