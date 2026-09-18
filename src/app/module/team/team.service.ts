import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { StatusCodes } from "http-status-codes";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import { createPaginationMeta, getPagination } from "../../utils/query";
import type { z } from "zod";
import type { teamValidation } from "./team.schema";
import type { ICreateTeamPayload, IUpdateTeamPayload } from "./team.interface";

// Create a new team
const createTeam = async (
	organizationId: string,
	payload: ICreateTeamPayload,
) => {
	const existingTeam = await prisma.team.findFirst({
		where: {
			organizationId,
			name: payload.name,
		},
	});

	if (existingTeam && !existingTeam.deletedAt) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"A team with this name already exists in the organization.",
		);
	}

	if (existingTeam?.deletedAt) {
		// If the team exists but is soft-deleted, we can "un delete" it by updating its deletedAt field to null and updating its description if provided.
		const updatedTeam = await prisma.team.update({
			where: { id: existingTeam.id },
			data: {
				deletedAt: null,
				description: payload.description || existingTeam.description,
			},
		});
		return updatedTeam;
	} else if (!existingTeam) {
		const team = await prisma.team.create({
			data: {
				name: payload.name,
				description: payload.description,
				organizationId,
			},
		});

		return team;
	}
};

// Get all teams for an organization
const getAllTeams = async (
	organizationId: string,
	query: z.infer<typeof teamValidation.teamQuerySchema>,
) => {
	const { page, limit, search, sortBy, sortOrder } = query;
	const where: Prisma.TeamWhereInput = {
		organizationId,
		deletedAt: null,
		...(search
			? {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ description: { contains: search, mode: "insensitive" } },
					],
				}
			: {}),
	};

	const [teams, total] = await prisma.$transaction([
		prisma.team.findMany({
			where,
			...getPagination(page, limit),
			orderBy: { [sortBy]: sortOrder },
			include: { teamMembers: true },
		}),
		prisma.team.count({ where }),
	]);

	return { data: teams, pagination: createPaginationMeta(page, limit, total) };
};

// Get a team by its ID
const getTeamById = async (organizationId: string, teamId: string) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
			deletedAt: null,
		},
		//complex include to fetch related projects and team members
		include: {
			projects: {
				include: {
					project: true,
				},
			},
			teamMembers: true,
		},
	});

	if (!team) {
		throw new AppError(StatusCodes.NOT_FOUND, "Team not found");
	}

	return team;
};

// Update a team by its ID
const updateTeam = async (
	organizationId: string,
	teamId: string,
	payload: IUpdateTeamPayload,
) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!team) {
		throw new AppError(StatusCodes.NOT_FOUND, "Team not found");
	}

	const updatedTeam = await prisma.team.update({
		where: { id: teamId },
		data: payload,
	});

	return updatedTeam;
};

// Delete a team by its ID
const deleteTeam = async (organizationId: string, teamId: string) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!team) {
		throw new AppError(StatusCodes.NOT_FOUND, "Team not found");
	}

	const updatedTeam = await prisma.team.update({
		where: { id: teamId },
		data: { deletedAt: new Date() },
	});

	return updatedTeam;
};

export const teamService = {
	createTeam,
	getAllTeams,
	getTeamById,
	updateTeam,
	deleteTeam,
};
