import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { teamService } from "./team.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import type { teamValidation } from "./team.schema";
import { AppError } from "../../utils/app-error";

const createTeam = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const organizationId = req.user?.organizationId;

		if (!organizationId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
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
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}

		const query = req.validatedQuery as z.infer<
			typeof teamValidation.teamQuerySchema
		>;
		const result = await teamService.getAllTeams(organizationId, query);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Teams retrieved successfully",
			data: result.data,
			pagination: result.pagination,
		});
	},
);

const getTeamById = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const organizationId = req.user?.organizationId;
		const { teamId } = req.params;
		if (!organizationId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}
		if (!teamId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Team ID is required to retrieve a team.",
			);
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
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}
		if (!req.user?.id) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"User ID is missing in the request context.",
			);
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
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"User ID is missing in the request context.",
			);
		}
		const organizationId = req.user?.organizationId;
		const { teamId } = req.params;
		if (!organizationId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}

		if (!teamId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Team ID is required to delete a team.",
			);
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

const addTeamMember = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { teamId } = req.params;
		const { userId } = req.body;

		const organizationId = req.user!.organizationId;

		const result = await teamService.addTeamMember(
			organizationId,
			teamId as string,
			userId,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Member added to team successfully.",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const getTeamMembers = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { teamId } = req.params;

		const organizationId = req.user!.organizationId;

		const result = await teamService.getTeamMembers(
			organizationId,
			teamId as string,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Team members retrieved successfully.",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const removeTeamMember = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { teamId, userId } = req.params;

		const organizationId = req.user!.organizationId;

		await teamService.removeTeamMember(
			organizationId,
			teamId as string,
			userId as string,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Member removed from team successfully.",
			data: null,
		});
	} catch (error) {
		next(error);
	}
};

export const teamController = {
	createTeam,
	getAllTeams,
	getTeamById,
	updateTeam,
	deleteTeam,
	addTeamMember,
	getTeamMembers,
	removeTeamMember,
};
