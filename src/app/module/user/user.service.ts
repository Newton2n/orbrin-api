import bcrypt from "bcrypt";
import crypto from "node:crypto";

import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import config from "../../config";
import { mailService } from "../../services/mail";

import type {
	TChangePassword,
	TForgotPassword,
	TResetPassword,
	TUpdateUserProfile,
	TUpdateUserStatus,
} from "./user.interface";

const RESET_OTP_EXPIRY = 60 * 5; // 5 minutes

const getMyProfile = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
		select: {
			id: true,
			email: true,
			fullName: true,
			emailVerified: true,
			status: true,
			authProvider: true,
			createdAt: true,
			updatedAt: true,
			memberships: {
				where: {
					status: "ACTIVE",
					organization: {
						deletedAt: null,
					},
				},
				select: {
					id: true,
					role: true,
					organization: {
						select: {
							id: true,
							name: true,
							slug: true,
						},
					},
				},
			},
		},
	});

	if (!user) {
		throw new Error("User not found.");
	}

	return user;
};

const updateMyProfile = async (
	userId: string,
	payload: TUpdateUserProfile,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) {
		throw new Error("User not found.");
	}

	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			fullName: payload.fullName,
		},
		select: {
			id: true,
			email: true,
			fullName: true,
			emailVerified: true,
			status: true,
			authProvider: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const changePassword = async (
	userId: string,
	payload: TChangePassword,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) {
		throw new Error("User not found.");
	}

	if (user.authProvider !== "LOCAL") {
		throw new Error(
			"Password change is only available for local accounts.",
		);
	}

	if (!user.passwordHash) {
		throw new Error("Password is not available for this account.");
	}

	const passwordMatches = await bcrypt.compare(
		payload.currentPassword,
		user.passwordHash,
	);

	if (!passwordMatches) {
		throw new Error("Current password is incorrect.");
	}

	const hashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(config.bcrypt_salt_rounds),
	);

	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			passwordHash: hashedPassword,
		},
	});
};

const forgotPassword = async (payload: TForgotPassword) => {
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	// Do not reveal whether the email exists.
	if (
		!user ||
		user.deletedAt ||
		user.authProvider !== "LOCAL"
	) {
		return;
	}

	// Generate a 6-digit OTP.
	const otp = crypto
		.randomInt(100000, 1000000)
		.toString();

	// Hash OTP before storing it in Redis.
	const hashedOtp = crypto
		.createHash("sha256")
		.update(otp)
		.digest("hex");

	const redisKey = `orbrin:password-reset-otp:${user.id}`;

	await redis.set(redisKey, hashedOtp, {
		ex: RESET_OTP_EXPIRY,
	});

	// Send OTP directly to email.
	await mailService.sendPasswordResetOtpEmail({
		to: user.email,
		fullName: user.fullName,
		otp,
	});
};

const resetPassword = async (payload: TResetPassword) => {
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email,
			deletedAt: null,
		},
	});

	if (!user) {
		throw new Error("Invalid email or OTP.");
	}

	if (user.authProvider !== "LOCAL") {
		throw new Error(
			"Password reset is only available for local accounts.",
		);
	}

	const hashedOtp = crypto
		.createHash("sha256")
		.update(payload.otp)
		.digest("hex");

	const redisKey = `orbrin:password-reset-otp:${user.id}`;

	const storedOtp = await redis.get<string>(redisKey);

	if (!storedOtp || storedOtp !== hashedOtp) {
		throw new Error("Invalid or expired OTP.");
	}

	const hashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(config.bcrypt_salt_rounds),
	);

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			passwordHash: hashedPassword,
		},
	});

	// Make OTP single-use.
	await redis.del(redisKey);
};

const updateUserStatus = async (
	userId: string,
	payload: TUpdateUserStatus,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) {
		throw new Error("User not found.");
	}

	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			status: payload.status,
		},
		select: {
			id: true,
			email: true,
			fullName: true,
			emailVerified: true,
			status: true,
			authProvider: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const deleteMyAccount = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) {
		throw new Error("User not found.");
	}

	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			deletedAt: new Date(),
			status: "INACTIVE",
		},
	});
};

export const userService = {
	getMyProfile,
	updateMyProfile,
	changePassword,
	forgotPassword,
	resetPassword,
	updateUserStatus,
	deleteMyAccount,
};