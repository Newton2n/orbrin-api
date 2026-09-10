import { Router } from "express";
import { teamController } from "./team.controller";
import { validate } from "../../middleware/validate";
import { teamValidation } from "./team.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

// Create a new team
router.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.createTeamSchema),
  teamController.createTeam,
);

// Get all teams for an organization
router.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getAllTeams,
);

// Get a team by its ID
router.get(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getTeamById,
);

//  Update a team by its ID
router.patch(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.updateTeamSchema),
  teamController.updateTeam,
);

// Delete a team by its ID
router.delete(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  teamController.deleteTeam,
);

export const teamRoutes = router;