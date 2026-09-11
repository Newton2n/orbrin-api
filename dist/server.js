
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// src/app/middleware/not-found.ts
var notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: "Not Found",
    requestType: req.method,
    message: `The requested URL ${req.originalUrl} was not found on this server.`
  });
};
var not_found_default = notFound;

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": `enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum PaymentStatus {
  PENDING
  ACTIVE
  FAILED
  EXPIRED
}

enum PaymentGateway {
  STRIPE
  BKASH
  SSLCOMMERZ
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum OrganizationMembershipStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum SprintStatus {
  PLANNING
  ACTIVE
  COMPLETED
}

model Organization {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  memberships   OrganizationMembership[]
  teams         Team[]
  projects      Project[]
  subscriptions Subscription[]

  @@map("organizations")
}

model OrganizationMembership {
  id             String                       @id @default(uuid())
  organizationId String                       @map("organization_id")
  userId         String                       @map("user_id")
  role           Role                         @default(MEMBER)
  status         OrganizationMembershipStatus @default(ACTIVE)
  createdAt      DateTime                     @default(now()) @map("created_at")
  updatedAt      DateTime                     @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@map("organization_memberships")
}

model Project {
  id             String    @id @default(uuid())
  organizationId String    @map("organization_id")
  name           String
  description    String?
  status         String    @default("active")
  deletedAt      DateTime? @map("deleted_at")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sprints      Sprint[]
  teams        ProjectTeam[] // Links project to the junction table
  tasks        Task[]

  @@map("projects")
}

model ProjectTeam {
  projectId  String   @map("project_id")
  teamId     String   @map("team_id")
  assignedAt DateTime @default(now()) @map("assigned_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  team    Team    @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@id([projectId, teamId]) // Composite primary key ensures a team can't be added to the same project twice
  @@map("project_teams")
}

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Sprint {
  id        String       @id @default(uuid())
  projectId String       @map("project_id")
  name      String
  goal      String?
  status    SprintStatus @default(PLANNING)
  startDate DateTime?    @map("start_date")
  endDate   DateTime?    @map("end_date")
  deletedAt DateTime?    @map("deleted_at")
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tasks   Task[]

  @@map("sprints")
}

model Subscription {
  id             String         @id @default(uuid())
  organizationId String         @map("organization_id")
  gateway        PaymentGateway
  transactionId  String         @unique @map("transaction_id")
  amount         Decimal        @db.Decimal(10, 2)
  currency       String         @default("USD")
  status         PaymentStatus  @default(PENDING)
  planName       String         @map("plan_name")
  expiresAt      DateTime?      @map("expires_at")
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

model Task {
  id           String       @id @default(uuid())
  projectId    String       @map("project_id")
  sprintId     String?      @map("sprint_id")
  parentTaskId String?      @map("parent_task_id")
  creatorId    String?      @map("creator_id")
  assigneeId   String?      @map("assignee_id")
  title        String
  description  String?
  status       TaskStatus   @default(TODO)
  priority     TaskPriority @default(MEDIUM)
  deletedAt    DateTime?    @map("deleted_at")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  parentTask Task?  @relation("SubTasks", fields: [parentTaskId], references: [id], onDelete: Cascade)
  subTasks   Task[] @relation("SubTasks")
  creator    User?  @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: SetNull)
  assignee   User?  @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  sprint Sprint? @relation(fields: [sprintId], references: [id], onDelete: SetNull)

  @@map("tasks")
}

model Team {
  id             String    @id @default(uuid())
  organizationId String    @map("organization_id")
  name           String
  description    String?
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  teamMembers  TeamMembership[]
  projects     ProjectTeam[] // Links team to the junction table

  @@unique([organizationId, name], name: "unique_team_name_per_organization")
  @@map("teams")
}

model TeamMembership {
  teamId    String   @map("team_id")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([teamId, userId])
  @@map("team_memberships")
}

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  passwordHash String     @map("password_hash")
  fullName     String     @map("full_name")
  status       UserStatus @default(ACTIVE)
  deletedAt    DateTime?  @map("deleted_at")
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")

  memberships     OrganizationMembership[]
  teamMemberships TeamMembership[]
  createdTasks    Task[]                   @relation("TaskCreator")
  assignedTasks   Task[]                   @relation("TaskAssignee")

  @@map("users")
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","project","parentTask","subTasks","creator","assignee","sprint","_count","tasks","sprints","teams","team","projects","user","teamMemberships","createdTasks","assignedTasks","subscriptions","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","data","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","create","update","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","having","_min","_max","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","_avg","_sum","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","passwordHash","fullName","UserStatus","status","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","planName","expiresAt","goal","SprintStatus","startDate","endDate","assignedAt","Role","role","OrganizationMembershipStatus","slug","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "8gVZoAENBAAAuQIAIA8AAOECACARAADiAgAgFgAA4wIAIL8BAADgAgAwwAEAAD8AEMEBAADgAgAwwgEBAAAAAcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdwBAQC1AgAh9wEBAAAAAQEAAAABACAMAwAA6AIAIBIAAP0CACC_AQAA_wIAMMABAAADABDBAQAA_wIAMMIBAQC1AgAhxwEAAIED9wEiyQFAALgCACHKAUAAuAIAIdoBAQC1AgAh2wEBALUCACH1AQAAgAP1ASICAwAAkQUAIBIAAJYFACANAwAA6AIAIBIAAP0CACC_AQAA_wIAMMABAAADABDBAQAA_wIAMMIBAQAAAAHHAQAAgQP3ASLJAUAAuAIAIcoBQAC4AgAh2gEBALUCACHbAQEAtQIAIfUBAACAA_UBIvsBAAD-AgAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJEAAA-gIAIBIAAP0CACC_AQAA_AIAMMABAAAIABDBAQAA_AIAMMkBQAC4AgAhygFAALgCACHZAQEAtQIAIdoBAQC1AgAhAhAAAJgFACASAACWBQAgChAAAPoCACASAAD9AgAgvwEAAPwCADDAAQAACAAQwQEAAPwCADDJAUAAuAIAIcoBQAC4AgAh2QEBALUCACHaAQEAtQIAIfoBAAD7AgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACAIBgAA8gIAIBAAAPoCACC_AQAA-QIAMMABAAANABDBAQAA-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_AQAA6QIAMMABAAAyABDBAQAA6QIAMMIBAQAAAAHHAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh3AEBALUCACHdAQEA6gIAIQMAAAAyACABAAAzADACAAA0ACAPAwAA6AIAIL8BAADkAgAwwAEAADYAEMEBAADkAgAwwgEBALUCACHHAQAA5wLtASLJAUAAuAIAIcoBQAC4AgAh2wEBALUCACHoAQAA5QLoASLpAQEAtQIAIeoBEADmAgAh6wEBALUCACHtAQEAtQIAIe4BQAC3AgAhAgMAAJEFACDuAQAAggMAIA8DAADoAgAgvwEAAOQCADDAAQAANgAQwQEAAOQCADDCAQEAAAABxwEAAOcC7QEiyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh6AEAAOUC6AEi6QEBAAAAAeoBEADmAgAh6wEBALUCACHtAQEAtQIAIe4BQAC3AgAhAwAAADYAIAEAADcAMAIAADgAIAEAAAADACABAAAALgAgAQAAADIAIAEAAAA2ACABAAAAAQAgDQQAALkCACAPAADhAgAgEQAA4gIAIBYAAOMCACC_AQAA4AIAMMABAAA_ABDBAQAA4AIAMMIBAQC1AgAhyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh3AEBALUCACH3AQEAtQIAIQUEAADdAwAgDwAAjgUAIBEAAI8FACAWAACQBQAgyAEAAIIDACADAAAAPwAgAQAAQAAwAgAAAQAgAwAAAD8AIAEAAEAAMAIAAAEAIAMAAAA_ACABAABAADACAAABACAKBAAAigUAIA8AAIsFACARAACMBQAgFgAAjQUAIMIBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB9wEBAAAAAQEcAABEACAGwgEBAAAAAcgBQAAAAAHJAUAAAAABygFAAAAAAdwBAQAAAAH3AQEAAAABARwAAEYAMAEcAABGADAKBAAA2QQAIA8AANoEACARAADbBAAgFgAA3AQAIMIBAQCGAwAhyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3AEBAIYDACH3AQEAhgMAIQIAAAABACAcAABJACAGwgEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHcAQEAhgMAIfcBAQCGAwAhAgAAAD8AIBwAAEsAIAIAAAA_ACAcAABLACADAAAAAQAgIwAARAAgJAAASQAgAQAAAAEAIAEAAAA_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_AQAA1gIAMMABAACUAQAQwQEAANYCADDZAQEApgIAId4BAQCmAgAh8wFAAKkCACEDAAAADQAgAQAAkwEAMCgAAJQBACADAAAADQAgAQAADgAwAgAADwAgAQAAABMAIAEAAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACAMBgAAoQQAIA0AAKIEACDCAQEAAAABxwEAAADxAQLIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB3gEBAAAAAe8BAQAAAAHxAUAAAAAB8gFAAAAAAQEcAACcAQAgCsIBAQAAAAHHAQAAAPEBAsgBQAAAAAHJAUAAAAABygFAAAAAAdwBAQAAAAHeAQEAAAAB7wEBAAAAAfEBQAAAAAHyAUAAAAABARwAAJ4BADABHAAAngEAMAwGAACWBAAgDQAAlwQAIMIBAQCGAwAhxwEAAJUE8QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3AEBAIYDACHeAQEAhgMAIe8BAQCYAwAh8QFAAIgDACHyAUAAiAMAIQIAAAATACAcAAChAQAgCsIBAQCGAwAhxwEAAJUE8QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3AEBAIYDACHeAQEAhgMAIe8BAQCYAwAh8QFAAIgDACHyAUAAiAMAIQIAAAARACAcAACjAQAgAgAAABEAIBwAAKMBACADAAAAEwAgIwAAnAEAICQAAKEBACABAAAAEwAgAQAAABEAIAcMAACSBAAgKQAAlAQAICoAAJMEACDIAQAAggMAIO8BAACCAwAg8QEAAIIDACDyAQAAggMAIA2_AQAA0gIAMMABAACqAQAQwQEAANICADDCAQEApgIAIccBAADTAvEBIsgBQACoAgAhyQFAAKkCACHKAUAAqQIAIdwBAQCmAgAh3gEBAKYCACHvAQEAvgIAIfEBQACoAgAh8gFAAKgCACEDAAAAEQAgAQAAqQEAMCgAAKoBACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAADgAIAEAAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACAMAwAAkQQAIMIBAQAAAAHHAQAAAO0BAskBQAAAAAHKAUAAAAAB2wEBAAAAAegBAAAA6AEC6QEBAAAAAeoBEAAAAAHrAQEAAAAB7QEBAAAAAe4BQAAAAAEBHAAAsgEAIAvCAQEAAAABxwEAAADtAQLJAUAAAAABygFAAAAAAdsBAQAAAAHoAQAAAOgBAukBAQAAAAHqARAAAAAB6wEBAAAAAe0BAQAAAAHuAUAAAAABARwAALQBADABHAAAtAEAMAwDAACQBAAgwgEBAIYDACHHAQAAjwTtASLJAUAAiQMAIcoBQACJAwAh2wEBAIYDACHoAQAAjQToASLpAQEAhgMAIeoBEACOBAAh6wEBAIYDACHtAQEAhgMAIe4BQACIAwAhAgAAADgAIBwAALcBACALwgEBAIYDACHHAQAAjwTtASLJAUAAiQMAIcoBQACJAwAh2wEBAIYDACHoAQAAjQToASLpAQEAhgMAIeoBEACOBAAh6wEBAIYDACHtAQEAhgMAIe4BQACIAwAhAgAAADYAIBwAALkBACACAAAANgAgHAAAuQEAIAMAAAA4ACAjAACyAQAgJAAAtwEAIAEAAAA4ACABAAAANgAgBgwAAIgEACApAACLBAAgKgAAigQAIHsAAIkEACB8AACMBAAg7gEAAIIDACAOvwEAAMgCADDAAQAAwAEAEMEBAADIAgAwwgEBAKYCACHHAQAAywLtASLJAUAAqQIAIcoBQACpAgAh2wEBAKYCACHoAQAAyQLoASLpAQEApgIAIeoBEADKAgAh6wEBAKYCACHtAQEApgIAIe4BQACoAgAhAwAAADYAIAEAAL8BADAoAADAAQAgAwAAADYAIAEAADcAMAIAADgAIAEAAAAXACABAAAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgEwYAAKsDACAHAACxAwAgCAAArAMAIAkAAK0DACAKAACuAwAgCwAArwMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHmAQAAAOYBAgEcAADIAQAgDcIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHmAQAAAOYBAgEcAADKAQAwARwAAMoBADABAAAAFQAgAQAAABsAIAEAAAAbACABAAAAEQAgEwYAAJwDACAHAACdAwAgCAAAngMAIAkAAJ8DACAKAACpAwAgCwAAoAMAIMIBAQCGAwAhxwEAAJkD5QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3QEBAJgDACHeAQEAhgMAId8BAQCYAwAh4AEBAJgDACHhAQEAmAMAIeIBAQCYAwAh4wEBAIYDACHmAQAAmgPmASICAAAAFwAgHAAA0QEAIA3CAQEAhgMAIccBAACZA-UBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAId0BAQCYAwAh3gEBAIYDACHfAQEAmAMAIeABAQCYAwAh4QEBAJgDACHiAQEAmAMAIeMBAQCGAwAh5gEAAJoD5gEiAgAAABUAIBwAANMBACACAAAAFQAgHAAA0wEAIAEAAAAVACABAAAAGwAgAQAAABsAIAEAAAARACADAAAAFwAgIwAAyAEAICQAANEBACABAAAAFwAgAQAAABUAIAkMAACFBAAgKQAAhwQAICoAAIYEACDIAQAAggMAIN0BAACCAwAg3wEAAIIDACDgAQAAggMAIOEBAACCAwAg4gEAAIIDACAQvwEAAMECADDAAQAA3gEAEMEBAADBAgAwwgEBAKYCACHHAQAAwgLlASLIAUAAqAIAIckBQACpAgAhygFAAKkCACHdAQEAvgIAId4BAQCmAgAh3wEBAL4CACHgAQEAvgIAIeEBAQC-AgAh4gEBAL4CACHjAQEApgIAIeYBAADDAuYBIgMAAAAVACABAADdAQAwKAAA3gEAIAMAAAAVACABAAAWADACAAAXACABAAAAMAAgAQAAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAoDAACCBAAgBQAAgwQAIBEAAIQEACDCAQEAAAAByAFAAAAAAckBQAAAAAHKAUAAAAAB2wEBAAAAAdwBAQAAAAHdAQEAAAABARwAAOYBACAHwgEBAAAAAcgBQAAAAAHJAUAAAAABygFAAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAQEcAADoAQAwARwAAOgBADAKAwAA6AMAIAUAAOkDACARAADqAwAgwgEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHbAQEAhgMAIdwBAQCGAwAh3QEBAJgDACECAAAAMAAgHAAA6wEAIAfCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdsBAQCGAwAh3AEBAIYDACHdAQEAmAMAIQIAAAAuACAcAADtAQAgAgAAAC4AIBwAAO0BACADAAAAMAAgIwAA5gEAICQAAOsBACABAAAAMAAgAQAAAC4AIAUMAADlAwAgKQAA5wMAICoAAOYDACDIAQAAggMAIN0BAACCAwAgCr8BAAC9AgAwwAEAAPQBABDBAQAAvQIAMMIBAQCmAgAhyAFAAKgCACHJAUAAqQIAIcoBQACpAgAh2wEBAKYCACHcAQEApgIAId0BAQC-AgAhAwAAAC4AIAEAAPMBADAoAAD0AQAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAAKACABAAAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgBhAAAMgDACASAADkAwAgyQFAAAAAAcoBQAAAAAHZAQEAAAAB2gEBAAAAAQEcAAD8AQAgBMkBQAAAAAHKAUAAAAAB2QEBAAAAAdoBAQAAAAEBHAAA_gEAMAEcAAD-AQAwBhAAAMYDACASAADjAwAgyQFAAIkDACHKAUAAiQMAIdkBAQCGAwAh2gEBAIYDACECAAAACgAgHAAAgQIAIATJAUAAiQMAIcoBQACJAwAh2QEBAIYDACHaAQEAhgMAIQIAAAAIACAcAACDAgAgAgAAAAgAIBwAAIMCACADAAAACgAgIwAA_AEAICQAAIECACABAAAACgAgAQAAAAgAIAMMAADgAwAgKQAA4gMAICoAAOEDACAHvwEAALwCADDAAQAAigIAEMEBAAC8AgAwyQFAAKkCACHKAUAAqQIAIdkBAQCmAgAh2gEBAKYCACEDAAAACAAgAQAAiQIAMCgAAIoCACADAAAACAAgAQAACQAwAgAACgAgDwQAALkCACATAAC6AgAgFAAAuwIAIBUAALsCACC_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-AgAh4AEBAL4CACHhAQEAvgIAIeIBAQC-AgAh4wEBAKYCACHmAQAAwwLmASIHDAAAqwIAICkAAMcCACAqAADHAgAgywEAAADlAQLMAQAAAOUBCM0BAAAA5QEI0gEAAMYC5QEiBwwAAKsCACApAADFAgAgKgAAxQIAIMsBAAAA5gECzAEAAADmAQjNAQAAAOYBCNIBAADEAuYBIgcMAACrAgAgKQAAxQIAICoAAMUCACDLAQAAAOYBAswBAAAA5gEIzQEAAADmAQjSAQAAxALmASIEywEAAADmAQLMAQAAAOYBCM0BAAAA5gEI0gEAAMUC5gEiBwwAAKsCACApAADHAgAgKgAAxwIAIMsBAAAA5QECzAEAAADlAQjNAQAAAOUBCNIBAADGAuUBIgTLAQAAAOUBAswBAAAA5QEIzQEAAADlAQjSAQAAxwLlASIOvwEAAMgCADDAAQAAwAEAEMEBAADIAgAwwgEBAKYCACHHAQAAywLtASLJAUAAqQIAIcoBQACpAgAh2wEBAKYCACHoAQAAyQLoASLpAQEApgIAIeoBEADKAgAh6wEBAKYCACHtAQEApgIAIe4BQACoAgAhBwwAAKsCACApAADRAgAgKgAA0QIAIMsBAAAA6AECzAEAAADoAQjNAQAAAOgBCNIBAADQAugBIg0MAACrAgAgKQAAzwIAICoAAM8CACB7AADPAgAgfAAAzwIAIMsBEAAAAAHMARAAAAAEzQEQAAAABM4BEAAAAAHPARAAAAAB0AEQAAAAAdEBEAAAAAHSARAAzgIAIQcMAACrAgAgKQAAzQIAICoAAM0CACDLAQAAAO0BAswBAAAA7QEIzQEAAADtAQjSAQAAzALtASIHDAAAqwIAICkAAM0CACAqAADNAgAgywEAAADtAQLMAQAAAO0BCM0BAAAA7QEI0gEAAMwC7QEiBMsBAAAA7QECzAEAAADtAQjNAQAAAO0BCNIBAADNAu0BIg0MAACrAgAgKQAAzwIAICoAAM8CACB7AADPAgAgfAAAzwIAIMsBEAAAAAHMARAAAAAEzQEQAAAABM4BEAAAAAHPARAAAAAB0AEQAAAAAdEBEAAAAAHSARAAzgIAIQjLARAAAAABzAEQAAAABM0BEAAAAATOARAAAAABzwEQAAAAAdABEAAAAAHRARAAAAAB0gEQAM8CACEHDAAAqwIAICkAANECACAqAADRAgAgywEAAADoAQLMAQAAAOgBCM0BAAAA6AEI0gEAANAC6AEiBMsBAAAA6AECzAEAAADoAQjNAQAAAOgBCNIBAADRAugBIg2_AQAA0gIAMMABAACqAQAQwQEAANICADDCAQEApgIAIccBAADTAvEBIsgBQACoAgAhyQFAAKkCACHKAUAAqQIAIdwBAQCmAgAh3gEBAKYCACHvAQEAvgIAIfEBQACoAgAh8gFAAKgCACEHDAAAqwIAICkAANUCACAqAADVAgAgywEAAADxAQLMAQAAAPEBCM0BAAAA8QEI0gEAANQC8QEiBwwAAKsCACApAADVAgAgKgAA1QIAIMsBAAAA8QECzAEAAADxAQjNAQAAAPEBCNIBAADUAvEBIgTLAQAAAPEBAswBAAAA8QEIzQEAAADxAQjSAQAA1QLxASIGvwEAANYCADDAAQAAlAEAEMEBAADWAgAw2QEBAKYCACHeAQEApgIAIfMBQACpAgAhC78BAADXAgAwwAEAAH4AEMEBAADXAgAwwgEBAKYCACHHAQEApgIAIcgBQACoAgAhyQFAAKkCACHKAUAAqQIAIdsBAQCmAgAh3AEBAKYCACHdAQEAvgIAIQq_AQAA2AIAMMABAABoABDBAQAA2AIAMMIBAQCmAgAhxwEAANoC9wEiyQFAAKkCACHKAUAAqQIAIdoBAQCmAgAh2wEBAKYCACH1AQAA2QL1ASIHDAAAqwIAICkAAN4CACAqAADeAgAgywEAAAD1AQLMAQAAAPUBCM0BAAAA9QEI0gEAAN0C9QEiBwwAAKsCACApAADcAgAgKgAA3AIAIMsBAAAA9wECzAEAAAD3AQjNAQAAAPcBCNIBAADbAvcBIgcMAACrAgAgKQAA3AIAICoAANwCACDLAQAAAPcBAswBAAAA9wEIzQEAAAD3AQjSAQAA2wL3ASIEywEAAAD3AQLMAQAAAPcBCM0BAAAA9wEI0gEAANwC9wEiBwwAAKsCACApAADeAgAgKgAA3gIAIMsBAAAA9QECzAEAAAD1AQjNAQAAAPUBCNIBAADdAvUBIgTLAQAAAPUBAswBAAAA9QEIzQEAAAD1AQjSAQAA3gL1ASIJvwEAAN8CADDAAQAAUgAQwQEAAN8CADDCAQEApgIAIcgBQACoAgAhyQFAAKkCACHKAUAAqQIAIdwBAQCmAgAh9wEBAKYCACENBAAAuQIAIA8AAOECACARAADiAgAgFgAA4wIAIL8BAADgAgAwwAEAAD8AEMEBAADgAgAwwgEBALUCACHIAUAAtwIAIckBQAC4AgAhygFAALgCACHcAQEAtQIAIfcBAQC1AgAhA9YBAAAuACDXAQAALgAg2AEAAC4AIAPWAQAAMgAg1wEAADIAINgBAAAyACAD1gEAADYAINcBAAA2ACDYAQAANgAgDwMAAOgCACC_AQAA5AIAMMABAAA2ABDBAQAA5AIAMMIBAQC1AgAhxwEAAOcC7QEiyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh6AEAAOUC6AEi6QEBALUCACHqARAA5gIAIesBAQC1AgAh7QEBALUCACHuAUAAtwIAIQTLAQAAAOgBAswBAAAA6AEIzQEAAADoAQjSAQAA0QLoASIIywEQAAAAAcwBEAAAAATNARAAAAAEzgEQAAAAAc8BEAAAAAHQARAAAAAB0QEQAAAAAdIBEADPAgAhBMsBAAAA7QECzAEAAADtAQjNAQAAAO0BCNIBAADNAu0BIg8EAAC5AgAgDwAA4QIAIBEAAOICACAWAADjAgAgvwEAAOACADDAAQAAPwAQwQEAAOACADDCAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdwBAQC1AgAh9wEBALUCACH8AQAAPwAg_QEAAD8AIA8DAADoAgAgDQAAuwIAIA4AAOsCACAPAADsAgAgvwEAAOkCADDAAQAAMgAQwQEAAOkCADDCAQEAtQIAIccBAQC1AgAhyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh2wEBALUCACHcAQEAtQIAId0BAQDqAgAhC8sBAQAAAAHMAQEAAAAFzQEBAAAABc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAwAIAIdMBAQAAAAHUAQEAAAAB1QEBAAAAAQPWAQAAEQAg1wEAABEAINgBAAARACAD1gEAAA0AINcBAAANACDYAQAADQAgAtsBAQAAAAHcAQEAAAABDQMAAOgCACAFAAC6AgAgEQAA7AIAIL8BAADuAgAwwAEAAC4AEMEBAADuAgAwwgEBALUCACHIAUAAtwIAIckBQAC4AgAhygFAALgCACHbAQEAtQIAIdwBAQC1AgAh3QEBAOoCACEWBgAA8gIAIAcAAPMCACAIAAC7AgAgCQAA9AIAIAoAAPQCACALAAD1AgAgvwEAAO8CADDAAQAAFQAQwQEAAO8CADDCAQEAtQIAIccBAADwAuUBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAId0BAQDqAgAh3gEBALUCACHfAQEA6gIAIeABAQDqAgAh4QEBAOoCACHiAQEA6gIAIeMBAQC1AgAh5gEAAPEC5gEiBMsBAAAA5QECzAEAAADlAQjNAQAAAOUBCNIBAADHAuUBIgTLAQAAAOYBAswBAAAA5gEIzQEAAADmAQjSAQAAxQLmASIRAwAA6AIAIA0AALsCACAOAADrAgAgDwAA7AIAIL8BAADpAgAwwAEAADIAEMEBAADpAgAwwgEBALUCACHHAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh3AEBALUCACHdAQEA6gIAIfwBAAAyACD9AQAAMgAgGAYAAPICACAHAADzAgAgCAAAuwIAIAkAAPQCACAKAAD0AgAgCwAA9QIAIL8BAADvAgAwwAEAABUAEMEBAADvAgAwwgEBALUCACHHAQAA8ALlASLIAUAAtwIAIckBQAC4AgAhygFAALgCACHdAQEA6gIAId4BAQC1AgAh3wEBAOoCACHgAQEA6gIAIeEBAQDqAgAh4gEBAOoCACHjAQEAtQIAIeYBAADxAuYBIvwBAAAVACD9AQAAFQAgEQQAALkCACATAAC6AgAgFAAAuwIAIBUAALsCACC_AQAAtAIAMMABAAAbABDBAQAAtAIAMMIBAQC1AgAhwwEBALUCACHEAQEAtQIAIcUBAQC1AgAhxwEAALYCxwEiyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh_AEAABsAIP0BAAAbACARBgAA8gIAIA0AALsCACC_AQAA9gIAMMABAAARABDBAQAA9gIAMMIBAQC1AgAhxwEAAPcC8QEiyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh3AEBALUCACHeAQEAtQIAIe8BAQDqAgAh8QFAALcCACHyAUAAtwIAIfwBAAARACD9AQAAEQAgDwYAAPICACANAAC7AgAgvwEAAPYCADDAAQAAEQAQwQEAAPYCADDCAQEAtQIAIccBAAD3AvEBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdwBAQC1AgAh3gEBALUCACHvAQEA6gIAIfEBQAC3AgAh8gFAALcCACEEywEAAADxAQLMAQAAAPEBCM0BAAAA8QEI0gEAANUC8QEiAtkBAQAAAAHeAQEAAAABCAYAAPICACAQAAD6AgAgvwEAAPkCADDAAQAADQAQwQEAAPkCADDZAQEAtQIAId4BAQC1AgAh8wFAALgCACEPAwAA6AIAIAUAALoCACARAADsAgAgvwEAAO4CADDAAQAALgAQwQEAAO4CADDCAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh3AEBALUCACHdAQEA6gIAIfwBAAAuACD9AQAALgAgAtkBAQAAAAHaAQEAAAABCRAAAPoCACASAAD9AgAgvwEAAPwCADDAAQAACAAQwQEAAPwCADDJAUAAuAIAIcoBQAC4AgAh2QEBALUCACHaAQEAtQIAIREEAAC5AgAgEwAAugIAIBQAALsCACAVAAC7AgAgvwEAALQCADDAAQAAGwAQwQEAALQCADDCAQEAtQIAIcMBAQC1AgAhxAEBALUCACHFAQEAtQIAIccBAAC2AscBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAIfwBAAAbACD9AQAAGwAgAtoBAQAAAAHbAQEAAAABDAMAAOgCACASAAD9AgAgvwEAAP8CADDAAQAAAwAQwQEAAP8CADDCAQEAtQIAIccBAACBA_cBIskBQAC4AgAhygFAALgCACHaAQEAtQIAIdsBAQC1AgAh9QEAAIAD9QEiBMsBAAAA9QECzAEAAAD1AQjNAQAAAPUBCNIBAADeAvUBIgTLAQAAAPcBAswBAAAA9wEIzQEAAAD3AQjSAQAA3AL3ASIAAAAAAYECAQAAAAEBgQIAAADHAQIBgQJAAAAAAQGBAkAAAAABCyMAAMkDADAkAADOAwAw_gEAAMoDADD_AQAAywMAMIACAADMAwAggQIAAM0DADCCAgAAzQMAMIMCAADNAwAwhAIAAM0DADCFAgAAzwMAMIYCAADQAwAwCyMAALsDADAkAADAAwAw_gEAALwDADD_AQAAvQMAMIACAAC-AwAggQIAAL8DADCCAgAAvwMAMIMCAAC_AwAwhAIAAL8DADCFAgAAwQMAMIYCAADCAwAwCyMAALIDADAkAAC2AwAw_gEAALMDADD_AQAAtAMAMIACAAC1AwAggQIAAJIDADCCAgAAkgMAMIMCAACSAwAwhAIAAJIDADCFAgAAtwMAMIYCAACVAwAwCyMAAI4DADAkAACTAwAw_gEAAI8DADD_AQAAkAMAMIACAACRAwAggQIAAJIDADCCAgAAkgMAMIMCAACSAwAwhAIAAJIDADCFAgAAlAMAMIYCAACVAwAwEQYAAKsDACAHAACxAwAgCAAArAMAIAkAAK0DACALAACvAwAgwgEBAAAAAccBAAAA5QECyAFAAAAAAckBQAAAAAHKAUAAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHjAQEAAAAB5gEAAADmAQICAAAAFwAgIwAAsAMAIAMAAAAXACAjAACwAwAgJAAAmwMAIAEcAADyBQAwFgYAAPICACAHAADzAgAgCAAAuwIAIAkAAPQCACAKAAD0AgAgCwAA9QIAIL8BAADvAgAwwAEAABUAEMEBAADvAgAwwgEBAAAAAccBAADwAuUBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAId0BAQDqAgAh3gEBALUCACHfAQEA6gIAIeABAQDqAgAh4QEBAOoCACHiAQEA6gIAIeMBAQC1AgAh5gEAAPEC5gEiAgAAABcAIBwAAJsDACACAAAAlgMAIBwAAJcDACAQvwEAAJUDADDAAQAAlgMAEMEBAACVAwAwwgEBALUCACHHAQAA8ALlASLIAUAAtwIAIckBQAC4AgAhygFAALgCACHdAQEA6gIAId4BAQC1AgAh3wEBAOoCACHgAQEA6gIAIeEBAQDqAgAh4gEBAOoCACHjAQEAtQIAIeYBAADxAuYBIhC_AQAAlQMAMMABAACWAwAQwQEAAJUDADDCAQEAtQIAIccBAADwAuUBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAId0BAQDqAgAh3gEBALUCACHfAQEA6gIAIeABAQDqAgAh4QEBAOoCACHiAQEA6gIAIeMBAQC1AgAh5gEAAPEC5gEiDMIBAQCGAwAhxwEAAJkD5QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3QEBAJgDACHeAQEAhgMAId8BAQCYAwAh4AEBAJgDACHhAQEAmAMAIeMBAQCGAwAh5gEAAJoD5gEiAYECAQAAAAEBgQIAAADlAQIBgQIAAADmAQIRBgAAnAMAIAcAAJ0DACAIAACeAwAgCQAAnwMAIAsAAKADACDCAQEAhgMAIccBAACZA-UBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAId0BAQCYAwAh3gEBAIYDACHfAQEAmAMAIeABAQCYAwAh4QEBAJgDACHjAQEAhgMAIeYBAACaA-YBIgUjAADgBQAgJAAA8AUAIP4BAADhBQAg_wEAAO8FACCEAgAANAAgByMAANgFACAkAADtBQAg_gEAANkFACD_AQAA7AUAIIICAAAVACCDAgAAFQAghAIAABcAIAsjAAChAwAwJAAApQMAMP4BAACiAwAw_wEAAKMDADCAAgAApAMAIIECAACSAwAwggIAAJIDADCDAgAAkgMAMIQCAACSAwAwhQIAAKYDADCGAgAAlQMAMAcjAADeBQAgJAAA6gUAIP4BAADfBQAg_wEAAOkFACCCAgAAGwAggwIAABsAIIQCAACNAgAgByMAANoFACAkAADnBQAg_gEAANsFACD_AQAA5gUAIIICAAARACCDAgAAEQAghAIAABMAIBEGAACrAwAgCAAArAMAIAkAAK0DACAKAACuAwAgCwAArwMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAgAAABcAICMAAKoDACADAAAAFwAgIwAAqgMAICQAAKgDACABHAAA5QUAMAIAAAAXACAcAACoAwAgAgAAAJYDACAcAACnAwAgDMIBAQCGAwAhxwEAAJkD5QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3QEBAJgDACHeAQEAhgMAId8BAQCYAwAh4QEBAJgDACHiAQEAmAMAIeMBAQCGAwAh5gEAAJoD5gEiEQYAAJwDACAIAACeAwAgCQAAnwMAIAoAAKkDACALAACgAwAgwgEBAIYDACHHAQAAmQPlASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHdAQEAmAMAId4BAQCGAwAh3wEBAJgDACHhAQEAmAMAIeIBAQCYAwAh4wEBAIYDACHmAQAAmgPmASIHIwAA3AUAICQAAOMFACD-AQAA3QUAIP8BAADiBQAgggIAABsAIIMCAAAbACCEAgAAjQIAIBEGAACrAwAgCAAArAMAIAkAAK0DACAKAACuAwAgCwAArwMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAyMAAOAFACD-AQAA4QUAIIQCAAA0ACAEIwAAoQMAMP4BAACiAwAwgAIAAKQDACCEAgAAkgMAMAMjAADeBQAg_gEAAN8FACCEAgAAjQIAIAMjAADcBQAg_gEAAN0FACCEAgAAjQIAIAMjAADaBQAg_gEAANsFACCEAgAAEwAgEQYAAKsDACAHAACxAwAgCAAArAMAIAkAAK0DACALAACvAwAgwgEBAAAAAccBAAAA5QECyAFAAAAAAckBQAAAAAHKAUAAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHjAQEAAAAB5gEAAADmAQIDIwAA2AUAIP4BAADZBQAghAIAABcAIBEGAACrAwAgBwAAsQMAIAgAAKwDACAKAACuAwAgCwAArwMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAgAAABcAICMAALoDACADAAAAFwAgIwAAugMAICQAALkDACABHAAA1wUAMAIAAAAXACAcAAC5AwAgAgAAAJYDACAcAAC4AwAgDMIBAQCGAwAhxwEAAJkD5QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3QEBAJgDACHeAQEAhgMAId8BAQCYAwAh4AEBAJgDACHiAQEAmAMAIeMBAQCGAwAh5gEAAJoD5gEiEQYAAJwDACAHAACdAwAgCAAAngMAIAoAAKkDACALAACgAwAgwgEBAIYDACHHAQAAmQPlASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHdAQEAmAMAId4BAQCGAwAh3wEBAJgDACHgAQEAmAMAIeIBAQCYAwAh4wEBAIYDACHmAQAAmgPmASIRBgAAqwMAIAcAALEDACAIAACsAwAgCgAArgMAIAsAAK8DACDCAQEAAAABxwEAAADlAQLIAUAAAAAByQFAAAAAAcoBQAAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHgAQEAAAAB4gEBAAAAAeMBAQAAAAHmAQAAAOYBAgQQAADIAwAgyQFAAAAAAcoBQAAAAAHZAQEAAAABAgAAAAoAICMAAMcDACADAAAACgAgIwAAxwMAICQAAMUDACABHAAA1gUAMAoQAAD6AgAgEgAA_QIAIL8BAAD8AgAwwAEAAAgAEMEBAAD8AgAwyQFAALgCACHKAUAAuAIAIdkBAQC1AgAh2gEBALUCACH6AQAA-wIAIAIAAAAKACAcAADFAwAgAgAAAMMDACAcAADEAwAgB78BAADCAwAwwAEAAMMDABDBAQAAwgMAMMkBQAC4AgAhygFAALgCACHZAQEAtQIAIdoBAQC1AgAhB78BAADCAwAwwAEAAMMDABDBAQAAwgMAMMkBQAC4AgAhygFAALgCACHZAQEAtQIAIdoBAQC1AgAhA8kBQACJAwAhygFAAIkDACHZAQEAhgMAIQQQAADGAwAgyQFAAIkDACHKAUAAiQMAIdkBAQCGAwAhBSMAANEFACAkAADUBQAg_gEAANIFACD_AQAA0wUAIIQCAAAwACAEEAAAyAMAIMkBQAAAAAHKAUAAAAAB2QEBAAAAAQMjAADRBQAg_gEAANIFACCEAgAAMAAgBwMAANgDACDCAQEAAAABxwEAAAD3AQLJAUAAAAABygFAAAAAAdsBAQAAAAH1AQAAAPUBAgIAAAAFACAjAADXAwAgAwAAAAUAICMAANcDACAkAADVAwAgARwAANAFADANAwAA6AIAIBIAAP0CACC_AQAA_wIAMMABAAADABDBAQAA_wIAMMIBAQAAAAHHAQAAgQP3ASLJAUAAuAIAIcoBQAC4AgAh2gEBALUCACHbAQEAtQIAIfUBAACAA_UBIvsBAAD-AgAgAgAAAAUAIBwAANUDACACAAAA0QMAIBwAANIDACAKvwEAANADADDAAQAA0QMAEMEBAADQAwAwwgEBALUCACHHAQAAgQP3ASLJAUAAuAIAIcoBQAC4AgAh2gEBALUCACHbAQEAtQIAIfUBAACAA_UBIgq_AQAA0AMAMMABAADRAwAQwQEAANADADDCAQEAtQIAIccBAACBA_cBIskBQAC4AgAhygFAALgCACHaAQEAtQIAIdsBAQC1AgAh9QEAAIAD9QEiBsIBAQCGAwAhxwEAANQD9wEiyQFAAIkDACHKAUAAiQMAIdsBAQCGAwAh9QEAANMD9QEiAYECAAAA9QECAYECAAAA9wECBwMAANYDACDCAQEAhgMAIccBAADUA_cBIskBQACJAwAhygFAAIkDACHbAQEAhgMAIfUBAADTA_UBIgUjAADLBQAgJAAAzgUAIP4BAADMBQAg_wEAAM0FACCEAgAAAQAgBwMAANgDACDCAQEAAAABxwEAAAD3AQLJAUAAAAABygFAAAAAAdsBAQAAAAH1AQAAAPUBAgMjAADLBQAg_gEAAMwFACCEAgAAAQAgBCMAAMkDADD-AQAAygMAMIACAADMAwAghAIAAM0DADAEIwAAuwMAMP4BAAC8AwAwgAIAAL4DACCEAgAAvwMAMAQjAACyAwAw_gEAALMDADCAAgAAtQMAIIQCAACSAwAwBCMAAI4DADD-AQAAjwMAMIACAACRAwAghAIAAJIDADAAAAAAAAAFIwAAxgUAICQAAMkFACD-AQAAxwUAIP8BAADIBQAghAIAAI0CACADIwAAxgUAIP4BAADHBQAghAIAAI0CACAAAAAFIwAAugUAICQAAMQFACD-AQAAuwUAIP8BAADDBQAghAIAAAEAIAsjAAD5AwAwJAAA_QMAMP4BAAD6AwAw_wEAAPsDADCAAgAA_AMAIIECAAC_AwAwggIAAL8DADCDAgAAvwMAMIQCAAC_AwAwhQIAAP4DADCGAgAAwgMAMAsjAADrAwAwJAAA8AMAMP4BAADsAwAw_wEAAO0DADCAAgAA7gMAIIECAADvAwAwggIAAO8DADCDAgAA7wMAMIQCAADvAwAwhQIAAPEDADCGAgAA8gMAMAMGAAD4AwAg3gEBAAAAAfMBQAAAAAECAAAADwAgIwAA9wMAIAMAAAAPACAjAAD3AwAgJAAA9QMAIAEcAADCBQAwCQYAAPICACAQAAD6AgAgvwEAAPkCADDAAQAADQAQwQEAAPkCADDZAQEAtQIAId4BAQC1AgAh8wFAALgCACH5AQAA-AIAIAIAAAAPACAcAAD1AwAgAgAAAPMDACAcAAD0AwAgBr8BAADyAwAwwAEAAPMDABDBAQAA8gMAMNkBAQC1AgAh3gEBALUCACHzAUAAuAIAIQa_AQAA8gMAMMABAADzAwAQwQEAAPIDADDZAQEAtQIAId4BAQC1AgAh8wFAALgCACEC3gEBAIYDACHzAUAAiQMAIQMGAAD2AwAg3gEBAIYDACHzAUAAiQMAIQUjAAC9BQAgJAAAwAUAIP4BAAC-BQAg_wEAAL8FACCEAgAANAAgAwYAAPgDACDeAQEAAAAB8wFAAAAAAQMjAAC9BQAg_gEAAL4FACCEAgAANAAgBBIAAOQDACDJAUAAAAABygFAAAAAAdoBAQAAAAECAAAACgAgIwAAgQQAIAMAAAAKACAjAACBBAAgJAAAgAQAIAEcAAC8BQAwAgAAAAoAIBwAAIAEACACAAAAwwMAIBwAAP8DACADyQFAAIkDACHKAUAAiQMAIdoBAQCGAwAhBBIAAOMDACDJAUAAiQMAIcoBQACJAwAh2gEBAIYDACEEEgAA5AMAIMkBQAAAAAHKAUAAAAAB2gEBAAAAAQMjAAC6BQAg_gEAALsFACCEAgAAAQAgBCMAAPkDADD-AQAA-gMAMIACAAD8AwAghAIAAL8DADAEIwAA6wMAMP4BAADsAwAwgAIAAO4DACCEAgAA7wMAMAAAAAAAAAAAAYECAAAA6AECBYECEAAAAAGHAhAAAAABiAIQAAAAAYkCEAAAAAGKAhAAAAABAYECAAAA7QECBSMAALUFACAkAAC4BQAg_gEAALYFACD_AQAAtwUAIIQCAAABACADIwAAtQUAIP4BAAC2BQAghAIAAAEAIAAAAAGBAgAAAPEBAgUjAACvBQAgJAAAswUAIP4BAACwBQAg_wEAALIFACCEAgAANAAgCyMAAJgEADAkAACcBAAw_gEAAJkEADD_AQAAmgQAMIACAACbBAAggQIAAJIDADCCAgAAkgMAMIMCAACSAwAwhAIAAJIDADCFAgAAnQQAMIYCAACVAwAwEQYAAKsDACAHAACxAwAgCAAArAMAIAkAAK0DACAKAACuAwAgwgEBAAAAAccBAAAA5QECyAFAAAAAAckBQAAAAAHKAUAAAAAB3QEBAAAAAd4BAQAAAAHgAQEAAAAB4QEBAAAAAeIBAQAAAAHjAQEAAAAB5gEAAADmAQICAAAAFwAgIwAAoAQAIAMAAAAXACAjAACgBAAgJAAAnwQAIAEcAACxBQAwAgAAABcAIBwAAJ8EACACAAAAlgMAIBwAAJ4EACAMwgEBAIYDACHHAQAAmQPlASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHdAQEAmAMAId4BAQCGAwAh4AEBAJgDACHhAQEAmAMAIeIBAQCYAwAh4wEBAIYDACHmAQAAmgPmASIRBgAAnAMAIAcAAJ0DACAIAACeAwAgCQAAnwMAIAoAAKkDACDCAQEAhgMAIccBAACZA-UBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAId0BAQCYAwAh3gEBAIYDACHgAQEAmAMAIeEBAQCYAwAh4gEBAJgDACHjAQEAhgMAIeYBAACaA-YBIhEGAACrAwAgBwAAsQMAIAgAAKwDACAJAACtAwAgCgAArgMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHeAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAyMAAK8FACD-AQAAsAUAIIQCAAA0ACAEIwAAmAQAMP4BAACZBAAwgAIAAJsEACCEAgAAkgMAMAAAAAUjAACqBQAgJAAArQUAIP4BAACrBQAg_wEAAKwFACCEAgAAMAAgAyMAAKoFACD-AQAAqwUAIIQCAAAwACAAAAAFIwAAogUAICQAAKgFACD-AQAAowUAIP8BAACnBQAghAIAAAEAIAsjAADBBAAwJAAAxgQAMP4BAADCBAAw_wEAAMMEADCAAgAAxAQAIIECAADFBAAwggIAAMUEADCDAgAAxQQAMIQCAADFBAAwhQIAAMcEADCGAgAAyAQAMAsjAAC4BAAwJAAAvAQAMP4BAAC5BAAw_wEAALoEADCAAgAAuwQAIIECAADvAwAwggIAAO8DADCDAgAA7wMAMIQCAADvAwAwhQIAAL0EADCGAgAA8gMAMAsjAACvBAAwJAAAswQAMP4BAACwBAAw_wEAALEEADCAAgAAsgQAIIECAACSAwAwggIAAJIDADCDAgAAkgMAMIQCAACSAwAwhQIAALQEADCGAgAAlQMAMBEHAACxAwAgCAAArAMAIAkAAK0DACAKAACuAwAgCwAArwMAIMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAgAAABcAICMAALcEACADAAAAFwAgIwAAtwQAICQAALYEACABHAAApgUAMAIAAAAXACAcAAC2BAAgAgAAAJYDACAcAAC1BAAgDMIBAQCGAwAhxwEAAJkD5QEiyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3QEBAJgDACHfAQEAmAMAIeABAQCYAwAh4QEBAJgDACHiAQEAmAMAIeMBAQCGAwAh5gEAAJoD5gEiEQcAAJ0DACAIAACeAwAgCQAAnwMAIAoAAKkDACALAACgAwAgwgEBAIYDACHHAQAAmQPlASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHdAQEAmAMAId8BAQCYAwAh4AEBAJgDACHhAQEAmAMAIeIBAQCYAwAh4wEBAIYDACHmAQAAmgPmASIRBwAAsQMAIAgAAKwDACAJAACtAwAgCgAArgMAIAsAAK8DACDCAQEAAAABxwEAAADlAQLIAUAAAAAByQFAAAAAAcoBQAAAAAHdAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHmAQAAAOYBAgMQAACnBAAg2QEBAAAAAfMBQAAAAAECAAAADwAgIwAAwAQAIAMAAAAPACAjAADABAAgJAAAvwQAIAEcAAClBQAwAgAAAA8AIBwAAL8EACACAAAA8wMAIBwAAL4EACAC2QEBAIYDACHzAUAAiQMAIQMQAACmBAAg2QEBAIYDACHzAUAAiQMAIQMQAACnBAAg2QEBAAAAAfMBQAAAAAEKDQAAogQAIMIBAQAAAAHHAQAAAPEBAsgBQAAAAAHJAUAAAAABygFAAAAAAdwBAQAAAAHvAQEAAAAB8QFAAAAAAfIBQAAAAAECAAAAEwAgIwAAzAQAIAMAAAATACAjAADMBAAgJAAAywQAIAEcAACkBQAwDwYAAPICACANAAC7AgAgvwEAAPYCADDAAQAAEQAQwQEAAPYCADDCAQEAAAABxwEAAPcC8QEiyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh3AEBALUCACHeAQEAtQIAIe8BAQDqAgAh8QFAALcCACHyAUAAtwIAIQIAAAATACAcAADLBAAgAgAAAMkEACAcAADKBAAgDb8BAADIBAAwwAEAAMkEABDBAQAAyAQAMMIBAQC1AgAhxwEAAPcC8QEiyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh3AEBALUCACHeAQEAtQIAIe8BAQDqAgAh8QFAALcCACHyAUAAtwIAIQ2_AQAAyAQAMMABAADJBAAQwQEAAMgEADDCAQEAtQIAIccBAAD3AvEBIsgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdwBAQC1AgAh3gEBALUCACHvAQEA6gIAIfEBQAC3AgAh8gFAALcCACEJwgEBAIYDACHHAQAAlQTxASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHcAQEAhgMAIe8BAQCYAwAh8QFAAIgDACHyAUAAiAMAIQoNAACXBAAgwgEBAIYDACHHAQAAlQTxASLIAUAAiAMAIckBQACJAwAhygFAAIkDACHcAQEAhgMAIe8BAQCYAwAh8QFAAIgDACHyAUAAiAMAIQoNAACiBAAgwgEBAAAAAccBAAAA8QECyAFAAAAAAckBQAAAAAHKAUAAAAAB3AEBAAAAAe8BAQAAAAHxAUAAAAAB8gFAAAAAAQMjAACiBQAg_gEAAKMFACCEAgAAAQAgBCMAAMEEADD-AQAAwgQAMIACAADEBAAghAIAAMUEADAEIwAAuAQAMP4BAAC5BAAwgAIAALsEACCEAgAA7wMAMAQjAACvBAAw_gEAALAEADCAAgAAsgQAIIQCAACSAwAwAAAABSMAAJ0FACAkAACgBQAg_gEAAJ4FACD_AQAAnwUAIIQCAACNAgAgAyMAAJ0FACD-AQAAngUAIIQCAACNAgAgAAAACyMAAIEFADAkAACFBQAw_gEAAIIFADD_AQAAgwUAMIACAACEBQAggQIAAM0DADCCAgAAzQMAMIMCAADNAwAwhAIAAM0DADCFAgAAhgUAMIYCAADQAwAwCyMAAPUEADAkAAD6BAAw_gEAAPYEADD_AQAA9wQAMIACAAD4BAAggQIAAPkEADCCAgAA-QQAMIMCAAD5BAAwhAIAAPkEADCFAgAA-wQAMIYCAAD8BAAwCyMAAOkEADAkAADuBAAw_gEAAOoEADD_AQAA6wQAMIACAADsBAAggQIAAO0EADCCAgAA7QQAMIMCAADtBAAwhAIAAO0EADCFAgAA7wQAMIYCAADwBAAwCyMAAN0EADAkAADiBAAw_gEAAN4EADD_AQAA3wQAMIACAADgBAAggQIAAOEEADCCAgAA4QQAMIMCAADhBAAwhAIAAOEEADCFAgAA4wQAMIYCAADkBAAwCsIBAQAAAAHHAQAAAO0BAskBQAAAAAHKAUAAAAAB6AEAAADoAQLpAQEAAAAB6gEQAAAAAesBAQAAAAHtAQEAAAAB7gFAAAAAAQIAAAA4ACAjAADoBAAgAwAAADgAICMAAOgEACAkAADnBAAgARwAAJwFADAPAwAA6AIAIL8BAADkAgAwwAEAADYAEMEBAADkAgAwwgEBAAAAAccBAADnAu0BIskBQAC4AgAhygFAALgCACHbAQEAtQIAIegBAADlAugBIukBAQAAAAHqARAA5gIAIesBAQC1AgAh7QEBALUCACHuAUAAtwIAIQIAAAA4ACAcAADnBAAgAgAAAOUEACAcAADmBAAgDr8BAADkBAAwwAEAAOUEABDBAQAA5AQAMMIBAQC1AgAhxwEAAOcC7QEiyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh6AEAAOUC6AEi6QEBALUCACHqARAA5gIAIesBAQC1AgAh7QEBALUCACHuAUAAtwIAIQ6_AQAA5AQAMMABAADlBAAQwQEAAOQEADDCAQEAtQIAIccBAADnAu0BIskBQAC4AgAhygFAALgCACHbAQEAtQIAIegBAADlAugBIukBAQC1AgAh6gEQAOYCACHrAQEAtQIAIe0BAQC1AgAh7gFAALcCACEKwgEBAIYDACHHAQAAjwTtASLJAUAAiQMAIcoBQACJAwAh6AEAAI0E6AEi6QEBAIYDACHqARAAjgQAIesBAQCGAwAh7QEBAIYDACHuAUAAiAMAIQrCAQEAhgMAIccBAACPBO0BIskBQACJAwAhygFAAIkDACHoAQAAjQToASLpAQEAhgMAIeoBEACOBAAh6wEBAIYDACHtAQEAhgMAIe4BQACIAwAhCsIBAQAAAAHHAQAAAO0BAskBQAAAAAHKAUAAAAAB6AEAAADoAQLpAQEAAAAB6gEQAAAAAesBAQAAAAHtAQEAAAAB7gFAAAAAAQoNAADQBAAgDgAAzgQAIA8AAM8EACDCAQEAAAABxwEBAAAAAcgBQAAAAAHJAUAAAAABygFAAAAAAdwBAQAAAAHdAQEAAAABAgAAADQAICMAAPQEACADAAAANAAgIwAA9AQAICQAAPMEACABHAAAmwUAMA8DAADoAgAgDQAAuwIAIA4AAOsCACAPAADsAgAgvwEAAOkCADDAAQAAMgAQwQEAAOkCADDCAQEAAAABxwEBALUCACHIAUAAtwIAIckBQAC4AgAhygFAALgCACHbAQEAtQIAIdwBAQC1AgAh3QEBAOoCACECAAAANAAgHAAA8wQAIAIAAADxBAAgHAAA8gQAIAu_AQAA8AQAMMABAADxBAAQwQEAAPAEADDCAQEAtQIAIccBAQC1AgAhyAFAALcCACHJAUAAuAIAIcoBQAC4AgAh2wEBALUCACHcAQEAtQIAId0BAQDqAgAhC78BAADwBAAwwAEAAPEEABDBAQAA8AQAMMIBAQC1AgAhxwEBALUCACHIAUAAtwIAIckBQAC4AgAhygFAALgCACHbAQEAtQIAIdwBAQC1AgAh3QEBAOoCACEHwgEBAIYDACHHAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh3QEBAJgDACEKDQAArgQAIA4AAKwEACAPAACtBAAgwgEBAIYDACHHAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh3QEBAJgDACEKDQAA0AQAIA4AAM4EACAPAADPBAAgwgEBAAAAAccBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB3QEBAAAAAQgFAACDBAAgEQAAhAQAIMIBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB3QEBAAAAAQIAAAAwACAjAACABQAgAwAAADAAICMAAIAFACAkAAD_BAAgARwAAJoFADAOAwAA6AIAIAUAALoCACARAADsAgAgvwEAAO4CADDAAQAALgAQwQEAAO4CADDCAQEAAAAByAFAALcCACHJAUAAuAIAIcoBQAC4AgAh2wEBALUCACHcAQEAtQIAId0BAQDqAgAh-AEAAO0CACACAAAAMAAgHAAA_wQAIAIAAAD9BAAgHAAA_gQAIAq_AQAA_AQAMMABAAD9BAAQwQEAAPwEADDCAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh3AEBALUCACHdAQEA6gIAIQq_AQAA_AQAMMABAAD9BAAQwQEAAPwEADDCAQEAtQIAIcgBQAC3AgAhyQFAALgCACHKAUAAuAIAIdsBAQC1AgAh3AEBALUCACHdAQEA6gIAIQbCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh3QEBAJgDACEIBQAA6QMAIBEAAOoDACDCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh3QEBAJgDACEIBQAAgwQAIBEAAIQEACDCAQEAAAAByAFAAAAAAckBQAAAAAHKAUAAAAAB3AEBAAAAAd0BAQAAAAEHEgAA1QQAIMIBAQAAAAHHAQAAAPcBAskBQAAAAAHKAUAAAAAB2gEBAAAAAfUBAAAA9QECAgAAAAUAICMAAIkFACADAAAABQAgIwAAiQUAICQAAIgFACABHAAAmQUAMAIAAAAFACAcAACIBQAgAgAAANEDACAcAACHBQAgBsIBAQCGAwAhxwEAANQD9wEiyQFAAIkDACHKAUAAiQMAIdoBAQCGAwAh9QEAANMD9QEiBxIAANQEACDCAQEAhgMAIccBAADUA_cBIskBQACJAwAhygFAAIkDACHaAQEAhgMAIfUBAADTA_UBIgcSAADVBAAgwgEBAAAAAccBAAAA9wECyQFAAAAAAcoBQAAAAAHaAQEAAAAB9QEAAAD1AQIEIwAAgQUAMP4BAACCBQAwgAIAAIQFACCEAgAAzQMAMAQjAAD1BAAw_gEAAPYEADCAAgAA-AQAIIQCAAD5BAAwBCMAAOkEADD-AQAA6gQAMIACAADsBAAghAIAAO0EADAEIwAA3QQAMP4BAADeBAAwgAIAAOAEACCEAgAA4QQAMAAAAAUEAADdAwAgDwAAjgUAIBEAAI8FACAWAACQBQAgyAEAAIIDACAAAAYDAACRBQAgDQAA3wMAIA4AAJIFACAPAACTBQAgyAEAAIIDACDdAQAAggMAIAwGAACUBQAgBwAAlQUAIAgAAN8DACAJAACWBQAgCgAAlgUAIAsAAJcFACDIAQAAggMAIN0BAACCAwAg3wEAAIIDACDgAQAAggMAIOEBAACCAwAg4gEAAIIDACAFBAAA3QMAIBMAAN4DACAUAADfAwAgFQAA3wMAIMgBAACCAwAgBgYAAJQFACANAADfAwAgyAEAAIIDACDvAQAAggMAIPEBAACCAwAg8gEAAIIDACAFAwAAkQUAIAUAAN4DACARAACTBQAgyAEAAIIDACDdAQAAggMAIAbCAQEAAAABxwEAAAD3AQLJAUAAAAABygFAAAAAAdoBAQAAAAH1AQAAAPUBAgbCAQEAAAAByAFAAAAAAckBQAAAAAHKAUAAAAAB3AEBAAAAAd0BAQAAAAEHwgEBAAAAAccBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB3QEBAAAAAQrCAQEAAAABxwEAAADtAQLJAUAAAAABygFAAAAAAegBAAAA6AEC6QEBAAAAAeoBEAAAAAHrAQEAAAAB7QEBAAAAAe4BQAAAAAELEwAA2gMAIBQAANsDACAVAADcAwAgwgEBAAAAAcMBAQAAAAHEAQEAAAABxQEBAAAAAccBAAAAxwECyAFAAAAAAckBQAAAAAHKAUAAAAABAgAAAI0CACAjAACdBQAgAwAAABsAICMAAJ0FACAkAAChBQAgDQAAABsAIBMAAIsDACAUAACMAwAgFQAAjQMAIBwAAKEFACDCAQEAhgMAIcMBAQCGAwAhxAEBAIYDACHFAQEAhgMAIccBAACHA8cBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAIQsTAACLAwAgFAAAjAMAIBUAAI0DACDCAQEAhgMAIcMBAQCGAwAhxAEBAIYDACHFAQEAhgMAIccBAACHA8cBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAIQkEAACKBQAgDwAAiwUAIBYAAI0FACDCAQEAAAAByAFAAAAAAckBQAAAAAHKAUAAAAAB3AEBAAAAAfcBAQAAAAECAAAAAQAgIwAAogUAIAnCAQEAAAABxwEAAADxAQLIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB7wEBAAAAAfEBQAAAAAHyAUAAAAABAtkBAQAAAAHzAUAAAAABDMIBAQAAAAHHAQAAAOUBAsgBQAAAAAHJAUAAAAABygFAAAAAAd0BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeYBAAAA5gECAwAAAD8AICMAAKIFACAkAACpBQAgCwAAAD8AIAQAANkEACAPAADaBAAgFgAA3AQAIBwAAKkFACDCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh9wEBAIYDACEJBAAA2QQAIA8AANoEACAWAADcBAAgwgEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHcAQEAhgMAIfcBAQCGAwAhCQMAAIIEACAFAACDBAAgwgEBAAAAAcgBQAAAAAHJAUAAAAABygFAAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAQIAAAAwACAjAACqBQAgAwAAAC4AICMAAKoFACAkAACuBQAgCwAAAC4AIAMAAOgDACAFAADpAwAgHAAArgUAIMIBAQCGAwAhyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh2wEBAIYDACHcAQEAhgMAId0BAQCYAwAhCQMAAOgDACAFAADpAwAgwgEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHbAQEAhgMAIdwBAQCGAwAh3QEBAJgDACELAwAAzQQAIA0AANAEACAPAADPBAAgwgEBAAAAAccBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHbAQEAAAAB3AEBAAAAAd0BAQAAAAECAAAANAAgIwAArwUAIAzCAQEAAAABxwEAAADlAQLIAUAAAAAByQFAAAAAAcoBQAAAAAHdAQEAAAAB3gEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHmAQAAAOYBAgMAAAAyACAjAACvBQAgJAAAtAUAIA0AAAAyACADAACrBAAgDQAArgQAIA8AAK0EACAcAAC0BQAgwgEBAIYDACHHAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdsBAQCGAwAh3AEBAIYDACHdAQEAmAMAIQsDAACrBAAgDQAArgQAIA8AAK0EACDCAQEAhgMAIccBAQCGAwAhyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh2wEBAIYDACHcAQEAhgMAId0BAQCYAwAhCQQAAIoFACAPAACLBQAgEQAAjAUAIMIBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB9wEBAAAAAQIAAAABACAjAAC1BQAgAwAAAD8AICMAALUFACAkAAC5BQAgCwAAAD8AIAQAANkEACAPAADaBAAgEQAA2wQAIBwAALkFACDCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh9wEBAIYDACEJBAAA2QQAIA8AANoEACARAADbBAAgwgEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHcAQEAhgMAIfcBAQCGAwAhCQQAAIoFACARAACMBQAgFgAAjQUAIMIBAQAAAAHIAUAAAAAByQFAAAAAAcoBQAAAAAHcAQEAAAAB9wEBAAAAAQIAAAABACAjAAC6BQAgA8kBQAAAAAHKAUAAAAAB2gEBAAAAAQsDAADNBAAgDQAA0AQAIA4AAM4EACDCAQEAAAABxwEBAAAAAcgBQAAAAAHJAUAAAAABygFAAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAQIAAAA0ACAjAAC9BQAgAwAAADIAICMAAL0FACAkAADBBQAgDQAAADIAIAMAAKsEACANAACuBAAgDgAArAQAIBwAAMEFACDCAQEAhgMAIccBAQCGAwAhyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh2wEBAIYDACHcAQEAhgMAId0BAQCYAwAhCwMAAKsEACANAACuBAAgDgAArAQAIMIBAQCGAwAhxwEBAIYDACHIAUAAiAMAIckBQACJAwAhygFAAIkDACHbAQEAhgMAIdwBAQCGAwAh3QEBAJgDACEC3gEBAAAAAfMBQAAAAAEDAAAAPwAgIwAAugUAICQAAMUFACALAAAAPwAgBAAA2QQAIBEAANsEACAWAADcBAAgHAAAxQUAIMIBAQCGAwAhyAFAAIgDACHJAUAAiQMAIcoBQACJAwAh3AEBAIYDACH3AQEAhgMAIQkEAADZBAAgEQAA2wQAIBYAANwEACDCAQEAhgMAIcgBQACIAwAhyQFAAIkDACHKAUAAiQMAIdwBAQCGAwAh9wEBAIYDACELBAAA2QMAIBQAANsDACAVAADcAwAgwgEBAAAAAcMBAQAAAAHEAQEAAAABxQEBAAAAAccBAAAAxwECyAFAAAAAAckBQAAAAAHKAUAAAAABAgAAAI0CACAjAADGBQAgAwAAABsAICMAAMYFACAkAADKBQAgDQAAABsAIAQAAIoDACAUAACMAwAgFQAAjQMAIBwAAMoFACDCAQEAhgMAIcMBAQCGAwAhxAEBAIYDACHFAQEAhgMAIccBAACHA8cBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAIQsEAACKAwAgFAAAjAMAIBUAAI0DACDCAQEAhgMAIcMBAQCGAwAhxAEBAIYDACHFAQEAhgMAIccBAACHA8cBIsgBQACIAwAhyQFAAIkDACHKAUAAiQMAIQkPAACLBQAgEQAAjAUAIBYAAI0FACDCAQEAAAAByAFAAAAAAckBQAAAAAHKAUAAAAAB3AEBAAAAAfcBAQAAAAECAAAAAQAgIwAAywUAIAMAAAA_ACAjAADLBQAgJAAAzwUAIAsAAAA_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-bAc_bQdAbgdBbwdCcQdDcxFEdCBFdgdGeBFHeSFIegdJewdKfBFLfyJMgAEmTYEBBk6CAQZPgwEGUIQBBlGFAQZShwEGU4kBEVSKASdVjAEGVo4BEVePAShYkAEGWZEBBlqSARFblQEpXJYBLV2XAQhemAEIX5kBCGCaAQhhmwEIYp0BCGOfARFkoAEuZaIBCGakARFnpQEvaKYBCGmnAQhqqAERa6sBMGysATRtrQEPbq4BD2-vAQ9wsAEPcbEBD3KzAQ9ztQERdLYBNXW4AQ92ugERd7sBNni8AQ95vQEPer4BEX3BATd-wgE9f8MBCYABxAEJgQHFAQmCAcYBCYMBxwEJhAHJAQmFAcsBEYYBzAE-hwHSAQmIAdQBEYkB1QE_igHaAQmLAdsBCYwB3AERjQHfAUCOAeABRI8B4QEFkAHiAQWRAeMBBZIB5AEFkwHlAQWUAecBBZUB6QERlgHqAUWXAewBBZgB7gERmQHvAUaaAfABBZsB8QEFnAHyARGdAfUBR54B9gFLnwH3AQSgAfgBBKEB-QEEogH6AQSjAfsBBKQB_QEEpQH_ARGmAYACTKcBggIEqAGEAhGpAYUCTaoBhgIEqwGHAgSsAYgCEa0BiwJOrgGMAlKvAY4CA7ABjwIDsQGRAgOyAZICA7MBkwIDtAGVAgO1AZcCEbYBmAJTtwGaAgO4AZwCEbkBnQJUugGeAgO7AZ8CA7wBoAIRvQGjAlW-AaQCWQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrganizationMembershipScalarFieldEnum: () => OrganizationMembershipScalarFieldEnum,
  OrganizationScalarFieldEnum: () => OrganizationScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectScalarFieldEnum: () => ProjectScalarFieldEnum,
  ProjectTeamScalarFieldEnum: () => ProjectTeamScalarFieldEnum,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  SprintScalarFieldEnum: () => SprintScalarFieldEnum,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TeamMembershipScalarFieldEnum: () => TeamMembershipScalarFieldEnum,
  TeamScalarFieldEnum: () => TeamScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Organization: "Organization",
  OrganizationMembership: "OrganizationMembership",
  Project: "Project",
  ProjectTeam: "ProjectTeam",
  Sprint: "Sprint",
  Subscription: "Subscription",
  Task: "Task",
  Team: "Team",
  TeamMembership: "TeamMembership",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var OrganizationScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganizationMembershipScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  userId: "userId",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  status: "status",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectTeamScalarFieldEnum = {
  projectId: "projectId",
  teamId: "teamId",
  assignedAt: "assignedAt"
};
var SprintScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  name: "name",
  goal: "goal",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  gateway: "gateway",
  transactionId: "transactionId",
  amount: "amount",
  currency: "currency",
  status: "status",
  planName: "planName",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  sprintId: "sprintId",
  parentTaskId: "parentTaskId",
  creatorId: "creatorId",
  assigneeId: "assigneeId",
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeamScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var TeamMembershipScalarFieldEnum = {
  teamId: "teamId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  passwordHash: "passwordHash",
  fullName: "fullName",
  status: "status",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE"
};
var TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
var SprintStatus = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/middleware/global-error.ts
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

// src/app/config/index.ts
import path2 from "path";
import dotenv from "dotenv";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5e3,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  admin_password: process.env.ADMIN_PASSWORD,
  frontend_url: process.env.FRONTEND_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID
};

// src/app/middleware/global-error.ts
var AppError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
  statusCode;
};
var globalError = (err, req, res, _next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails = [];
  if (config_default.node_env === "development") {
    console.error("Error:", err);
  }
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails.push({
      field: "general",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = StatusCodes.CONFLICT;
        message = "Duplicate value found.";
        const field = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : String(err.meta?.target);
        errorDetails.push({
          field,
          message: `${field} already exists.`
        });
        break;
      }
      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "Resource not found.";
        errorDetails.push({
          field: "resource",
          message: "The requested resource does not exist."
        });
        break;
      case "P2003":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Invalid reference.";
        errorDetails.push({
          field: "relation",
          message: "Referenced record does not exist."
        });
        break;
      case "P2014":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Relation constraint failed.";
        errorDetails.push({
          field: "relation",
          message: "Operation violates required relation."
        });
        break;
      default:
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Database request failed.";
        errorDetails.push({
          field: "database",
          message: err.message
        });
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Database validation failed.";
    errorDetails.push({
      field: "database",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database connection failed.";
    errorDetails.push({
      field: "database",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database engine crashed.";
    errorDetails.push({
      field: "database",
      message: "Unexpected database engine error."
    });
  } else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid access token.";
    errorDetails.push({
      field: "token",
      message: "The provided access token is invalid."
    });
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Access token expired.";
    errorDetails.push({
      field: "token",
      message: "Please login again."
    });
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails.push({
      field: "general",
      message: err.message
    });
  }
  if (process.env.NODE_ENV !== "production") {
  }
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails
  });
};
var global_error_default = globalError;

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/utils/catch-async.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catch_async_default = catchAsync;

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/module/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secretKey, expire) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expire
  });
  return token;
};
var verifyToken = (token, secretKey) => {
  try {
    const verify = jwt.verify(token, secretKey);
    return {
      success: true,
      data: verify
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = { createToken, verifyToken };

// src/app/module/auth/auth.service.ts
var registerOrgOwner = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (existingUser) {
    throw new Error("Organization owner with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword
      },
      omit: { passwordHash: true }
    });
    const organization = await tx.organization.create({
      data: {
        name: payload.organizationName,
        slug: payload.organizationSlug
      }
    });
    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "ADMIN"
      }
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      },
      role: membership.role
    };
  });
  return result;
};
var registerMember = async (payload) => {
  const organization = await prisma.organization.findUnique({
    where: { id: payload.organizationId }
  });
  if (!organization || organization.deletedAt) {
    throw new Error("Organization not found.");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword
      },
      omit: { passwordHash: true }
    });
    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: payload.organizationId,
        role: "MEMBER"
      }
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      organizationId: membership.organizationId,
      role: membership.role
    };
  });
  return result;
};
var login = async (payload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      memberships: true
    }
  });
  if (!user || user.deletedAt) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.passwordHash
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
    organizationId: membership.organizationId
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    jwtPayload
  };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      passwordHash: true
    },
    include: {
      memberships: {
        include: {
          organization: true
        }
      }
    }
  });
  if (!user || user.deletedAt) {
    throw new Error("User not found");
  }
  return user;
};
var refreshToken = async (incomingRefreshToken) => {
  const verifiedToken = jwtUtils.verifyToken(
    incomingRefreshToken,
    config_default.jwt_refresh_secret
  );
  if (!verifiedToken.success) {
    throw new Error("Invalid refresh token");
  }
  const { id } = verifiedToken.data;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: true
    }
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
    organizationId: membership.organizationId
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return {
    accessToken,
    jwtPayload
  };
};
var authService = {
  registerOrgOwner,
  registerMember,
  login,
  getMe,
  refreshToken
};

