import { Router } from "express";
import { taskController } from "./task.controller";
import { validate } from "../../middleware/validate";
import { taskValidation } from "./task.schema";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

// Create a new task for a project
router.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.createTaskSchema),
  taskController.createTask,
);

// Get all tasks for a project
router.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTasksByProject,
);

// Get a single task by its ID
router.get(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTaskById,
);

// Update a task by its ID
router.patch(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.updateTaskSchema),
  taskController.updateTask,
);

// Delete a task by its ID
router.delete(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  taskController.deleteTask,
);

export const taskRoutes = router;