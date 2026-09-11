import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { commentService } from "./comment.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { taskId } = req.params;

    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }

    const result = await commentService.createComment(
      organizationId!,
      userId!,
      taskId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Comment added successfully",
      data: result,
    });
  },
);

const getCommentsByTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;

    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }

    const result = await commentService.getCommentsByTask(organizationId!, taskId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { commentId } = req.params;

    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }

    const result = await commentService.updateComment(
      organizationId!,
      userId!,
      commentId as string,
      req.body,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { commentId } = req.params;

    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }

    const result = await commentService.deleteComment(
      organizationId!,
      userId!,
      userRole!,
      commentId as string,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Comment deleted successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
};