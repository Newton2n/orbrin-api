
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { statsService } from "./stats.service";
import { statsValidation } from "./stats.schema";
import { AppError } from "../../utils/app-error";
import { sendSuccessResponse } from "../../utils/response";
import catchAsync from "../../utils/catch-async";

const getOrganizationId = (req: Request): string => {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Organization ID is missing in the request context.",
    );
  }

  return organizationId;
};

const getAuthenticatedUserId = (req: Request): string => {
  const authUser = req.user as
    | ({ id?: string; userId?: string } & {
        organizationId?: string;
      })
    | undefined;

  const userId = authUser?.userId ?? authUser?.id;

  if (!userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Authenticated user ID is missing from the request context.",
    );
  }

  return userId;
};

const getAdminOverview = catchAsync(
  async (req: Request, res: Response) => {
    const result = await statsService.getOrganizationOverview(
      getOrganizationId(req),
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin dashboard statistics retrieved successfully",
      data: result,
    });
  },
);

const getManagerOverview = catchAsync(
  async (req: Request, res: Response) => {
    const result = await statsService.getOrganizationOverview(
      getOrganizationId(req),
    );

    // Billing information is restricted to the admin dashboard.
    const { billing, ...managerStats } = result;

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Manager dashboard statistics retrieved successfully",
      data: managerStats,
    });
  },
);

const getMemberOverview = catchAsync(
  async (req: Request, res: Response) => {
    const result = await statsService.getMemberOverview(
      getOrganizationId(req),
      getAuthenticatedUserId(req),
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Member dashboard statistics retrieved successfully",
      data: result,
    });
  },
);

const getReports = catchAsync(
  async (req: Request, res: Response) => {
    const query = statsValidation.reportQuerySchema.parse(req.query);

    const result = await statsService.getOrganizationOverview(
      getOrganizationId(req),
      {
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
      },
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Dashboard report generated successfully",
      data: result,
    });
  },
);

export const statsController = {
  getAdminOverview,
  getManagerOverview,
  getMemberOverview,
  getReports,
};
