import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { sprintService } from "./sprint.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

// Create a new sprint for a project
const createSprint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }

    const result = await sprintService.createSprint(
      organizationId!,
      projectId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Sprint created successfully",
      data: result,
    });
  },
);

// Get all sprints for a specific project
const getSprintsByProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }

    const result = await sprintService.getSprintsByProject(organizationId!, projectId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Sprints retrieved successfully",
      data: result,
    });
  },
);

// Get a single sprint by its ID
const getSprintById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }

    const result = await sprintService.getSprintById(organizationId, sprintId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Sprint retrieved successfully",
      data: result,
    });
  },
);

// Update a sprint by its ID
const updateSprint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }

    const result = await sprintService.updateSprint(organizationId, sprintId as string, req.body);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Sprint updated successfully",
      data: result,
    });
  },
);

// Delete a sprint by its ID
const deleteSprint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }

    const result = await sprintService.deleteSprint(organizationId, sprintId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Sprint deleted successfully",
      data: result,
    });
  },
);

export const sprintController = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint,
};