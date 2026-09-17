import { Router } from "express";
import { projectController } from "./project.controller";
import { validate } from "../../middleware/validate";
import { projectValidation } from "./project.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { subscriptionCheck } from "../../middleware/subscription-check";
import { uploadPdf } from "../../middleware/multer";

const router = Router();

// Create a new project
router.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  uploadPdf.single("document"),
  validate(projectValidation.createProjectSchema),
  projectController.createProject,
);

// Get all projects for an organization
router.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getAllProjects,
);

// Get a project by its ID
router.get(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getProjectById,
);

// Update a project by its ID
router.patch(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject,
);

// Delete a project by its ID
router.delete(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  projectController.deleteProject,
);

// Assign a team to a project
router.post(
  "/:projectId/teams",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  validate(projectValidation.assignTeamSchema),
  projectController.assignTeamToProject,
);

// Remove a team from a project
router.delete(
  "/:projectId/teams/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  projectController.removeTeamFromProject,
);

router.patch(
  "/:projectId/document",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  uploadPdf.single("document"),
  projectController.uploadProjectDocument,
);

router.delete("/:projectId/document", projectController.deleteProjectDocument);

export const projectRoutes = router;