// src/app/utils/response.ts
var sendSuccessResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data,
    meta: data?.meta
  });
};

// src/app/module/auth/auth.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";
var registerOrgOwner2 = catch_async_default(
  async (req, res, next) => {
    const result = await authService.registerOrgOwner(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.CREATED,
      message: "Organization and Owner account created successfully",
      data: result
    });
  }
);
var registerMember2 = catch_async_default(
  async (req, res, next) => {
    const result = await authService.registerMember(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.CREATED,
      message: "Member account created and joined organization successfully",
      data: result
    });
  }
);
var login2 = catch_async_default(
  async (req, res, next) => {
    const { accessToken, refreshToken: refreshToken3, jwtPayload } = await authService.login(
      req.body
    );
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days in milliseconds
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1e3
      // 1 day in milliseconds
    });
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User logged in successfully",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken: refreshToken3
      }
    });
  }
);
var getMe2 = catch_async_default(
  async (req, res, next) => {
    const userId = req.user?.id;
    console.log("user", req.user);
    if (!userId) {
      throw new Error("Cannot fetch user, please log in again");
    }
    const result = await authService.getMe(userId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User data retrieved successfully",
      data: result
    });
  }
);
var refreshToken2 = catch_async_default(
  async (req, res, next) => {
    const { refreshToken: token } = req.cookies;
    if (!token) {
      throw new Error("No refresh token provided. Please log in again.");
    }
    const { accessToken, jwtPayload } = await authService.refreshToken(token);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1e3
    });
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "Access token generated successfully",
      data: {
        accessToken,
        user: jwtPayload
      }
    });
  }
);
var google = catch_async_default(
  async (req, res, next) => {
    const { accessToken, refreshToken: refreshToken3, jwtPayload } = await authService.google(
      req.body.idToken
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User logged in successfully via Google",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken: refreshToken3
      }
    });
  }
);
var authController = {
  registerOrgOwner: registerOrgOwner2,
  registerMember: registerMember2,
  login: login2,
  getMe: getMe2,
  refreshToken: refreshToken2,
  google
};

