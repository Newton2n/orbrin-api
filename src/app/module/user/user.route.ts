import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

import { userController } from "./user.controller";

import {
	changePasswordValidationSchema,
	forgotPasswordValidationSchema,
	resetPasswordValidationSchema,
	updateUserProfileValidationSchema,
	updateUserStatusValidationSchema,
} from "./user.schema";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { uploadImage } from "../../middleware/multer";
import { emailVerificationMiddleware } from "../../middleware/email-verified";

const router = Router();

router.post(
	"/forgot-password",
	validate(forgotPasswordValidationSchema),
	userController.forgotPassword,
);

router.post(
	"/reset-password",
	validate(resetPasswordValidationSchema),
	userController.resetPassword,
);

router.get(
	"/me",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	userController.getMyProfile,
);

// Update user profile
router.patch(
	"/me",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	validate(updateUserProfileValidationSchema),
	userController.updateMyProfile,
);

// Change password
router.patch(
	"/me/password",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	validate(changePasswordValidationSchema),
	userController.changePassword,
);

// Update user status
router.delete(
	"/me",
	authMiddleware.auth(Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	userController.deleteMyAccount,
);

// Update user status (Admin only)
router.patch(
	"/:userId/status",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	validate(updateUserStatusValidationSchema),
	userController.updateUserStatus,
);

// Update user profile picture
router.patch(
	"/me/profile-picture",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	uploadImage.single("image"),
	userController.updateProfileImage,
);

// Delete user profile picture
router.delete(
	"/me/profile-picture",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	userController.deleteProfileImage,
);

export const userRoutes = router;
