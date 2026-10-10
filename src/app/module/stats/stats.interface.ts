
import type {
  TaskStatus,
  TaskPriority,
  SprintStatus,
} from "../../../../prisma/generated/prisma/enums";

export interface ITaskStatusStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue?: number;
  completed: number;
}

export interface ISprintStats {
  total: number;
  byStatus: Record<SprintStatus, number>;
}

export interface IOrganizationOverview {
  teams: {
    total: number;
  };
  projects: {
    total: number;
  };
  members: {
    total: number;
  };
  tasks: ITaskStatusStats;
  sprints: ISprintStats;
  comments: {
    total: number;
  };
  billing: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    refundedPayments: number;
    totalCompletedAmount: number;
    currency: string;
  };
}

export interface IMemberOverview {
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    completed: number;
    overdue?: number;
  };
  projects: {
    total: number;
  };
  comments: {
    totalAuthored: number;
  };
}

export interface IReportFilters {
  from?: Date;
  to?: Date;
}