// src/app/middleware/validate.ts
var validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body
    });
    if (!result.success) {
      res.status(400).json({
        status: "error",
        errors: result.error.issues.map((err) => ({
          field: err.path.slice(1).join("."),
          message: err.message
        }))
      });
      return;
    }
    req.body = result.data.body;
    next();
  };
};

// src/app/module/auth/auth.schema.ts
import { z } from "zod";
var registerOrgOwnerSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }).trim().min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters" }),
    organizationName: z.string({ error: "Organization name is required" }).trim().min(1, { error: "Organization name cannot be empty" }),
    organizationSlug: z.string({ error: "Organization slug is required" }).trim().min(1, { error: "Organization slug cannot be empty" }).regex(/^[a-z0-9-]+$/, {
      error: "Slug can only contain lowercase letters, numbers, and hyphens"
    })
  })
});
var registerMemberSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }).trim().min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters" }),
    organizationId: z.string({ error: "Organization ID is required" }).trim().min(1, { error: "Organization ID cannot be empty" })
  })
});
var loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(1, { error: "Password is required" })
  })
});
var authValidation = {
  registerOrgOwnerSchema,
  registerMemberSchema,
  loginSchema
};

// src/app/middleware/auth.ts
var auth = (...requiredRoles) => {
  return catch_async_default(async (req, res, next) => {
    const accessToken = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!accessToken) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifyAccessToken = jwtUtils.verifyToken(
      accessToken,
      config_default.jwt_access_secret
    );
    if (!verifyAccessToken.success) {
      throw new Error(verifyAccessToken.error);
    }
    const { id, email, name } = verifyAccessToken.data;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
    if (!user || user.deletedAt) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.status !== "ACTIVE") {
      throw new Error(
        "Your account has been suspended or inactive. Please contact support."
      );
    }
    const membership = user.memberships[0];
    if (!membership) {
      throw new Error("User does not belong to any organization.");
    }
    const userRole = membership.role;
    const organizationId = membership.organizationId;
    if (requiredRoles.length && !requiredRoles.includes(userRole)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    req.user = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: userRole,
      organizationId
    };
    next();
  });
};
var authMiddleware = { auth };

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register-owner",
  validate(authValidation.registerOrgOwnerSchema),
  authController.registerOrgOwner
);
router.post(
  "/register-member",
  validate(authValidation.registerMemberSchema),
  authController.registerMember
);
router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login
);
router.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.getMe
);
router.post(
  "/refresh-token",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.refreshToken
);
var authRoutes = router;

