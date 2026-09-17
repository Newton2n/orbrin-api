import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import type {
  TLoginBody,
  TRegisterMemberBody,
  TRegisterOrgOwnerBody,
} from "./auth.interface";
import { verifyGoogleToken } from "../../lib/google";

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

  if (!user.passwordHash && user.authProvider === "GOOGLE") {
    throw new Error("Please login using Google Sign-In");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.passwordHash as string,
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
        where: {
          status: "ACTIVE",
          organization: {
            deletedAt: null,
          },
        },
        include: {
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

// Google login function
const googleLogin = async (idToken: string, defaultOrganizationId?: string) => {
  //  Verify the Google ID token
  const verifyResult = await verifyGoogleToken(idToken);

  const payload = verifyResult;

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  const { sub: providerId, email, name: fullName } = payload;

  //Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email, deletedAt: null, status: "ACTIVE" },
    include: {
      memberships: {
        select: {
          role: true,
          organizationId: true,
        },
      },
    },
  });

  if (user?.memberships[0].role === "ADMIN") {
    throw new Error(
      "Organization owner cannot login via Google. Please use your email and password to login.",
    );
  }

  if (user) {
    // If user exists but doesn't have a Google authProviderId, update it
    if (!user.authProviderId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          authProviderId: providerId,
          authProvider: "GOOGLE",
          emailVerified: true,
        },
        include: {
          memberships: {
            select: {
              role: true,
              organizationId: true,
            },
          },
        },
      });
    }
  } else {
    // If user doesn't exist, register them as a MEMBER automatically
    if (!defaultOrganizationId) {
      throw new Error("Organization ID is required for new Google signup.");
    }

    const organization = await prisma.organization.findUnique({
      where: { id: defaultOrganizationId, deletedAt: null },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    user = await prisma.user.create({
      data: {
        fullName: fullName || "Google User",
        email,
        passwordHash: null, // No password for Google users
        authProvider: "GOOGLE",
        authProviderId: providerId,
        emailVerified: true,
        memberships: {
          create: { organizationId: defaultOrganizationId, role: "MEMBER" },
        },
      },
      include: {
        memberships: {
          select: {
            role: true,
            organizationId: true,
          },
        },
      },
    });
  }

  if (!user) {
    throw new Error("User creation or retrieval failed.");
  }

  //  Generate app JWT tokens
  const jwtPayload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.memberships[0].role,
    organizationId: user.memberships[0].organizationId,
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

export const authService = {
  registerOrgOwner,
  registerMember,
  login,
  getMe,
  refreshToken,
  googleLogin,
};
