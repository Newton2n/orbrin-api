import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { organizationController } from "./organization.controller";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { updateMemberRoleValidationSchema, updateMemberStatusValidationSchema, updateOrganizationValidationSchema } from "./organization.schema";

const router = Router();

// Get the current user's organization
router.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  organizationController.getMyOrganization,
);

// Update the current user's organization
router.patch(
  "/me",
  authMiddleware.auth(Role.ADMIN),
  validate(updateOrganizationValidationSchema),
  organizationController.updateOrganization,
);

// Delete the current user's organization
router.delete(
  "/me",
  authMiddleware.auth(Role.ADMIN),
  organizationController.deleteOrganization,
);

// Get all members of the current user's organization
router.get(
  "/members",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  organizationController.getOrganizationMembers,
);

// Get a specific member of the current user's organization by ID
router.get(
  "/members/:memberId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  organizationController.getOrganizationMemberById,
);

// Update a member's role in the current user's organization
router.patch(
  "/members/:memberId/role",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(updateMemberRoleValidationSchema),
  organizationController.updateMemberRole,
);

// Update a member's status in the current user's organization
router.patch(
  "/members/:memberId/status",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(updateMemberStatusValidationSchema),
  organizationController.updateMemberStatus,
);

// Remove a member from the current user's organization
router.delete(
  "/members/:memberId",
  authMiddleware.auth(Role.ADMIN),
  organizationController.removeMember,
);

// Leave the current user's organization
router.post(
  "/leave",
  authMiddleware.auth(Role.ADMIN),
  organizationController.leaveOrganization,
);

export const organizationRoutes = router;
