import { prisma } from "../../lib/prisma";
import {
  ICreateProjectPayload,
  IUpdateProjectPayload,
} from "./project.interface";

// Create a new project
const createProject = async (
  organizationId: string,
  payload: ICreateProjectPayload,
) => {
  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      organizationId,
    },
  });

  return project;
};

// Get all projects for an organization
const getAllProjects = async (organizationId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      organizationId,
      deletedAt: null,
    },
    include: {
      teams: true,
      tasks: true,
    },
  });

  return projects;
};

// Get a project by its ID
const getProjectById = async (organizationId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
    include: {
      teams: true,
      tasks: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// Update a project by its ID
const updateProject = async (
  organizationId: string,
  projectId: string,
  payload: IUpdateProjectPayload,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: payload,
  });

  return updatedProject;
};

// Delete a project by its ID (soft delete)
const deleteProject = async (organizationId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: new Date() },
  });

  return updatedProject;
};

// Assign a team to a project
const assignTeamToProject = async (
  organizationId: string,
  projectId: string,
  teamId: string,
) => {

  // Verify project belongs to the tenant
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });
  if (!project) throw new Error("Project not found");

  //Verify team belongs to the tenant
  const team = await prisma.team.findFirst({
    where: { id: teamId, organizationId, deletedAt: null },
  });
  if (!team) throw new Error("Team not found");

  // Create the junction record (handling potential duplicate assignments)
  const assignment = await prisma.projectTeam.create({
    data: {
      projectId,
      teamId,
    },
  });

  return assignment;
};

// Remove a team from a project
const removeTeamFromProject = async (
  organizationId: string,
  projectId: string,
  teamId: string,
) => {
  //Verify project belongs to tenant
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });
  if (!project) throw new Error("Project not found");

  // Delete the junction record using the composite ID
  const deletedAssignment = await prisma.projectTeam.delete({
    where: {
      projectId_teamId: {
        projectId,
        teamId,
      },
    },
  });

  return deletedAssignment;
};

export const projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject,
};
