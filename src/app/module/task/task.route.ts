import { Router } from "express";
import { taskController } from "./task.controller";
import { validate, validateQuery } from "../../middleware/validate";
import { taskValidation } from "./task.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { subscriptionCheck } from "../../middleware/subscription-check";
import { emailVerificationMiddleware } from "../../middleware/email-verified";
const router = Router();

// Create a new task for a project
router.post(
	"/projects/:projectId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(taskValidation.createTaskSchema),
	taskController.createTask,
);

// Get all tasks for a project
router.get(
	"/projects/:projectId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validateQuery(taskValidation.taskQuerySchema),
	taskController.getTasksByProject,
);

// Get a single task by its ID
router.get(
	"/:taskId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	taskController.getTaskById,
);

// Update a task by its ID
router.patch(
	"/:taskId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	subscriptionCheck,
	validate(taskValidation.updateTaskSchema),
	taskController.updateTask,
);

// Delete a task by its ID
router.delete(
	"/:taskId",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER),
	emailVerificationMiddleware,
	subscriptionCheck,
	taskController.deleteTask,
);

export const taskRoutes = router;
