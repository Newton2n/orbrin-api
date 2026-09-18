import type z from "zod";
import type { authValidation } from "./auth.schema";
export type TRegisterOrgOwnerBody = z.infer<
  typeof authValidation.registerOrgOwnerSchema
>["body"];
export type TRegisterMemberBody = z.infer<
  typeof authValidation.registerMemberSchema
>["body"];
export type TLoginBody = z.infer<typeof authValidation.loginSchema>["body"];
export type TGoogleLoginBody = z.infer<
  typeof authValidation.googleLoginSchema
>["body"];
export type TSendVerificationEmail = {
  email: string;
};

export type TVerifyEmail = {
  email: string;
  otp: string;
};
