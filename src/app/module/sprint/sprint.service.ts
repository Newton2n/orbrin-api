import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import { createPaginationMeta, getPagination } from "../../utils/query";
import type { z } from "zod";
import type { sprintValidation } from "./sprint.schema";
import type {
	ICreateSprintPayload,
	IUpdateSprintPayload,
} from "./sprint.interface";

const createSprint = async (
	organizationId: string,
	projectId: string,
	payload: ICreateSprintPayload,
) => {
	const project = await prisma.project.findFirst({
		where: { id: projectId, organizationId, deletedAt: null },
	});

	if (!project) {
		throw new Error("Project not found");
	}

	const sprint = await prisma.sprint.create({
		data: {
			name: payload.name,
			goal: payload.goal,
			status: payload.status || "PLANNING",
			startDate: payload.startDate ? new Date(payload.startDate) : undefined,
			endDate: payload.endDate ? new Date(payload.endDate) : undefined,
			projectId,
		},
	});

	return sprint;
};

const getSprintsByProject = async (
	organizationId: string,
	projectId: string,
	query: z.infer<typeof sprintValidation.sprintQuerySchema>,
) => {
	const project = await prisma.project.findFirst({
		where: { id: projectId, organizationId, deletedAt: null },
	});

	if (!project) {
		throw new Error("Project not found");
	}

	const { page, limit, search, sortBy, sortOrder, status } = query;
	const where: Prisma.SprintWhereInput = {
		projectId,
		deletedAt: null,
		...(status ? { status } : {}),
		...(search
			? {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ goal: { contains: search, mode: "insensitive" } },
					],
				}
			: {}),
	};

	const [sprints, total] = await prisma.$transaction([
		prisma.sprint.findMany({
			where,
			...getPagination(page, limit),
			orderBy: { [sortBy]: sortOrder },
			include: { tasks: true },
		}),
		prisma.sprint.count({ where }),
	]);

	return {
		data: sprints,
		pagination: createPaginationMeta(page, limit, total),
	};
};

const getSprintById = async (organizationId: string, sprintId: string) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				organizationId,
				deletedAt: null,
			},
			deletedAt: null,
		},
		include: {
			project: true,
			tasks: true,
		},
	});

	if (!sprint) {
		throw new Error("Sprint not found");
	}

	return sprint;
};

const updateSprint = async (
	organizationId: string,
	sprintId: string,
	payload: IUpdateSprintPayload,
) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				organizationId,
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!sprint) {
		throw new Error("Sprint not found");
	}

	const updateData: IUpdateSprintPayload = { ...payload };

	// Update startDate and endDate if they are provided in the payload
	if (payload.startDate) {
		updateData.startDate = new Date(payload.startDate);
	}

	if (payload.endDate) {
		updateData.endDate = new Date(payload.endDate);
	}

	const updatedSprint = await prisma.sprint.update({
		where: { id: sprintId },
		data: updateData,
	});

	return updatedSprint;
};

const deleteSprint = async (organizationId: string, sprintId: string) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				organizationId,
				deletedAt: null,
			},
			deletedAt: null,
		},
	});

	if (!sprint) {
		throw new Error("Sprint not found");
	}

	const deletedSprint = await prisma.sprint.update({
		where: { id: sprintId },
		data: { deletedAt: new Date() },
	});

	return deletedSprint;
};

export const sprintService = {
	createSprint,
	getSprintsByProject,
	getSprintById,
	updateSprint,
	deleteSprint,
};
