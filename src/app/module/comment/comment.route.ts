import { Router } from "express";

import { commentController } from "./comment.controller";
import { validate, validateQuery } from "../../middleware/validate";
import { commentValidation } from "./comment.schema";
import { authMiddleware } from "../../middleware/auth";
import { subscriptionCheck } from "../../middleware/subscription-check";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { emailVerificationMiddleware } from "../../middleware/email-verified";

const router = Router();

// Add a comment to a task
router.post(
	"/tasks/:taskId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	subscriptionCheck,
	emailVerificationMiddleware,
	validate(commentValidation.createCommentSchema),
	commentController.createComment,
);

// Get all comments for a task
router.get(
	"/tasks/:taskId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	validateQuery(commentValidation.commentQuerySchema),
	commentController.getCommentsByTask,
);

// Update a comment by ID
router.patch(
	"/:commentId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(commentValidation.updateCommentSchema),
	commentController.updateComment,
);

// Delete a comment by ID
router.delete(
	"/:commentId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	commentController.deleteComment,
);

export const commentRoutes = router;
