import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { teamService } from "./team.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const createTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await teamService.createTeam(organizationId, req.body);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Team created successfully",
      data: result,
    });
  },
);

const getAllTeams = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result = await teamService.getAllTeams(organizationId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Teams retrieved successfully",
      data: result,
    });
  },
);

const getTeamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!teamId) {
      throw new Error("Team ID is required to retrieve a team.");
    }

    const result = await teamService.getTeamById(
      organizationId,
      teamId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Team retrieved successfully",
      data: result,
    });
  },
);

const updateTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await teamService.updateTeam(
      organizationId,
      teamId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Team updated successfully",
      data: result,
    });
  },
);

const deleteTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!teamId) {
      throw new Error("Team ID is required to delete a team.");
    }
    const result = await teamService.deleteTeam(
      organizationId,
      teamId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Team deleted successfully",
      data: result,
    });
  },
);

export const teamController = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