// src/app/module/team/team.route.ts
import { Router as Router2 } from "express";

// src/app/module/team/team.service.ts
var createTeam = async (organizationId, payload) => {
  const existingTeam = await prisma.team.findFirst({
    where: {
      organizationId,
      name: payload.name
    }
  });
  if (existingTeam && !existingTeam.deletedAt) {
    throw new Error(
      "A team with this name already exists in the organization."
    );
  }
  if (existingTeam && existingTeam.deletedAt) {
    const updatedTeam = await prisma.team.update({
      where: { id: existingTeam.id },
      data: {
        deletedAt: null,
        description: payload.description || existingTeam.description
      }
    });
    return updatedTeam;
  } else if (!existingTeam) {
    const team = await prisma.team.create({
      data: {
        name: payload.name,
        description: payload.description,
        organizationId
      }
    });
    return team;
  }
};
var getAllTeams = async (organizationId) => {
  const teams = await prisma.team.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    include: {
      teamMembers: true
    }
  });
  return teams;
};
var getTeamById = async (organizationId, teamId) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    },
    //complex include to fetch related projects and team members
    include: {
      projects: {
        include: {
          project: true
        }
      },
      teamMembers: true
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  return team;
};
var updateTeam = async (organizationId, teamId, payload) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: payload
  });
  return updatedTeam;
};
var deleteTeam = async (organizationId, teamId) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return updatedTeam;
};
var teamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};

