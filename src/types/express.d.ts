import { Role } from "../../prisma/generated/prisma/enums";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
        organizationId: string;
      };
    }
  }
}

export {};
