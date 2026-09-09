import z from "zod";
import { authValidation } from "./auth.schema";
export type TRegisterOrgOwnerBody = z.infer<
  typeof authValidation.registerOrgOwnerSchema
>["body"];
export type TRegisterMemberBody = z.infer<
  typeof authValidation.registerMemberSchema
>["body"];
export type TLoginBody = z.infer<typeof authValidation.loginSchema>["body"];