// src/app/module/team/team.controller.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var createTeam2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await teamService.createTeam(organizationId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.CREATED,
      message: "Team created successfully",
      data: result
    });
  }
);
var getAllTeams2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await teamService.getAllTeams(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Teams retrieved successfully",
      data: result
    });
  }
);
var getTeamById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!teamId) {
      throw new Error("Team ID is required to retrieve a team.");
    }
    const result = await teamService.getTeamById(
      organizationId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team retrieved successfully",
      data: result
    });
  }
);
var updateTeam2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await teamService.updateTeam(
      organizationId,
      teamId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team updated successfully",
      data: result
    });
  }
);
var deleteTeam2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!teamId) {
      throw new Error("Team ID is required to delete a team.");
    }
    const result = await teamService.deleteTeam(
      organizationId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team deleted successfully",
      data: result
    });
  }
);
var teamController = {
  createTeam: createTeam2,
  getAllTeams: getAllTeams2,
  getTeamById: getTeamById2,
  updateTeam: updateTeam2,
  deleteTeam: deleteTeam2
};

// src/app/module/team/team.schema.ts
import { z as z2 } from "zod";
var createTeamSchema = z2.object({
  body: z2.object({
    name: z2.string({ error: "Team name is required" }).trim().min(1, { error: "Team name cannot be empty" }),
    description: z2.string().optional()
  })
});
var updateTeamSchema = z2.object({
  body: z2.object({
    name: z2.string().trim().min(1, { error: "Team name cannot be empty" }).optional(),
    description: z2.string().optional()
  }).refine((body) => Object.keys(body).length > 0, {
    error: "At least one team field is required to update"
  })
});
var teamValidation = {
  createTeamSchema,
  updateTeamSchema
};

