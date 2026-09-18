import type { UserStatus } from "../../../../prisma/generated/prisma/enums";

export interface TUpdateUserProfile {
	fullName: string;
}

export interface TChangePassword {
	currentPassword: string;
	newPassword: string;
}

export interface TForgotPassword {
	email: string;
}

export interface TResetPassword {
	email: string;
	otp: string;
	newPassword: string;
}
export interface TUpdateUserStatus {
	status: UserStatus;
}
