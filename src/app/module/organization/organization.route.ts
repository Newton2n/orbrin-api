import { Router } from "express";

import { organizationController } from "./organization.controller";

const router = Router();

router.post(
	"/",
	organizationController.createOrganization,
);

router.get(
	"/me",
	organizationController.getMyOrganization,
);

router.patch(
	"/me",
	organizationController.updateOrganization,
);

router.delete(
	"/me",
	organizationController.deleteOrganization,
);

router.get(
	"/members",
	organizationController.getOrganizationMembers,
);

router.get(
	"/members/:memberId",
	organizationController.getOrganizationMemberById,
);

router.patch(
	"/members/:memberId/role",
	organizationController.updateMemberRole,
);

router.patch(
	"/members/:memberId/status",
	organizationController.updateMemberStatus,
);

router.delete(
	"/members/:memberId",
	organizationController.removeMember,
);

router.post(
	"/leave",
	organizationController.leaveOrganization,
);

export const organizationRoutes = router;