// src/app/module/team/team.route.ts
var router2 = Router2();
router2.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.createTeamSchema),
  teamController.createTeam
);
router2.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getAllTeams
);
router2.get(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getTeamById
);
router2.patch(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.updateTeamSchema),
  teamController.updateTeam
);
router2.delete(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  teamController.deleteTeam
);
var teamRoutes = router2;

// src/app/module/project/project.route.ts
import { Router as Router3 } from "express";

// src/app/module/project/project.service.ts
var createProject = async (organizationId, payload) => {
  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      organizationId
    }
  });
  return project;
};
var getAllProjects = async (organizationId) => {
  const projects = await prisma.project.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    include: {
      teams: true,
      tasks: true
    }
  });
  return projects;
};
var getProjectById = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    },
    include: {
      teams: true,
      tasks: true
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
var updateProject = async (organizationId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: payload
  });
  return updatedProject;
};
var deleteProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return updatedProject;
};
var assignTeamToProject = async (organizationId, projectId, teamId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) throw new Error("Project not found");
  const team = await prisma.team.findFirst({
    where: { id: teamId, organizationId, deletedAt: null }
  });
  if (!team) throw new Error("Team not found");
  const existingAssignment = await prisma.projectTeam.findFirst({
    where: { projectId, teamId }
  });
  if (existingAssignment) {
    throw new Error("Team is already assigned to this project");
  }
  const assignment = await prisma.projectTeam.create({
    data: {
      projectId,
      teamId
    }
  });
  return assignment;
};
var removeTeamFromProject = async (organizationId, projectId, teamId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) throw new Error("Project not found");
  const deletedAssignment = await prisma.projectTeam.delete({
    where: {
      projectId_teamId: {
        projectId,
        teamId
      }
    }
  });
  return deletedAssignment;
};
var projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject
};

