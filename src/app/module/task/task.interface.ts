import {z} from "zod";
import { taskValidation } from "./task.schema";

export type ICreateTaskPayload = z.infer<typeof taskValidation.createTaskSchema>["body"];
export type IUpdateTaskPayload = z.infer<typeof taskValidation.updateTaskSchema>["body"];


export interface ITaskQueryFilters {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}