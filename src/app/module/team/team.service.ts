import { prisma } from "../../lib/prisma";
import { ICreateTeamPayload, IUpdateTeamPayload } from "./team.interface";


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

  if (existingTeam) {
    throw new Error(
      "A team with this name already exists in the organization.",
    );
  }

  const team = await prisma.team.create({
    data: {
      name: payload.name,
      description: payload.description,
      organizationId,
    },
  });

  return team;
};


// Get all teams for an organization
const getAllTeams = async (organizationId: string) => {
  const teams = await prisma.team.findMany({
    where: {
      organizationId,
      deletedAt: null,
    },
    include: {
      teamMembers: true,
    },
  });

  return teams;
};

// Get a team by its ID
const getTeamById = async (organizationId: string, teamId: string) => {



  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null,
    },
    include: {
      teamMembers: true,
    },
  });

  if (!team) {
    throw new Error("Team not found");
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
    throw new Error("Team not found");
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
    throw new Error("Team not found");
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