// src/app/module/project/project.controller.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";
var createProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.createProject(organizationId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.CREATED,
      message: "Project created successfully",
      data: result
    });
  }
);
var getAllProjects2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getAllProjects(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Projects retrieved successfully",
      data: result
    });
  }
);
var getProjectById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getProjectById(
      organizationId,
      projectId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project retrieved successfully",
      data: result
    });
  }
);
var updateProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.updateProject(
      organizationId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project updated successfully",
      data: result
    });
  }
);
var deleteProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.deleteProject(
      organizationId,
      projectId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project deleted successfully",
      data: result
    });
  }
);
var assignTeamToProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    const { teamId } = req.body;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.assignTeamToProject(
      organizationId,
      projectId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.CREATED,
      message: "Team assigned to project successfully",
      data: result
    });
  }
);
var removeTeamFromProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId, teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.removeTeamFromProject(
      organizationId,
      projectId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Team removed from project successfully",
      data: result
    });
  }
);
var projectController = {
  createProject: createProject2,
  getAllProjects: getAllProjects2,
  getProjectById: getProjectById2,
  updateProject: updateProject2,
  deleteProject: deleteProject2,
  assignTeamToProject: assignTeamToProject2,
  removeTeamFromProject: removeTeamFromProject2
};

