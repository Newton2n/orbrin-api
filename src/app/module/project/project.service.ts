import { prisma } from "../../lib/prisma";
import { cloudinaryService } from "../../services/cloudinary";

import type {
  ICreateProjectPayload,
  IUpdateProjectPayload,
} from "./project.interface";

const createProject = async (
  organizationId: string,
  payload: ICreateProjectPayload,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new Error("Project document is required.");
  }

  if (file.mimetype !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

const uploadedDocument = await cloudinaryService.uploadBuffer(
  file.buffer,
  {
    folder: `orbrin/organizations/${organizationId}/projects`,
    resourceType: "image",
    publicId: crypto.randomUUID(),
  },
);

  try {
    const project = await prisma.project.create({
      data: {
        name: payload.name,
        description: payload.description,
        organizationId,
        documentUrl: uploadedDocument.secureUrl,
        documentPublicId: uploadedDocument.publicId,
      },
    });

    return project;
  } catch (error) {
    // Database failed, so remove the uploaded PDF.
    try {
      await cloudinaryService.deleteAsset(
        uploadedDocument.publicId,
        "raw",
      );
    } catch (cleanupError) {
      console.error(
        "Failed to clean up uploaded project document:",
        cleanupError,
      );
    }

    throw error;
  }
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
const getProjectById = async (
  organizationId: string,
  projectId: string,
) => {
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
    throw new Error("Project not found.");
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
    throw new Error("Project not found.");
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: payload,
  });

  return updatedProject;
};

// Delete a project by its ID (soft delete)
const deleteProject = async (
  organizationId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return updatedProject;
};

// Assign a team to a project
const assignTeamToProject = async (
  organizationId: string,
  projectId: string,
  teamId: string,
) => {
  // Verify project belongs to the tenant.
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  // Verify team belongs to the tenant.
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!team) {
    throw new Error("Team not found.");
  }

  // Check if the team is already assigned.
  const existingAssignment = await prisma.projectTeam.findFirst({
    where: {
      projectId,
      teamId,
    },
  });

  if (existingAssignment) {
    throw new Error(
      "Team is already assigned to this project.",
    );
  }

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
  // Verify project belongs to the tenant.
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  // Verify team belongs to the same tenant.
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null,
    },
  });

  if (!team) {
    throw new Error("Team not found.");
  }

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

// Upload or replace project PDF document
// Upload or replace project PDF document
const uploadProjectDocument = async (
  organizationId: string,
  projectId: string,
  file: Express.Multer.File,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      documentUrl: true,
      documentPublicId: true,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  if (!file) {
    throw new Error("Project document is required.");
  }

  if (file.mimetype !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  // Upload new PDF first
  const uploadedDocument = await cloudinaryService.uploadBuffer(
    file.buffer,
    {
      folder: `orbrin/organizations/${organizationId}/projects`,
      resourceType: "image",
      publicId: crypto.randomUUID(),
    },
  );

  try {
    // Update database with the new document
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        documentUrl: uploadedDocument.secureUrl,
        documentPublicId: uploadedDocument.publicId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        documentUrl: true,
        documentPublicId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Delete old document AFTER database update succeeds
    if (project.documentPublicId) {
      try {
        await cloudinaryService.deleteAsset(
          project.documentPublicId,
          "image",
        );
      } catch (error) {
        // Don't fail the request if old Cloudinary asset
        // could not be deleted.
        console.error(
          "Failed to delete old project document from Cloudinary:",
          error,
        );
      }
    }

    return updatedProject;
  } catch (error) {
    // Database update failed.
    // Remove the newly uploaded PDF from Cloudinary.
    try {
      await cloudinaryService.deleteAsset(
        uploadedDocument.publicId,
        "image",
      );
    } catch (cleanupError) {
      console.error(
        "Failed to clean up newly uploaded project document:",
        cleanupError,
      );
    }

    throw error;
  }
};

// Delete project PDF document
const deleteProjectDocument = async (
  organizationId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      documentPublicId: true,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  if (!project.documentPublicId) {
    throw new Error("Project document not found.");
  }

  // Delete the PDF from Cloudinary as a RAW resource.
  await cloudinaryService.deleteAsset(
    project.documentPublicId,
    "raw",
  );

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      documentUrl: null,
      documentPublicId: null,
    },
    select: {
      id: true,
      name: true,
      documentUrl: true,
      documentPublicId: true,
    },
  });

  return updatedProject;
};

export const projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject,
  uploadProjectDocument,
  deleteProjectDocument,
};