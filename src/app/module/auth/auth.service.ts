import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import {
  TLoginBody,
  TRegisterMemberBody,
  TRegisterOrgOwnerBody,
} from "./auth.interface";

const registerOrgOwner = async (payload: TRegisterOrgOwnerBody) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Organization owner with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword,
      },
      omit: { passwordHash: true },
    });

    const organization = await tx.organization.create({
      data: {
        name: payload.organizationName,
        slug: payload.organizationSlug,
      },
    });

    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "ADMIN",
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      role: membership.role,
    };
  });

  return result;
};

const registerMember = async (payload: TRegisterMemberBody) => {
  const organization = await prisma.organization.findUnique({
    where: { id: payload.organizationId },
  });

  if (!organization || organization.deletedAt) {
    throw new Error("Organization not found.");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword,
      },
      omit: { passwordHash: true },
    });

    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: payload.organizationId,
        role: "MEMBER",
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      organizationId: membership.organizationId,
      role: membership.role,
    };
  });

  return result;
};

const login = async (payload: TLoginBody) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      memberships: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Account is inactive or blocked.");
  }

  const membership = user.memberships[0];
  if (!membership) {
    throw new Error("User does not belong to any organization.");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: membership.role,
    organizationId: membership.organizationId,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in!,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expires_in!,
  );

  return {
    accessToken,
    refreshToken,
    jwtPayload,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      passwordHash: true,
    },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user || user.deletedAt) {
    throw new Error("User not found");
  }

  return user;
};

const refreshToken = async (incomingRefreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    incomingRefreshToken,
    config.jwt_refresh_secret!,
  );

  if (!verifiedToken.success) {
    throw new Error("Invalid refresh token");
  }

  const { id } = verifiedToken.data as { id: string };

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: true,
    },
  });

  if (!user || user.deletedAt || user.status !== "ACTIVE") {
    throw new Error("User not found or inactive");
  }

  const membership = user.memberships[0];
  if (!membership) {
    throw new Error("User does not belong to an organization");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: membership.role,
    organizationId: membership.organizationId,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in!,
  );

  return {
    accessToken,
    jwtPayload,
  };
};

export const authService = {
  registerOrgOwner,
  registerMember,
  login,
  getMe,
  refreshToken,
};
