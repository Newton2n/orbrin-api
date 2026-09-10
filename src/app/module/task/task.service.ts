import { prisma } from "../../lib/prisma";
import {
  ICreateTaskPayload,
  IUpdateTaskPayload,
  ITaskQueryFilters,
} from "./task.interface";

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

  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: (payload.status as any) || "TODO",
      priority: (payload.priority as any) || "MEDIUM",
      assigneeId: payload.assigneeId,
      creatorId: userId, 
      projectId,
    },
  });

  return task;
};

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

const updateTask = async (
  organizationId: string,
  taskId: string,
  payload: IUpdateTaskPayload,
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

  const updateData: any = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return updatedTask;
};

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
