import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import { createPaginationMeta, getPagination } from "../../utils/query";
import type { z } from "zod";
import type { commentValidation } from "./comment.schema";
import type {
	ICreateCommentPayload,
	IUpdateCommentPayload,
} from "./comment.interface";

// Create a new comment for a specific task
const createComment = async (
	organizationId: string,
	userId: string,
	taskId: string,
	payload: ICreateCommentPayload,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			project: {
				organizationId,
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	const comment = await prisma.comment.create({
		data: {
			content: payload.content,
			taskId,
			authorId: userId,
		},
		include: {
			author: {
				select: {
					id: true,
					fullName: true,
					email: true,
				},
			},
		},
	});

	return comment;
};

// Get all comments for a specific task
const getCommentsByTask = async (
	organizationId: string,
	taskId: string,
	query: z.infer<typeof commentValidation.commentQuerySchema>,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			project: {
				organizationId,
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!task) {
		throw new Error("Task not found");
	}

	const { page, limit, search, sortBy, sortOrder } = query;
	const where: Prisma.CommentWhereInput = {
		taskId,
		deletedAt: null,
		...(search ? { content: { contains: search, mode: "insensitive" } } : {}),
	};

	const [comments, total] = await prisma.$transaction([
		prisma.comment.findMany({
			where,
			...getPagination(page, limit),
			include: {
				author: { select: { id: true, fullName: true, email: true } },
			},
			orderBy: { [sortBy]: sortOrder },
		}),
		prisma.comment.count({ where }),
	]);

	return {
		data: comments,
		pagination: createPaginationMeta(page, limit, total),
	};
};

// Update a comment by its ID
const updateComment = async (
	organizationId: string,
	userId: string,
	commentId: string,
	payload: IUpdateCommentPayload,
) => {
	const comment = await prisma.comment.findFirst({
		where: {
			id: commentId,
			task: {
				project: {
					organizationId,
					deletedAt: null,
				},
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!comment) {
		throw new Error("Comment not found");
	}

	if (comment.authorId !== userId) {
		throw new Error("Unauthorized to update this comment");
	}

	const updatedComment = await prisma.comment.update({
		where: { id: commentId },
		data: { content: payload.content },
		include: {
			author: {
				select: {
					id: true,
					fullName: true,
					email: true,
				},
			},
		},
	});

	return updatedComment;
};

// Delete a comment by its ID
const deleteComment = async (
	organizationId: string,
	userId: string,
	userRole: string,
	commentId: string,
) => {
	const comment = await prisma.comment.findFirst({
		where: {
			id: commentId,
			task: {
				project: {
					organizationId,
					deletedAt: null,
				},
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!comment) {
		throw new Error("Comment not found");
	}

	// Allow author, ADMIN, or MANAGER to delete comments
	if (
		comment.authorId !== userId &&
		userRole !== "ADMIN" &&
		userRole !== "MANAGER"
	) {
		throw new Error("Unauthorized to delete this comment");
	}

	const deletedComment = await prisma.comment.update({
		where: { id: commentId },
		data: { deletedAt: new Date() },
	});

	return deletedComment;
};

export const commentService = {
	createComment,
	getCommentsByTask,
	updateComment,
	deleteComment,
};
