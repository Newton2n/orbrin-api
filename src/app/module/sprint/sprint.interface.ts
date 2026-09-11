import { sprintValidation } from "./sprint.schema";
import { z } from "zod";

export type ICreateSprintPayload = z.infer<
  typeof sprintValidation.createSprintSchema
>["body"];
export type IUpdateSprintPayload = z.infer<
  typeof sprintValidation.updateSprintSchema
>["body"];
