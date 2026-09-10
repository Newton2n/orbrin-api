import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { projectService } from "./project.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const createProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result = await projectService.createProject(organizationId, req.body);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Project created successfully",
      data: result,
    });
  },
);

const getAllProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getAllProjects(organizationId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Projects retrieved successfully",
      data: result,
    });
  },
);

const getProjectById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getProjectById(
      organizationId,
      projectId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Project retrieved successfully",
      data: result,
    });
  },
);

const updateProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.updateProject(
      organizationId,
      projectId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Project updated successfully",
      data: result,
    });
  },
);

const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.deleteProject(
      organizationId,
      projectId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Project deleted successfully",
      data: result,
    });
  },
);

const assignTeamToProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    const { teamId } = req.body;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result = await projectService.assignTeamToProject(
      organizationId,
      projectId as string,
      teamId,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Team assigned to project successfully",
      data: result,
    });
  },
);

const removeTeamFromProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { projectId, teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result = await projectService.removeTeamFromProject(
      organizationId,
      projectId as string,
      teamId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Team removed from project successfully",
      data: result,
    });
  },
);



export const projectController = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
    assignTeamToProject,
    removeTeamFromProject,
};