// src/app/module/project/project.schema.ts
import { z as z3 } from "zod";
var createProjectSchema = z3.object({
  body: z3.object({
    name: z3.string({ error: "Project name is required" }).trim().min(1, { error: "Project name cannot be empty" }),
    description: z3.string().optional()
  })
});
var updateProjectSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, { error: "Project name cannot be empty" }).optional(),
    description: z3.string().optional(),
    status: z3.string().optional()
  })
});
var assignTeamSchema = z3.object({
  body: z3.object({
    teamId: z3.string({ error: "Team ID is required" }).trim().min(1, { error: "Team ID cannot be empty" })
  })
});
var projectValidation = {
  createProjectSchema,
  updateProjectSchema,
  assignTeamSchema
};

// src/app/module/project/project.route.ts
var router3 = Router3();
router3.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.createProjectSchema),
  projectController.createProject
);
router3.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getAllProjects
);
router3.get(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getProjectById
);
router3.patch(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject
);
router3.delete(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.deleteProject
);
router3.post(
  "/:projectId/teams",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.assignTeamSchema),
  projectController.assignTeamToProject
);
router3.delete(
  "/:projectId/teams/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.removeTeamFromProject
);
var projectRoutes = router3;

// src/app/module/task/task.route.ts
import { Router as Router4 } from "express";

// src/app/module/task/task.service.ts
var createTask = async (organizationId, userId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (payload.status && !["TODO", "IN_PROGRESS", "DONE"].includes(payload.status)) {
    throw new Error("Invalid status value");
  }
  if (payload.priority && !["LOW", "MEDIUM", "HIGH"].includes(payload.priority)) {
    throw new Error("Invalid priority value");
  }
  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || "TODO",
      priority: payload.priority || "MEDIUM",
      assigneeId: payload.assigneeId,
      creatorId: userId,
      projectId
    }
  });
  return task;
};
var getTasksByProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      deletedAt: null
    }
  });
  return tasks;
};
var getTaskById = async (organizationId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    },
    include: {
      project: true
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};
var updateTask = async (organizationId, taskId, payload, userId, role) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: {
        organizationId,
        deletedAt: null
      }
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN && task.assigneeId !== userId) {
    throw new Error("You are not authorized to update this task");
  }
  console.log("role", role);
  if (payload.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN) {
    throw new Error("You are not authorized to assign this task");
  }
  const updateData = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData
  });
  return updatedTask;
};
var deleteTask = async (organizationId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const deletedTask = await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedTask;
};
var taskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
};

// src/app/module/task/task.controller.ts
import { StatusCodes as StatusCodes5 } from "http-status-codes";
var createTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!userId) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await taskService.createTask(
      organizationId,
      userId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.CREATED,
      message: "Task created successfully",
      data: result
    });
  }
);
var getTasksByProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await taskService.getTasksByProject(organizationId, projectId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Tasks retrieved successfully",
      data: result
    });
  }
);
var getTaskById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.getTaskById(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task retrieved successfully",
      data: result
    });
  }
);
var updateTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    const user = req.user;
    const userId = user?.id;
    const role = user?.role;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.updateTask(organizationId, taskId, req.body, userId, role);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task updated successfully",
      data: result
    });
  }
);
var deleteTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.deleteTask(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task deleted successfully",
      data: result
    });
  }
);
var taskController = {
  createTask: createTask2,
  getTasksByProject: getTasksByProject2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  deleteTask: deleteTask2
};

// src/app/module/task/task.schema.ts
import { z as z4 } from "zod";
var createTaskSchema = z4.object({
  body: z4.object({
    title: z4.string({ error: "Task title is required" }).trim().min(1, { error: "Task title cannot be empty" }),
    description: z4.string().optional(),
    status: z4.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z4.enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW, TaskPriority.URGENT]).optional(),
    dueDate: z4.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z4.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z4.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z4.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var updateTaskSchema = z4.object({
  body: z4.object({
    title: z4.string().trim().min(1, { error: "Task title cannot be empty" }).optional(),
    description: z4.string().optional(),
    status: z4.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z4.enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW, TaskPriority.URGENT]).optional(),
    dueDate: z4.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z4.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z4.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z4.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var taskValidation = {
  createTaskSchema,
  updateTaskSchema
};

// src/app/module/task/task.route.ts
var router4 = Router4();
router4.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.createTaskSchema),
  taskController.createTask
);
router4.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTasksByProject
);
router4.get(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTaskById
);
router4.patch(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.updateTaskSchema),
  taskController.updateTask
);
router4.delete(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  taskController.deleteTask
);
var taskRoutes = router4;

// src/app/module/sprint/spring.route.ts
import { Router as Router5 } from "express";

// src/app/module/sprint/sprint.service.ts
var createSprint = async (organizationId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprint = await prisma.sprint.create({
    data: {
      name: payload.name,
      goal: payload.goal,
      status: payload.status || "PLANNING",
      startDate: payload.startDate ? new Date(payload.startDate) : void 0,
      endDate: payload.endDate ? new Date(payload.endDate) : void 0,
      projectId
    }
  });
  return sprint;
};
var getSprintsByProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprints = await prisma.sprint.findMany({
    where: {
      projectId,
      deletedAt: null
    },
    include: {
      tasks: true
    }
  });
  return sprints;
};
var getSprintById = async (organizationId, sprintId) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    },
    include: {
      project: true,
      tasks: true
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  return sprint;
};
var updateSprint = async (organizationId, sprintId, payload) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const updateData = { ...payload };
  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }
  const updatedSprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: updateData
  });
  return updatedSprint;
};
var deleteSprint = async (organizationId, sprintId) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const deletedSprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedSprint;
};
var sprintService = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint
};

// src/app/module/sprint/sprint.controller.ts
import { StatusCodes as StatusCodes6 } from "http-status-codes";
var createSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await sprintService.createSprint(
      organizationId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.CREATED,
      message: "Sprint created successfully",
      data: result
    });
  }
);
var getSprintsByProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await sprintService.getSprintsByProject(organizationId, projectId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprints retrieved successfully",
      data: result
    });
  }
);
var getSprintById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.getSprintById(organizationId, sprintId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint retrieved successfully",
      data: result
    });
  }
);
var updateSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.updateSprint(organizationId, sprintId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint updated successfully",
      data: result
    });
  }
);
var deleteSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.deleteSprint(organizationId, sprintId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint deleted successfully",
      data: result
    });
  }
);
var sprintController = {
  createSprint: createSprint2,
  getSprintsByProject: getSprintsByProject2,
  getSprintById: getSprintById2,
  updateSprint: updateSprint2,
  deleteSprint: deleteSprint2
};

// src/app/module/sprint/sprint.schema.ts
import { z as z5 } from "zod";
var createSprintSchema = z5.object({
  body: z5.object({
    name: z5.string({ error: "Sprint name is required" }).trim().min(1, { error: "Sprint name cannot be empty" }),
    goal: z5.string().optional(),
    status: z5.enum([SprintStatus.ACTIVE, SprintStatus.COMPLETED, SprintStatus.PLANNING]).optional(),
    startDate: z5.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z5.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var updateSprintSchema = z5.object({
  body: z5.object({
    name: z5.string().trim().min(1, { error: "Sprint name cannot be empty" }).optional(),
    goal: z5.string().optional(),
    status: z5.enum([SprintStatus.ACTIVE, SprintStatus.COMPLETED, SprintStatus.PLANNING]).optional(),
    startDate: z5.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z5.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var sprintValidation = {
  createSprintSchema,
  updateSprintSchema
};

// src/app/module/sprint/spring.route.ts
var router5 = Router5();
router5.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.createSprintSchema),
  sprintController.createSprint
);
router5.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintsByProject
);
router5.get(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintById
);
router5.patch(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.updateSprintSchema),
  sprintController.updateSprint
);
router5.delete(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN),
  sprintController.deleteSprint
);
var sprintRoutes = router5;

// src/app.ts
var app = express();
var corsOptions = {
  origin: `${config_default.frontend_url}`,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use(not_found_default);
app.use(global_error_default);
var app_default = app;

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    app_default.listen(port, () => {
      if (config_default.node_env !== "development") {
        console.log("Server is running on port " + port);
      }
    });
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map