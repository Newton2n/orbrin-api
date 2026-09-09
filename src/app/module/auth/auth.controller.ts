import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { authService } from "./auth.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const registerOrgOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerOrgOwner(req.body);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Organization and Owner account created successfully",
      data: result,
    });
  },
);

const registerMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerMember(req.body);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Member account created and joined organization successfully",
      data: result,
    });
  },
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken, jwtPayload } = await authService.login(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "User logged in successfully",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken,
      },
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Cannot fetch user, please log in again");
    }

    const result = await authService.getMe(userId);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "User data retrieved successfully",
      data: result,
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken: token } = req.cookies;
    if (!token) {
      throw new Error("No refresh token provided. Please log in again.");
    }

    const { accessToken, jwtPayload } = await authService.refreshToken(token);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Access token generated successfully",
      data: {
        accessToken,
        user: jwtPayload,
      },
    });
  },
);

const google = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken, jwtPayload } = await authService.google(
      req.body.idToken,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "User logged in successfully via Google",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken,
      },
    });
  },
);

export const authController = {
  registerOrgOwner,
  registerMember,
  login,
  getMe,
  refreshToken,
  google,
};
