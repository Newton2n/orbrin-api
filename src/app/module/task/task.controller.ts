import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { taskService } from "./task.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../../../prisma/generated/prisma/client";

const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { projectId } = req.params;

    if(!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    if(!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if(!userId) {
      throw new Error("User ID is missing in the request context.");
    }

    const result = await taskService.createTask(
      organizationId,
      userId,
      projectId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Task created successfully",
      data: result,
    });
  },
);

const getTasksByProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await taskService.getTasksByProject(organizationId!, projectId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Tasks retrieved successfully",
      data: result,
    });
  },
);

const getTaskById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.getTaskById(organizationId, taskId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Task retrieved successfully",
      data: result,
    });
  },
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    const user = req.user;
    const userId = user?.id
    const role = user?.role
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }

     
    
  
    const result = await taskService.updateTask(organizationId as string, taskId as string, req.body,userId as string,role as Role);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Task updated successfully",
      data: result,
    });
  },
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.deleteTask(organizationId, taskId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Task deleted successfully",
      data: result,
    });
  },
);

export const taskController = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};