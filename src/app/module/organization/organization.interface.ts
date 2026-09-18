import type { OrganizationMembershipStatus, Role } from "../../../../prisma/generated/prisma/enums";
export interface TCreateOrganization {
  name: string;
  slug: string;
}

export interface TUpdateOrganization {
  name?: string;
  slug?: string;
}

export interface TUpdateMemberRole {
  role: Role;
}

export interface TUpdateMemberStatus {
  status: OrganizationMembershipStatus;
}
