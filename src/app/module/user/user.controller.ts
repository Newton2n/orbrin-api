import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catch-async";
import { sendSuccessResponse } from "../../utils/response";
import { userService } from "./user.service";

const getMyProfile = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.id) {
			throw new Error("User ID is missing in the request context.");
		}

		const result = await userService.getMyProfile(req.user.id);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Profile retrieved successfully",
			data: result,
		});
	},
);

const updateMyProfile = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.id) {
			throw new Error("User ID is missing in the request context.");
		}

		const result = await userService.updateMyProfile(req.user.id, req.body);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Profile updated successfully",
			data: result,
		});
	},
);

const changePassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.id) {
			throw new Error("User ID is missing in the request context.");
		}

		await userService.changePassword(req.user.id, req.body);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Password changed successfully",
			data: null,
		});
	},
);

const forgotPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		await userService.forgotPassword(req.body);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message:
				"If an account with this email exists, a password reset link has been sent.",
			data: null,
		});
	},
);

const resetPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		await userService.resetPassword(req.body);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Password reset successfully",
			data: null,
		});
	},
);

const updateUserStatus = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = req.user;
		const adminOrganizationId = admin?.organizationId;
		if (!adminOrganizationId) {
			throw new Error(
				"Admin organization ID is missing in the request context.",
			);
		}
		const { userId } = req.params;

		if (!userId) {
			throw new Error("User ID is required to update user status.");
		}

		const result = await userService.updateUserStatus(
			userId as string,
			adminOrganizationId,
			req.body,
		);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "User status updated successfully",
			data: result,
		});
	},
);

const deleteMyAccount = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.id) {
			throw new Error("User ID is missing in the request context.");
		}

		await userService.deleteMyAccount(req.user.id);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Account deleted successfully",
			data: null,
		});
	},
);
const updateProfileImage = catchAsync(async (req: Request, res: Response) => {
	if (!req.user?.id) {
		throw new Error("User ID is missing in the request context.");
	}

	if (!req.file) {
		throw new Error("Profile picture is required.");
	}

	const result = await userService.updateProfileImage(req.user.id, req.file);

	sendSuccessResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Profile picture updated successfully",
		data: result,
	});
});

const deleteProfileImage = catchAsync(async (req: Request, res: Response) => {
	if (!req.user?.id) {
		throw new Error("User ID is missing in the request context.");
	}

	const result = await userService.deleteProfileImage(req.user.id);

	sendSuccessResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Profile picture deleted successfully",
		data: result,
	});
});
export const userController = {
	getMyProfile,
	updateMyProfile,
	changePassword,
	forgotPassword,
	resetPassword,
	updateUserStatus,
	deleteMyAccount,
	updateProfileImage,
	deleteProfileImage,
};
