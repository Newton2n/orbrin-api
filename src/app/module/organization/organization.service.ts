import { prisma } from "../../lib/prisma";
import { cloudinaryService } from "../../services/cloudinary";

import type {
  TUpdateMemberRole,
  TUpdateMemberStatus,
  TUpdateOrganization,
} from "./organization.interface";

const getMyOrganization = async (organizationId: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,

      memberships: {
        where: {
          status: "ACTIVE",
          user: {
            deletedAt: null,
          },
        },
        select: {
          id: true,
          role: true,
          status: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              emailVerified: true,
              status: true,
            },
          },
        },
      },

      _count: {
        select: {
          memberships: true,
          teams: true,
          projects: true,
        },
      },
    },
  });

  if (!organization) {
    throw new Error("Organization not found.");
  }

  return organization;
};

const updateOrganization = async (
  organizationId: string,
  payload: TUpdateOrganization,
) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null,
    },
  });

  if (!organization) {
    throw new Error("Organization not found.");
  }

  if (payload.slug && payload.slug !== organization.slug) {
    const existingOrganization = await prisma.organization.findUnique({
      where: {
        slug: payload.slug,
      },
    });

    if (existingOrganization) {
      throw new Error("An organization with this slug already exists.");
    }
  }

  return prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      ...(payload.name !== undefined && {
        name: payload.name,
      }),
      ...(payload.slug !== undefined && {
        slug: payload.slug,
      }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteOrganization = async (organizationId: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null,
    },
  });

  if (!organization) {
    throw new Error("Organization not found.");
  }

  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

const getOrganizationMembers = async (organizationId: string) => {
  return prisma.organizationMembership.findMany({
    where: {
      organizationId,
      status: "ACTIVE",
      user: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          emailVerified: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const getOrganizationMemberById = async (
  organizationId: string,
  memberId: string,
) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId,
      user: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          emailVerified: true,
          status: true,
        },
      },
    },
  });

  if (!membership) {
    throw new Error("Organization member not found.");
  }

  return membership;
};

const updateMemberRole = async (
  organizationId: string,
  memberId: string,
  payload: TUpdateMemberRole,
) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  });

  if (!membership) {
    throw new Error("Organization member not found.");
  }

  if (membership.role === "ADMIN") {
    throw new Error("Cannot update the role of an ADMIN member.");
  }

  if (payload.role === "ADMIN") {
    throw new Error("Cannot assign ADMIN role to a member.");
  }

  return prisma.organizationMembership.update({
    where: {
      id: membership.id,
    },
    data: {
      role: payload.role,
    },
    select: {
      id: true,
      role: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });
};

const updateMemberStatus = async (
  organizationId: string,
  memberId: string,
  payload: TUpdateMemberStatus,
) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  });

  if (!membership) {
    throw new Error("Organization member not found.");
  }

  if (membership?.role === "ADMIN" && payload.status !== "ACTIVE") {
    throw new Error("Cannot change the status of an Admin.");
  }

  return prisma.organizationMembership.update({
    where: {
      id: membership.id,
    },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      role: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });
};

// Remove a member from an organization
const removeMember = async (organizationId: string, memberId: string) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  });

  if (!membership) {
    throw new Error("Organization member not found.");
  }

  if (membership.role === "ADMIN") {
    throw new Error("Organization admin cannot be removed directly.");
  }

  await prisma.organizationMembership.delete({
    where: {
      id: membership.id,
    },
  });
};

// leave an organization
const leaveOrganization = async (organizationId: string, userId: string) => {
  const membership = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this organization.");
  }

  if (membership.role === "ADMIN") {
    throw new Error("Organization admin cannot leave the organization.");
  }

  await prisma.organizationMembership.delete({
    where: {
      id: membership.id,
    },
  });
};

const updateOrganizationLogo = async (
  organizationId: string,
  file: Express.Multer.File,
) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      logoPublicId: true,
    },
  });

  if (!organization) {
    throw new Error("Organization not found.");
  }

  // 1. Upload new logo
  const uploadedLogo =
    await cloudinaryService.uploadBuffer(
      file.buffer,
      {
        folder: `orbrin/organizations/${organizationId}/logo`,
        resourceType: "image",
      },
    );

  try {
    // 2. Update database
    const updatedOrganization =
      await prisma.organization.update({
        where: {
          id: organizationId,
        },
        data: {
          logoUrl: uploadedLogo.secureUrl,
          logoPublicId: uploadedLogo.publicId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    // 3. Delete old logo
    if (organization.logoPublicId) {
      try {
        await cloudinaryService.deleteAsset(
          organization.logoPublicId,
          "image",
        );
      } catch (error) {
        console.error(
          "Failed to delete old organization logo:",
          error,
        );
      }
    }

    return updatedOrganization;
  } catch (error) {
    // DB update failed, so remove the NEW Cloudinary asset
    try {
      await cloudinaryService.deleteAsset(
        uploadedLogo.publicId,
        "image",
      );
    } catch (cleanupError) {
      console.error(
        "Failed to cleanup uploaded logo:",
        cleanupError,
      );
    }

    throw error;
  }
};

const deleteOrganizationLogo = async (
	organizationId: string,
) => {
	const organization = await prisma.organization.findFirst({
		where: {
			id: organizationId,
			deletedAt: null,
		},
		select: {
			id: true,
			logoPublicId: true,
		},
	});

	if (!organization) {
		throw new Error("Organization not found.");
	}

	if (!organization.logoPublicId) {
		throw new Error("Organization logo not found.");
	}

	await cloudinaryService.deleteAsset(
		organization.logoPublicId,
		"image",
	);

	return prisma.organization.update({
		where: {
			id: organizationId,
		},
		data: {
			logoUrl: null,
			logoPublicId: null,
		},
		select: {
			id: true,
			name: true,
			slug: true,
			logoUrl: true,
		},
	});
};

export const organizationService = {
  getMyOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  getOrganizationMemberById,
  updateMemberRole,
  updateMemberStatus,
  removeMember,
  leaveOrganization,
  updateOrganizationLogo,
	deleteOrganizationLogo,
};
