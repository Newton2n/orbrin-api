import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { organizationController } from "./organization.controller";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import {
	updateMemberRoleValidationSchema,
	updateMemberStatusValidationSchema,
	updateOrganizationValidationSchema,
	organizationMemberQuerySchema,
} from "./organization.schema";
import { uploadImage } from "../../middleware/multer";
import { emailVerificationMiddleware } from "../../middleware/email-verified";

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
	emailVerificationMiddleware,
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
	emailVerificationMiddleware,
	validateQuery(organizationMemberQuerySchema),
	organizationController.getOrganizationMembers,
);

// Get a specific member of the current user's organization by ID
router.get(
	"/members/:memberId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	organizationController.getOrganizationMemberById,
);

// Update a member's role in the current user's organization
router.patch(
	"/members/:memberId/role",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	validate(updateMemberRoleValidationSchema),
	organizationController.updateMemberRole,
);

// Update a member's status in the current user's organization
router.patch(
	"/members/:memberId/status",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	validate(updateMemberStatusValidationSchema),
	organizationController.updateMemberStatus,
);

// Remove a member from the current user's organization
router.delete(
	"/members/:memberId",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	organizationController.removeMember,
);

// Leave the current user's organization
router.post(
	"/leave",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	organizationController.leaveOrganization,
);

// update organization logo
router.patch(
	"/me/logo",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	uploadImage.single("image"),
	organizationController.updateOrganizationLogo,
);

// delete organization logo
router.delete(
	"/me/logo",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	organizationController.deleteOrganizationLogo,
);

export const organizationRoutes = router;
