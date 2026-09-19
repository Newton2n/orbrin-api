import { Router } from "express";

import { teamController } from "./team.controller";

import { validate, validateQuery } from "../../middleware/validate";

import { teamValidation } from "./team.schema";

import { authMiddleware } from "../../middleware/auth";

import { Role } from "../../../../prisma/generated/prisma/enums";

import { subscriptionCheck } from "../../middleware/subscription-check";

import { emailVerificationMiddleware } from "../../middleware/email-verified";

const router = Router();

// Create a new team
router.post(
	"/",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(teamValidation.createTeamSchema),
	teamController.createTeam,
);

// Get all teams for an organization
router.get(
	"/",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validateQuery(teamValidation.teamQuerySchema),
	teamController.getAllTeams,
);

// Get team members
router.get(
	"/:teamId/members",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	teamController.getTeamMembers,
);

// Add a member to a team
router.post(
	"/:teamId/members",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(teamValidation.addTeamMemberValidationSchema),
	teamController.addTeamMember,
);

// Remove a member from a team
router.delete(
	"/:teamId/members/:userId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	teamController.removeTeamMember,
);

// Get a team by its ID
router.get(
	"/:teamId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	teamController.getTeamById,
);

// Update a team by its ID
router.patch(
	"/:teamId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(teamValidation.updateTeamSchema),
	teamController.updateTeam,
);

// Delete a team by its ID
router.delete(
	"/:teamId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	teamController.deleteTeam,
);

export const teamRoutes = router;
