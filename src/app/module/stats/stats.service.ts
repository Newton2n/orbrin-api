
import { prisma } from "../../lib/prisma";
import {
  TaskStatus,
  TaskPriority,
  SprintStatus,
  PaymentStatus,
} from "../../../../prisma/generated/prisma/enums";

import type {
  IOrganizationOverview,
  IMemberOverview,
  IReportFilters,
} from "./stats.interface";

const getOrganizationOverview = async (
  organizationId: string,
  filters: IReportFilters = {},
): Promise<IOrganizationOverview> => {
  const dateFilter =
    filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {};

  const [
    totalTeams,
    totalProjects,
    totalMembers,
    totalTasks,
    taskStatusCounts,
    taskPriorityCounts,
    totalSprints,
    sprintStatusCounts,
    totalComments,
    totalPayments,
    completedPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    completedUsdPayments,
  ] = await Promise.all([
    prisma.team.count({
      where: {
        organizationId,
        deletedAt: null,
        ...dateFilter,
      },
    }),

    prisma.project.count({
      where: {
        organizationId,
        deletedAt: null,
        ...dateFilter,
      },
    }),

    prisma.organizationMembership.count({
      where: {
        organizationId,
        status: "ACTIVE",
        user: {
          deletedAt: null,
          status: "ACTIVE",
        },
        ...dateFilter,
      },
    }),

    prisma.task.count({
      where: {
        deletedAt: null,
        ...dateFilter,
        project: {
          organizationId,
          deletedAt: null,
        },
      },
    }),

    prisma.task.groupBy({
      by: ["status"],
      where: {
        deletedAt: null,
        ...dateFilter,
        project: {
          organizationId,
          deletedAt: null,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.task.groupBy({
      by: ["priority"],
      where: {
        deletedAt: null,
        ...dateFilter,
        project: {
          organizationId,
          deletedAt: null,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.sprint.count({
      where: {
        deletedAt: null,
        ...dateFilter,
        project: {
          organizationId,
          deletedAt: null,
        },
      },
    }),

    prisma.sprint.groupBy({
      by: ["status"],
      where: {
        deletedAt: null,
        ...dateFilter,
        project: {
          organizationId,
          deletedAt: null,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.comment.count({
      where: {
        deletedAt: null,
        ...dateFilter,
        task: {
          deletedAt: null,
          project: {
            organizationId,
            deletedAt: null,
          },
        },
      },
    }),

    prisma.payment.count({
      where: {
        organizationId,
        ...dateFilter,
      },
    }),

    prisma.payment.count({
      where: {
        organizationId,
        status: PaymentStatus.COMPLETED,
        ...dateFilter,
      },
    }),

    prisma.payment.count({
      where: {
        organizationId,
        status: PaymentStatus.PENDING,
        ...dateFilter,
      },
    }),

    prisma.payment.count({
      where: {
        organizationId,
        status: PaymentStatus.FAILED,
        ...dateFilter,
      },
    }),

    prisma.payment.count({
      where: {
        organizationId,
        status: PaymentStatus.REFUNDED,
        ...dateFilter,
      },
    }),

    prisma.payment.aggregate({
      where: {
        organizationId,
        status: PaymentStatus.COMPLETED,
        currency: "USD",
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const byStatus: IOrganizationOverview["tasks"]["byStatus"] = {
    [TaskStatus.TODO]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.REVIEW]: 0,
    [TaskStatus.DONE]: 0,
  };

  for (const item of taskStatusCounts) {
    byStatus[item.status] = item._count._all;
  }

  const byPriority: IOrganizationOverview["tasks"]["byPriority"] = {
    [TaskPriority.LOW]: 0,
    [TaskPriority.MEDIUM]: 0,
    [TaskPriority.HIGH]: 0,
    [TaskPriority.URGENT]: 0,
  };

  for (const item of taskPriorityCounts) {
    byPriority[item.priority] = item._count._all;
  }

  const sprintByStatus: IOrganizationOverview["sprints"]["byStatus"] = {
    [SprintStatus.PLANNING]: 0,
    [SprintStatus.ACTIVE]: 0,
    [SprintStatus.COMPLETED]: 0,
  };

  for (const item of sprintStatusCounts) {
    sprintByStatus[item.status] = item._count._all;
  }

  return {
    teams: {
      total: totalTeams,
    },
    projects: {
      total: totalProjects,
    },
    members: {
      total: totalMembers,
    },
    tasks: {
      total: totalTasks,
      byStatus,
      byPriority,
      completed: byStatus[TaskStatus.DONE],
    },
    sprints: {
      total: totalSprints,
      byStatus: sprintByStatus,
    },
    comments: {
      total: totalComments,
    },
    billing: {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalCompletedAmount: Number(
        completedUsdPayments._sum.amount ?? 0,
      ),
      currency: "USD",
    },
  };
};

const getMemberOverview = async (
  organizationId: string,
  userId: string,
): Promise<IMemberOverview> => {
  const taskWhere = {
    assigneeId: userId,
    deletedAt: null,
    project: {
      organizationId,
      deletedAt: null,
    },
  };

  const [totalTasks, taskCounts, assignedProjects, totalAuthoredComments] =
    await Promise.all([
      prisma.task.count({
        where: taskWhere,
      }),

      prisma.task.groupBy({
        by: ["status"],
        where: taskWhere,
        _count: {
          _all: true,
        },
      }),

      prisma.task.findMany({
        where: taskWhere,
        select: {
          projectId: true,
        },
        distinct: ["projectId"],
      }),

      prisma.comment.count({
        where: {
          authorId: userId,
          deletedAt: null,
          task: {
            deletedAt: null,
            project: {
              organizationId,
              deletedAt: null,
            },
          },
        },
      }),
    ]);

  const byStatus: Record<TaskStatus, number> = {
    [TaskStatus.TODO]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.REVIEW]: 0,
    [TaskStatus.DONE]: 0,
  };

  for (const item of taskCounts) {
    byStatus[item.status] = item._count._all;
  }

  return {
    tasks: {
      total: totalTasks,
      todo: byStatus[TaskStatus.TODO],
      inProgress: byStatus[TaskStatus.IN_PROGRESS],
      inReview: byStatus[TaskStatus.REVIEW],
      completed: byStatus[TaskStatus.DONE],
    },
    projects: {
      total: assignedProjects.length,
    },
    comments: {
      totalAuthored: totalAuthoredComments,
    },
  };
};

export const statsService = {
  getOrganizationOverview,
  getMemberOverview,
};
