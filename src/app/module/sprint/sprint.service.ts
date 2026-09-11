import { prisma } from "../../lib/prisma";
import {
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

const getSprintsByProject = async (organizationId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprints = await prisma.sprint.findMany({
    where: {
      projectId,
      deletedAt: null,
    },
    include: {
      tasks: true,
    },
  });

  return sprints;
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


  const updateData:IUpdateSprintPayload = { ...payload };

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