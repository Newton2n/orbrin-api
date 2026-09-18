import type { Role } from "../../prisma/generated/prisma/enums";

export interface IBaseQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        role: Role;
        organizationId: string;
      };
    }
  }
}
