import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catch-async";
import { sendSuccessResponse } from "../../utils/response";

import { organizationService } from "./organization.service";
import type { z } from "zod";
import type { organizationMemberQuerySchema } from "./organization.schema";

const getMyOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    console.log("organizationId", req.user);
    if (!organizationId) {
      throw new Error("Organization ID is missing ");
    }

    const result = await organizationService.getMyOrganization(organizationId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization retrieved successfully",
      data: result,
    });
  },
);

const updateOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result = await organizationService.updateOrganization(
      organizationId,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization updated successfully",
      data: result,
    });
  },
);

const deleteOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    await organizationService.deleteOrganization(organizationId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization deleted successfully",
      data: null,
    });
  },
);

const getOrganizationMembers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const query = req.validatedQuery as z.infer<
      typeof organizationMemberQuerySchema
    >;
    const result = await organizationService.getOrganizationMembers(
      organizationId,
      query,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization members retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

const getOrganizationMemberById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!memberId) {
      throw new Error("Member ID is required.");
    }

    const result = await organizationService.getOrganizationMemberById(
      organizationId,
      memberId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization member retrieved successfully",
      data: result,
    });
  },
);

const updateMemberRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!memberId) {
      throw new Error("Member ID is required.");
    }

    const result = await organizationService.updateMemberRole(
      organizationId,
      memberId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Member role updated successfully",
      data: result,
    });
  },
);

const updateMemberStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!memberId) {
      throw new Error("Member ID is required.");
    }

    const result = await organizationService.updateMemberStatus(
      organizationId,
      memberId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Member status updated successfully",
      data: result,
    });
  },
);

const removeMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!memberId) {
      throw new Error("Member ID is required.");
    }

    await organizationService.removeMember(organizationId, memberId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Member removed successfully",
      data: null,
    });
  },
);

const leaveOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }

    await organizationService.leaveOrganization(organizationId, req.user.id);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "You left the organization successfully",
      data: null,
    });
  },
);

const updateOrganizationLogo = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    console.log("organizationId", req.user);

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    if (!req.file) {
      throw new Error("Organization logo is required.");
    }

    const result = await organizationService.updateOrganizationLogo(
      organizationId,
      req.file,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization logo updated successfully",
      data: result,
    });
  },
);

const deleteOrganizationLogo = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }

    const result =
      await organizationService.deleteOrganizationLogo(organizationId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Organization logo deleted successfully",
      data: result,
    });
  },
);

export const organizationController = {
  getMyOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  getOrganizationMemberById,
  updateMemberRole,
  updateMemberStatus,
  removeMember,
  leaveOrganization,
  updateOrganizationLogo,
  deleteOrganizationLogo,
};
