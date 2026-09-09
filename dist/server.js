
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

  @@map("tasks")
}

model Team {
  id             String   @id @default(uuid())
  organizationId String   @map("organization_id")
  name           String
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  teamMembers  TeamMembership[]
  projects     ProjectTeam[] // Links team to the junction table

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
config.runtimeDataModel = JSON.parse('{"models":{"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","teams","project","parentTask","subTasks","creator","assignee","_count","tasks","team","projects","user","teamMemberships","createdTasks","assignedTasks","subscriptions","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","data","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","create","update","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","having","_min","_max","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","_avg","_sum","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","passwordHash","fullName","UserStatus","status","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","description","TaskStatus","TaskPriority","priority","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","planName","expiresAt","assignedAt","Role","role","OrganizationMembershipStatus","slug","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "mgVQkAENBAAAmQIAIAYAAL0CACAPAAC-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_AgAgsAEBAN0CACG1AQAA8ALTASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACHLAQEA3QIAIcwBAQDvAgAhzQEBAO8CACHOAQEA7wIAIc8BAQDvAgAh0AEBAN0CACHRAQEA7wIAIdQBAADxAtQBIgIAAAAUACAaAACyAQAgDbABAQDdAgAhtQEAAPAC0wEitgFAAN8CACG3AUAA4AIAIbgBQADgAgAhywEBAN0CACHMAQEA7wIAIc0BAQDvAgAhzgEBAO8CACHPAQEA7wIAIdABAQDdAgAh0QEBAO8CACHUAQAA8QLUASICAAAAEgAgGgAAtAEAIAIAAAASACAaAAC0AQAgAQAAABIAIAEAAAAYACABAAAAGAAgAwAAABQAICEAAKoBACAiAACyAQAgAQAAABQAIAEAAAASACAJDAAA2gMAICcAANwDACAoAADbAwAgtgEAANkCACDMAQAA2QIAIM0BAADZAgAgzgEAANkCACDPAQAA2QIAINEBAADZAgAgEK0BAACeAgAwrgEAAL4BABCvAQAAngIAMLABAQCGAgAhtQEAAKAC0wEitgFAAIgCACG3AUAAiQIAIbgBQACJAgAhywEBAIYCACHMAQEAnwIAIc0BAQCfAgAhzgEBAJ8CACHPAQEAnwIAIdABAQCGAgAh0QEBAJ8CACHUAQAAoQLUASIDAAAAEgAgAQAAvQEAMCYAAL4BACADAAAAEgAgAQAAEwAwAgAAFAAgAQAAACgAIAEAAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACAIAwAA1wMAIAUAANgDACAPAADZAwAgsAEBAAAAAbcBQAAAAAG4AUAAAAAByQEBAAAAAcoBAQAAAAEBGgAAxgEAIAWwAQEAAAABtwFAAAAAAbgBQAAAAAHJAQEAAAABygEBAAAAAQEaAADIAQAwARoAAMgBADAIAwAAvQMAIAUAAL4DACAPAAC_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_AUAAAAABwAFAAI0CACELDAAAiwIAICcAAIwCACAoAACMAgAguQFAAAAAAboBQAAAAAS7AUAAAAAEvAFAAAAAAb0BQAAAAAG-AUAAAAABvwFAAAAAAcABQACKAgAhCwwAAIsCACAnAACMAgAgKAAAjAIAILkBQAAAAAG6AUAAAAAEuwFAAAAABLwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQAAAAAHAAUAAigIAIQi5AQIAAAABugECAAAABLsBAgAAAAS8AQIAAAABvQECAAAAAb4BAgAAAAG_AQIAAAABwAECAIsCACEIuQFAAAAAAboBQAAAAAS7AUAAAAAEvAFAAAAAAb0BQAAAAAG-AUAAAAABvwFAAAAAAcABQACMAgAhCwwAAI4CACAnAACPAgAgKAAAjwIAILkBQAAAAAG6AUAAAAAFuwFAAAAABbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQAAAAAHAAUAAjQIAIQi5AQIAAAABugECAAAABbsBAgAAAAW8AQIAAAABvQECAAAAAb4BAgAAAAG_AQIAAAABwAECAI4CACEIuQFAAAAAAboBQAAAAAW7AUAAAAAFvAFAAAAAAb0BQAAAAAG-AUAAAAABvwFAAAAAAcABQACPAgAhBwwAAIsCACAnAACRAgAgKAAAkQIAILkBAAAAtQECugEAAAC1AQi7AQAAALUBCMABAACQArUBIgS5AQAAALUBAroBAAAAtQEIuwEAAAC1AQjAAQAAkQK1ASIODAAAiwIAICcAAJMCACAoAACTAgAguQEBAAAAAboBAQAAAAS7AQEAAAAEvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQCSAgAhwQEBAAAAAcIBAQAAAAHDAQEAAAABC7kBAQAAAAG6AQEAAAAEuwEBAAAABLwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAkwIAIcEBAQAAAAHCAQEAAAABwwEBAAAAAQ8EAACZAgAgEQAAmgIAIBIAAJsCACATAACbAgAgrQEAAJQCADCuAQAAGAAQrwEAAJQCADCwAQEAlQIAIbEBAQCVAgAhsgEBAJUCACGzAQEAlQIAIbUBAACWArUBIrYBQACXAgAhtwFAAJgCACG4AUAAmAIAIQu5AQEAAAABugEBAAAABLsBAQAAAAS8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAJMCACHBAQEAAAABwgEBAAAAAcMBAQAAAAEEuQEAAAC1AQK6AQAAALUBCLsBAAAAtQEIwAEAAJECtQEiCLkBQAAAAAG6AUAAAAAFuwFAAAAABbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQAAAAAHAAUAAjwIAIQi5AUAAAAABugFAAAAABLsBQAAAAAS8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAAAABwAFAAIwCACEDxAEAAAMAIMUBAAADACDGAQAAAwAgA8QBAAAIACDFAQAACAAgxgEAAAgAIAPEAQAAEgAgxQEAABIAIMYBAAASACAHrQEAAJwCADCuAQAA6gEAEK8BAACcAgAwtwFAAIkCACG4AUAAiQIAIccBAQCGAgAhyAEBAIYCACEIrQEAAJ0CADCuAQAA1AEAEK8BAACdAgAwsAEBAIYCACG3AUAAiQIAIbgBQACJAgAhyQEBAIYCACHKAQEAhgIAIRCtAQAAngIAMK4BAAC-AQAQrwEAAJ4CADCwAQEAhgIAIbUBAACgAtMBIrYBQACIAgAhtwFAAIkCACG4AUAAiQIAIcsBAQCGAgAhzAEBAJ8CACHNAQEAnwIAIc4BAQCfAgAhzwEBAJ8CACHQAQEAhgIAIdEBAQCfAgAh1AEAAKEC1AEiDgwAAI4CACAnAACnAgAgKAAApwIAILkBAQAAAAG6AQEAAAAFuwEBAAAABbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEApgIAIcEBAQAAAAHCAQEAAAABwwEBAAAAAQcMAACLAgAgJwAApQIAICgAAKUCACC5AQAAANMBAroBAAAA0wEIuwEAAADTAQjAAQAApALTASIHDAAAiwIAICcAAKMCACAoAACjAgAguQEAAADUAQK6AQAAANQBCLsBAAAA1AEIwAEAAKIC1AEiBwwAAIsCACAnAACjAgAgKAAAowIAILkBAAAA1AECugEAAADUAQi7AQAAANQBCMABAACiAtQBIgS5AQAAANQBAroBAAAA1AEIuwEAAADUAQjAAQAAowLUASIHDAAAiwIAICcAAKUCACAoAAClAgAguQEAAADTAQK6AQAAANMBCLsBAAAA0wEIwAEAAKQC0wEiBLkBAAAA0wECugEAAADTAQi7AQAAANMBCMABAAClAtMBIg4MAACOAgAgJwAApwIAICgAAKcCACC5AQEAAAABugEBAAAABbsBAQAAAAW8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAKYCACHBAQEAAAABwgEBAAAAAcMBAQAAAAELuQEBAAAAAboBAQAAAAW7AQEAAAAFvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQCnAgAhwQEBAAAAAcIBAQAAAAHDAQEAAAABDq0BAACoAgAwrgEAAKIBABCvAQAAqAIAMLABAQCGAgAhtQEAAKsC2wEitwFAAIkCACG4AUAAiQIAIckBAQCGAgAh1gEAAKkC1gEi1wEBAIYCACHYARAAqgIAIdkBAQCGAgAh2wEBAIYCACHcAUAAiAIAIQcMAACLAgAgJwAAsQIAICgAALECACC5AQAAANYBAroBAAAA1gEIuwEAAADWAQjAAQAAsALWASINDAAAiwIAICcAAK8CACAoAACvAgAgaQAArwIAIGoAAK8CACC5ARAAAAABugEQAAAABLsBEAAAAAS8ARAAAAABvQEQAAAAAb4BEAAAAAG_ARAAAAABwAEQAK4CACEHDAAAiwIAICcAAK0CACAoAACtAgAguQEAAADbAQK6AQAAANsBCLsBAAAA2wEIwAEAAKwC2wEiBwwAAIsCACAnAACtAgAgKAAArQIAILkBAAAA2wECugEAAADbAQi7AQAAANsBCMABAACsAtsBIgS5AQAAANsBAroBAAAA2wEIuwEAAADbAQjAAQAArQLbASINDAAAiwIAICcAAK8CACAoAACvAgAgaQAArwIAIGoAAK8CACC5ARAAAAABugEQAAAABLsBEAAAAAS8ARAAAAABvQEQAAAAAb4BEAAAAAG_ARAAAAABwAEQAK4CACEIuQEQAAAAAboBEAAAAAS7ARAAAAAEvAEQAAAAAb0BEAAAAAG-ARAAAAABvwEQAAAAAcABEACvAgAhBwwAAIsCACAnAACxAgAgKAAAsQIAILkBAAAA1gECugEAAADWAQi7AQAAANYBCMABAACwAtYBIgS5AQAAANYBAroBAAAA1gEIuwEAAADWAQjAAQAAsQLWASIGrQEAALICADCuAQAAjAEAEK8BAACyAgAwxwEBAIYCACHLAQEAhgIAId0BQACJAgAhC60BAACzAgAwrgEAAHYAEK8BAACzAgAwsAEBAIYCACG1AQEAhgIAIbYBQACIAgAhtwFAAIkCACG4AUAAiQIAIckBAQCGAgAhygEBAIYCACHRAQEAnwIAIQqtAQAAtAIAMK4BAABgABCvAQAAtAIAMLABAQCGAgAhtQEAALYC4QEitwFAAIkCACG4AUAAiQIAIcgBAQCGAgAhyQEBAIYCACHfAQAAtQLfASIHDAAAiwIAICcAALoCACAoAAC6AgAguQEAAADfAQK6AQAAAN8BCLsBAAAA3wEIwAEAALkC3wEiBwwAAIsCACAnAAC4AgAgKAAAuAIAILkBAAAA4QECugEAAADhAQi7AQAAAOEBCMABAAC3AuEBIgcMAACLAgAgJwAAuAIAICgAALgCACC5AQAAAOEBAroBAAAA4QEIuwEAAADhAQjAAQAAtwLhASIEuQEAAADhAQK6AQAAAOEBCLsBAAAA4QEIwAEAALgC4QEiBwwAAIsCACAnAAC6AgAgKAAAugIAILkBAAAA3wECugEAAADfAQi7AQAAAN8BCMABAAC5At8BIgS5AQAAAN8BAroBAAAA3wEIuwEAAADfAQjAAQAAugLfASIJrQEAALsCADCuAQAASgAQrwEAALsCADCwAQEAhgIAIbYBQACIAgAhtwFAAIkCACG4AUAAiQIAIcoBAQCGAgAh4QEBAIYCACENBAAAmQIAIAYAAL0CACAPAAC-AgAgFAAAvwIAIK0BAAC8AgAwrgEAADcAEK8BAAC8AgAwsAEBAJUCACG2AUAAlwIAIbcBQACYAgAhuAFAAJgCACHKAQEAlQIAIeEBAQCVAgAhA8QBAAAmACDFAQAAJgAgxgEAACYAIAPEAQAAKgAgxQEAACoAIMYBAAAqACADxAEAAC4AIMUBAAAuACDGAQAALgAgDwMAAMQCACCtAQAAwAIAMK4BAAAuABCvAQAAwAIAMLABAQCVAgAhtQEAAMMC2wEitwFAAJgCACG4AUAAmAIAIckBAQCVAgAh1gEAAMEC1gEi1wEBAJUCACHYARAAwgIAIdkBAQCVAgAh2wEBAJUCACHcAUAAlwIAIQS5AQAAANYBAroBAAAA1gEIuwEAAADWAQjAAQAAsQLWASIIuQEQAAAAAboBEAAAAAS7ARAAAAAEvAEQAAAAAb0BEAAAAAG-ARAAAAABvwEQAAAAAcABEACvAgAhBLkBAAAA2wECugEAAADbAQi7AQAAANsBCMABAACtAtsBIg8EAACZAgAgBgAAvQIAIA8AAL4CACAUAAC_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_gIAIAEaAACQBQAwAgAAABQAIBoAAP4CACACAAAA7QIAIBoAAP0CACAMsAEBAN0CACG1AQAA8ALTASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACHLAQEA3QIAIcwBAQDvAgAhzgEBAO8CACHPAQEA7wIAIdABAQDdAgAh0QEBAO8CACHUAQAA8QLUASIQBwAA8wIAIAkAAPUCACAKAAD2AgAgCwAA_wIAILABAQDdAgAhtQEAAPAC0wEitgFAAN8CACG3AUAA4AIAIbgBQADgAgAhywEBAN0CACHMAQEA7wIAIc4BAQDvAgAhzwEBAO8CACHQAQEA3QIAIdEBAQDvAgAh1AEAAPEC1AEiByEAAIcFACAiAACOBQAg5wEAAIgFACDoAQAAjQUAIOsBAAAYACDsAQAAGAAg7QEAAO0BACAQBwAAgQMAIAkAAIIDACAKAACDAwAgCwAAhAMAILABAQAAAAG1AQAAANMBArYBQAAAAAG3AUAAAAABuAFAAAAAAcsBAQAAAAHMAQEAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdQBAAAA1AECAyEAAIsFACDnAQAAjAUAIO0BAAAsACAEIQAA9wIAMOcBAAD4AgAw6QEAAPoCACDtAQAA6QIAMAMhAACJBQAg5wEAAIoFACDtAQAA7QEAIAMhAACHBQAg5wEAAIgFACDtAQAA7QEAIBAHAACBAwAgCAAAhgMAIAkAAIIDACAKAACDAwAgsAEBAAAAAbUBAAAA0wECtgFAAAAAAbcBQAAAAAG4AUAAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBAAAAAdABAQAAAAHRAQEAAAAB1AEAAADUAQIDIQAAhQUAIOcBAACGBQAg7QEAABQAIBAHAACBAwAgCAAAhgMAIAkAAIIDACALAACEAwAgsAEBAAAAAbUBAAAA0wECtgFAAAAAAbcBQAAAAAG4AUAAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB1AEAAADUAQICAAAAFAAgIQAAjwMAIAMAAAAUACAhAACPAwAgIgAAjgMAIAEaAACEBQAwAgAAABQAIBoAAI4DACACAAAA7QIAIBoAAI0DACAMsAEBAN0CACG1AQAA8ALTASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACHLAQEA3QIAIcwBAQDvAgAhzQEBAO8CACHPAQEA7wIAIdABAQDdAgAh0QEBAO8CACHUAQAA8QLUASIQBwAA8wIAIAgAAPQCACAJAAD1AgAgCwAA_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_wMAMOcBAAD8AwAw6AEAAP0DADDpAQAA_gMAIOoBAADEAwAw6wEAAMQDADDsAQAAxAMAMO0BAADEAwAw7gEAAIAEADDvAQAAxwMAMAshAADyAwAwIgAA9gMAMOcBAADzAwAw6AEAAPQDADDpAQAA9QMAIOoBAADpAgAw6wEAAOkCADDsAQAA6QIAMO0BAADpAgAw7gEAAPcDADDvAQAA7AIAMBAIAACGAwAgCQAAggMAIAoAAIMDACALAACEAwAgsAEBAAAAAbUBAAAA0wECtgFAAAAAAbcBQAAAAAG4AUAAAAABzAEBAAAAAc0BAQAAAAHOAQEAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB1AEAAADUAQICAAAAFAAgIQAA-gMAIAMAAAAUACAhAAD6AwAgIgAA-QMAIAEaAADZBAAwAgAAABQAIBoAAPkDACACAAAA7QIAIBoAAPgDACAMsAEBAN0CACG1AQAA8ALTASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACHMAQEA7wIAIc0BAQDvAgAhzgEBAO8CACHPAQEA7wIAIdABAQDdAgAh0QEBAO8CACHUAQAA8QLUASIQCAAA9AIAIAkAAPUCACAKAAD2AgAgCwAA_wIAILABAQDdAgAhtQEAAPAC0wEitgFAAN8CACG3AUAA4AIAIbgBQADgAgAhzAEBAO8CACHNAQEA7wIAIc4BAQDvAgAhzwEBAO8CACHQAQEA3QIAIdEBAQDvAgAh1AEAAPEC1AEiEAgAAIYDACAJAACCAwAgCgAAgwMAIAsAAIQDACCwAQEAAAABtQEAAADTAQK2AUAAAAABtwFAAAAAAbgBQAAAAAHMAQEAAAABzQEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHUAQAAANQBAgMOAADrAwAgxwEBAAAAAd0BQAAAAAECAAAADwAgIQAAgwQAIAMAAAAPACAhAACDBAAgIgAAggQAIAEaAADYBAAwAgAAAA8AIBoAAIIEACACAAAAyAMAIBoAAIEEACACxwEBAN0CACHdAUAA4AIAIQMOAADqAwAgxwEBAN0CACHdAUAA4AIAIQMOAADrAwAgxwEBAAAAAd0BQAAAAAEDIQAA1gQAIOcBAADXBAAg7QEAAAEAIAQhAAD7AwAw5wEAAPwDADDpAQAA_gMAIO0BAADEAwAwBCEAAPIDADDnAQAA8wMAMOkBAAD1AwAg7QEAAOkCADAAAAAFIQAA0QQAICIAANQEACDnAQAA0gQAIOgBAADTBAAg7QEAAO0BACADIQAA0QQAIOcBAADSBAAg7QEAAO0BACAAAAALIQAAtwQAMCIAALsEADDnAQAAuAQAMOgBAAC5BAAw6QEAALoEACDqAQAAogMAMOsBAACiAwAw7AEAAKIDADDtAQAAogMAMO4BAAC8BAAw7wEAAKUDADALIQAAqwQAMCIAALAEADDnAQAArAQAMOgBAACtBAAw6QEAAK4EACDqAQAArwQAMOsBAACvBAAw7AEAAK8EADDtAQAArwQAMO4BAACxBAAw7wEAALIEADALIQAAnwQAMCIAAKQEADDnAQAAoAQAMOgBAAChBAAw6QEAAKIEACDqAQAAowQAMOsBAACjBAAw7AEAAKMEADDtAQAAowQAMO4BAAClBAAw7wEAAKYEADALIQAAkwQAMCIAAJgEADDnAQAAlAQAMOgBAACVBAAw6QEAAJYEACDqAQAAlwQAMOsBAACXBAAw7AEAAJcEADDtAQAAlwQAMO4BAACZBAAw7wEAAJoEADAKsAEBAAAAAbUBAAAA2wECtwFAAAAAAbgBQAAAAAHWAQAAANYBAtcBAQAAAAHYARAAAAAB2QEBAAAAAdsBAQAAAAHcAUAAAAABAgAAADAAICEAAJ4EACADAAAAMAAgIQAAngQAICIAAJ0EACABGgAA0AQAMA8DAADEAgAgrQEAAMACADCuAQAALgAQrwEAAMACADCwAQEAAAABtQEAAMMC2wEitwFAAJgCACG4AUAAmAIAIckBAQCVAgAh1gEAAMEC1gEi1wEBAAAAAdgBEADCAgAh2QEBAJUCACHbAQEAlQIAIdwBQACXAgAhAgAAADAAIBoAAJ0EACACAAAAmwQAIBoAAJwEACAOrQEAAJoEADCuAQAAmwQAEK8BAACaBAAwsAEBAJUCACG1AQAAwwLbASK3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHWAQAAwQLWASLXAQEAlQIAIdgBEADCAgAh2QEBAJUCACHbAQEAlQIAIdwBQACXAgAhDq0BAACaBAAwrgEAAJsEABCvAQAAmgQAMLABAQCVAgAhtQEAAMMC2wEitwFAAJgCACG4AUAAmAIAIckBAQCVAgAh1gEAAMEC1gEi1wEBAJUCACHYARAAwgIAIdkBAQCVAgAh2wEBAJUCACHcAUAAlwIAIQqwAQEA3QIAIbUBAADkA9sBIrcBQADgAgAhuAFAAOACACHWAQAA4gPWASLXAQEA3QIAIdgBEADjAwAh2QEBAN0CACHbAQEA3QIAIdwBQADfAgAhCrABAQDdAgAhtQEAAOQD2wEitwFAAOACACG4AUAA4AIAIdYBAADiA9YBItcBAQDdAgAh2AEQAOMDACHZAQEA3QIAIdsBAQDdAgAh3AFAAN8CACEKsAEBAAAAAbUBAAAA2wECtwFAAAAAAbgBQAAAAAHWAQAAANYBAtcBAQAAAAHYARAAAAAB2QEBAAAAAdsBAQAAAAHcAUAAAAABCQYAAIUEACANAACGBAAgsAEBAAAAAbUBAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAAB0QEBAAAAAQIAAAAsACAhAACqBAAgAwAAACwAICEAAKoEACAiAACpBAAgARoAAM8EADAOAwAAxAIAIAYAAMcCACANAACbAgAgrQEAAMUCADCuAQAAKgAQrwEAAMUCADCwAQEAAAABtQEBAJUCACG2AUAAlwIAIbcBQACYAgAhuAFAAJgCACHJAQEAlQIAIcoBAQCVAgAh0QEBAMYCACECAAAALAAgGgAAqQQAIAIAAACnBAAgGgAAqAQAIAutAQAApgQAMK4BAACnBAAQrwEAAKYEADCwAQEAlQIAIbUBAQCVAgAhtgFAAJcCACG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIdEBAQDGAgAhC60BAACmBAAwrgEAAKcEABCvAQAApgQAMLABAQCVAgAhtQEBAJUCACG2AUAAlwIAIbcBQACYAgAhuAFAAJgCACHJAQEAlQIAIcoBAQCVAgAh0QEBAMYCACEHsAEBAN0CACG1AQEA3QIAIbYBQADfAgAhtwFAAOACACG4AUAA4AIAIcoBAQDdAgAh0QEBAO8CACEJBgAA8AMAIA0AAPEDACCwAQEA3QIAIbUBAQDdAgAhtgFAAN8CACG3AUAA4AIAIbgBQADgAgAhygEBAN0CACHRAQEA7wIAIQkGAACFBAAgDQAAhgQAILABAQAAAAG1AQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAdEBAQAAAAEGBQAA2AMAIA8AANkDACCwAQEAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAABAgAAACgAICEAALYEACADAAAAKAAgIQAAtgQAICIAALUEACABGgAAzgQAMAsDAADEAgAgBQAAmgIAIA8AAMcCACCtAQAAyAIAMK4BAAAmABCvAQAAyAIAMLABAQAAAAG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIQIAAAAoACAaAAC1BAAgAgAAALMEACAaAAC0BAAgCK0BAACyBAAwrgEAALMEABCvAQAAsgQAMLABAQCVAgAhtwFAAJgCACG4AUAAmAIAIckBAQCVAgAhygEBAJUCACEIrQEAALIEADCuAQAAswQAEK8BAACyBAAwsAEBAJUCACG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIQSwAQEA3QIAIbcBQADgAgAhuAFAAOACACHKAQEA3QIAIQYFAAC-AwAgDwAAvwMAILABAQDdAgAhtwFAAOACACG4AUAA4AIAIcoBAQDdAgAhBgUAANgDACAPAADZAwAgsAEBAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAQcQAACLBAAgsAEBAAAAAbUBAAAA4QECtwFAAAAAAbgBQAAAAAHIAQEAAAAB3wEAAADfAQICAAAABQAgIQAAvwQAIAMAAAAFACAhAAC_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_gQAIAMAAAAmACAhAAD-BAAgIgAAggUAIAkAAAAmACADAAC9AwAgDwAAvwMAIBoAAIIFACCwAQEA3QIAIbcBQADgAgAhuAFAAOACACHJAQEA3QIAIcoBAQDdAgAhBwMAAL0DACAPAAC_AwAgsAEBAN0CACG3AUAA4AIAIbgBQADgAgAhyQEBAN0CACHKAQEA3QIAIQO3AUAAAAABuAFAAAAAAccBAQAAAAEMsAEBAAAAAbUBAAAA0wECtgFAAAAAAbcBQAAAAAG4AUAAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB1AEAAADUAQIRBwAAgQMAIAgAAIYDACAKAACDAwAgCwAAhAMAILABAQAAAAG1AQAAANMBArYBQAAAAAG3AUAAAAABuAFAAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHUAQAAANQBAgIAAAAUACAhAACFBQAgCwQAAK4DACARAACvAwAgEgAAsAMAILABAQAAAAGxAQEAAAABsgEBAAAAAbMBAQAAAAG1AQAAALUBArYBQAAAAAG3AUAAAAABuAFAAAAAAQIAAADtAQAgIQAAhwUAIAsEAACuAwAgEQAArwMAIBMAALEDACCwAQEAAAABsQEBAAAAAbIBAQAAAAGzAQEAAAABtQEAAAC1AQK2AUAAAAABtwFAAAAAAbgBQAAAAAECAAAA7QEAICEAAIkFACAKAwAAhAQAIAYAAIUEACCwAQEAAAABtQEBAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAckBAQAAAAHKAQEAAAAB0QEBAAAAAQIAAAAsACAhAACLBQAgAwAAABgAICEAAIcFACAiAACPBQAgDQAAABgAIAQAAOECACARAADiAgAgEgAA4wIAIBoAAI8FACCwAQEA3QIAIbEBAQDdAgAhsgEBAN0CACGzAQEA3QIAIbUBAADeArUBIrYBQADfAgAhtwFAAOACACG4AUAA4AIAIQsEAADhAgAgEQAA4gIAIBIAAOMCACCwAQEA3QIAIbEBAQDdAgAhsgEBAN0CACGzAQEA3QIAIbUBAADeArUBIrYBQADfAgAhtwFAAOACACG4AUAA4AIAIQywAQEAAAABtQEAAADTAQK2AUAAAAABtwFAAAAAAbgBQAAAAAHLAQEAAAABzAEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHUAQAAANQBAgMAAAAYACAhAACJBQAgIgAAkwUAIA0AAAAYACAEAADhAgAgEQAA4gIAIBMAAOQCACAaAACTBQAgsAEBAN0CACGxAQEA3QIAIbIBAQDdAgAhswEBAN0CACG1AQAA3gK1ASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACELBAAA4QIAIBEAAOICACATAADkAgAgsAEBAN0CACGxAQEA3QIAIbIBAQDdAgAhswEBAN0CACG1AQAA3gK1ASK2AUAA3wIAIbcBQADgAgAhuAFAAOACACEDAAAAEgAgIQAAhQUAICIAAJYFACATAAAAEgAgBwAA8wIAIAgAAPQCACAKAAD2AgAgCwAA_wIAIBoAAJYFACCwAQEA3QIAIbUBAADwAtMBIrYBQADfAgAhtwFAAOACACG4AUAA4AIAIcsBAQDdAgAhzAEBAO8CACHNAQEA7wIAIc4BAQDvAgAhzwEBAO8CACHQAQEA3QIAIdEBAQDvAgAh1AEAAPEC1AEiEQcAAPMCACAIAAD0AgAgCgAA9gIAIAsAAP8CACCwAQEA3QIAIbUBAADwAtMBIrYBQADfAgAhtwFAAOACACG4AUAA4AIAIcsBAQDdAgAhzAEBAO8CACHNAQEA7wIAIc4BAQDvAgAhzwEBAO8CACHQAQEA3QIAIdEBAQDvAgAh1AEAAPEC1AEiAwAAACoAICEAAIsFACAiAACZBQAgDAAAACoAIAMAAO8DACAGAADwAwAgGgAAmQUAILABAQDdAgAhtQEBAN0CACG2AUAA3wIAIbcBQADgAgAhuAFAAOACACHJAQEA3QIAIcoBAQDdAgAh0QEBAO8CACEKAwAA7wMAIAYAAPADACCwAQEA3QIAIbUBAQDdAgAhtgFAAN8CACG3AUAA4AIAIbgBQADgAgAhyQEBAN0CACHKAQEA3QIAIdEBAQDvAgAhDLABAQAAAAG1AQAAANMBArYBQAAAAAG3AUAAAAABuAFAAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQAAAAHQAQEAAAAB0QEBAAAAAdQBAAAA1AECBQQGAgYpBQwADg8tBxQxDQIDAAEQAAMFBAcCDAAMEQsEEiAIEyEIAg4ABRAAAwQDAAEFDAQMAAsPEAYCBwAHDgAFBAMAAQYRBgwACg0VCAYHAAcIFggJFwgKGQMLGgMMAAkBCRsAAgYcAA0dAAIFHgAPHwAEBCIAESMAEiQAEyUAAQMAAQQEMgAGMwAPNAAUNQAAAAADDAATJwAUKAAVAAAAAwwAEycAFCgAFQIDAAEQAAMCAwABEAADAwwAGicAGygAHAAAAAMMABonABsoABwBAwABAQMAAQMMACEnACIoACMAAAADDAAhJwAiKAAjAgcABw4ABQIHAAcOAAUDDAAoJwApKAAqAAAAAwwAKCcAKSgAKgEDAAEBAwABBQwALycAMigAM2kAMGoAMQAAAAAABQwALycAMigAM2kAMGoAMQQHAAcIrwEICrABAwuxAQMEBwAHCLcBCAq4AQMLuQEDAwwAOCcAOSgAOgAAAAMMADgnADkoADoBAwABAQMAAQMMAD8nAEAoAEEAAAADDAA_JwBAKABBAg4ABRAAAwIOAAUQAAMDDABGJwBHKABIAAAAAwwARicARygASAAAAwwATScATigATwAAAAMMAE0nAE4oAE8VAgEWNgEXOQEYOgEZOwEbPQEcPw8dQBAeQgEfRA8gRREjRgEkRwElSA8pSxIqTBYrTQIsTgItTwIuUAIvUQIwUwIxVQ8yVhczWAI0Wg81Wxg2XAI3XQI4Xg85YRk6Yh07Ywc8ZAc9ZQc-Zgc_ZwdAaQdBaw9CbB5DbgdEcA9FcR9GcgdHcwdIdA9JdyBKeCRLeQZMegZNewZOfAZPfQZQfwZRgQEPUoIBJVOEAQZUhgEPVYcBJlaIAQZXiQEGWIoBD1mNASdajgErW48BDVyQAQ1dkQENXpIBDV-TAQ1glQENYZcBD2KYASxjmgENZJwBD2WdAS1mngENZ58BDWigAQ9rowEubKQBNG2lAQhupgEIb6cBCHCoAQhxqQEIcqsBCHOtAQ90rgE1dbMBCHa1AQ93tgE2eLoBCHm7AQh6vAEPe78BN3zAATt9wQEFfsIBBX_DAQWAAcQBBYEBxQEFggHHAQWDAckBD4QBygE8hQHMAQWGAc4BD4cBzwE9iAHQAQWJAdEBBYoB0gEPiwHVAT6MAdYBQo0B1wEEjgHYAQSPAdkBBJAB2gEEkQHbAQSSAd0BBJMB3wEPlAHgAUOVAeIBBJYB5AEPlwHlAUSYAeYBBJkB5wEEmgHoAQ-bAesBRZwB7AFJnQHuAQOeAe8BA58B8QEDoAHyAQOhAfMBA6IB9QEDowH3AQ-kAfgBSqUB-gEDpgH8AQ-nAf0BS6gB_gEDqQH_AQOqAYACD6sBgwJMrAGEAlA"
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
  createdAt: "createdAt",
  updatedAt: "updatedAt"
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

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/middleware/global-error.ts
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
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