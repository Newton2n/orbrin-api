import { IssueData } from "zod/v3";
import { Role, TaskStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateTaskPayload,
  IUpdateTaskPayload,
  ITaskQueryFilters,
} from "./task.interface";

// Create a new task for a specific project
const createTask = async (
  organizationId: string,
  userId: string,
  projectId: string,
  payload: ICreateTaskPayload,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Validate status and priority values
  if (
    payload.status &&
    !["TODO", "IN_PROGRESS", "DONE"].includes(payload.status)
  ) {
    throw new Error("Invalid status value");
  }


  // Validate priority value
  if (
    payload.priority &&
    !["LOW", "MEDIUM", "HIGH"].includes(payload.priority)
  ) {
    throw new Error("Invalid priority value");
  }
  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || "TODO",
      priority: payload.priority || "MEDIUM",
      assigneeId: payload.assigneeId,
      creatorId: userId,
      projectId,
    },
  });

  return task;
};

// Get all tasks for a specific project
const getTasksByProject = async (organizationId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      deletedAt: null,
    },
  });

  return tasks;
};

// Get a single task by its ID
const getTaskById = async (organizationId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null,
      },
      deletedAt: null,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

// Update a task by its ID
const updateTask = async (
  organizationId: string,
  taskId: string,
  payload: IUpdateTaskPayload,
  userId: string,
  role : Role
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: {
        organizationId,
        deletedAt: null,
      },
    },
    
  });
 

  if (!task) {
    throw new Error("Task not found");
  }

  if(task.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN && task.assigneeId !== userId){
    throw new Error("You are not authorized to update this task");
  }

  console.log("role",role)
  if(payload.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN){
    throw new Error("You are not authorized to assign this task");
  }

  const updateData :IUpdateTaskPayload = { ...payload };

  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return updatedTask;
};

// Delete a task by its ID
const deleteTask = async (organizationId: string, taskId: string) => {
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

  const deletedTask = await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });

  return deletedTask;
};

export const taskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
