
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
config.runtimeDataModel = JSON.parse('{"models":{"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","teams","project","parentTask","subTasks","creator","assignee","_count","tasks","team","projects","user","teamMemberships","createdTasks","assignedTasks","subscriptions","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","data","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","create","update","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","having","_min","_max","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","_avg","_sum","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","passwordHash","fullName","UserStatus","status","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","planName","expiresAt","assignedAt","Role","role","OrganizationMembershipStatus","slug","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "mwVQkAENBAAAmQIAIAYAAL0CACAPAAC-AgAgFAAAvwIAIK0BAAC8AgAwrgEAADcAEK8BAAC8AgAwsAEBAAAAAbYBQACXAgAhtwFAAJgCACG4AUAAmAIAIcoBAQCVAgAh4QEBAAAAAQEAAAABACAMAwAAxAIAIBAAANUCACCtAQAA1wIAMK4BAAADABCvAQAA1wIAMLABAQCVAgAhtQEAANkC4QEitwFAAJgCACG4AUAAmAIAIcgBAQCVAgAhyQEBAJUCACHfAQAA2ALfASICAwAAyAQAIBAAAMwEACANAwAAxAIAIBAAANUCACCtAQAA1wIAMK4BAAADABCvAQAA1wIAMLABAQAAAAG1AQAA2QLhASK3AUAAmAIAIbgBQACYAgAhyAEBAJUCACHJAQEAlQIAId8BAADYAt8BIuUBAADWAgAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJDgAA0gIAIBAAANUCACCtAQAA1AIAMK4BAAAIABCvAQAA1AIAMLcBQACYAgAhuAFAAJgCACHHAQEAlQIAIcgBAQCVAgAhAg4AAM0EACAQAADMBAAgCg4AANICACAQAADVAgAgrQEAANQCADCuAQAACAAQrwEAANQCADC3AUAAmAIAIbgBQACYAgAhxwEBAJUCACHIAQEAlQIAIeQBAADTAgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACAIBwAAzQIAIA4AANICACCtAQAA0QIAMK4BAAANABCvAQAA0QIAMMcBAQCVAgAhzAEBAJUCACHdAUAAmAIAIQIHAADKBAAgDgAAzQQAIAkHAADNAgAgDgAA0gIAIK0BAADRAgAwrgEAAA0AEK8BAADRAgAwxwEBAJUCACHMAQEAlQIAId0BQACYAgAh4wEAANACACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIBUHAADNAgAgCAAAzgIAIAkAAJsCACAKAADPAgAgCwAAzwIAIK0BAADKAgAwrgEAABIAEK8BAADKAgAwsAEBAJUCACG1AQAAywLTASK2AUAAlwIAIbcBQACYAgAhuAFAAJgCACHLAQEAxgIAIcwBAQCVAgAhzQEBAMYCACHOAQEAxgIAIc8BAQDGAgAh0AEBAMYCACHRAQEAlQIAIdQBAADMAtQBIgsHAADKBAAgCAAAywQAIAkAALUDACAKAADMBAAgCwAAzAQAILYBAADaAgAgywEAANoCACDNAQAA2gIAIM4BAADaAgAgzwEAANoCACDQAQAA2gIAIBUHAADNAgAgCAAAzgIAIAkAAJsCACAKAADPAgAgCwAAzwIAIK0BAADKAgAwrgEAABIAEK8BAADKAgAwsAEBAAAAAbUBAADLAtMBIrYBQACXAgAhtwFAAJgCACG4AUAAmAIAIcsBAQDGAgAhzAEBAJUCACHNAQEAxgIAIc4BAQDGAgAhzwEBAMYCACHQAQEAxgIAIdEBAQCVAgAh1AEAAMwC1AEiAwAAABIAIAEAABMAMAIAABQAIAEAAAASACADAAAAEgAgAQAAEwAwAgAAFAAgDwQAAJkCACARAACaAgAgEgAAmwIAIBMAAJsCACCtAQAAlAIAMK4BAAAYABCvAQAAlAIAMLABAQCVAgAhsQEBAJUCACGyAQEAlQIAIbMBAQCVAgAhtQEAAJYCtQEitgFAAJcCACG3AUAAmAIAIbgBQACYAgAhAQAAABgAIAEAAAAYACABAAAAEgAgAQAAAA0AIAEAAAASACABAAAACAAgAQAAAA0AIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAQAAAAMAIAEAAAAIACABAAAAEgAgAQAAABIAIA0DAADEAgAgBQAAmgIAIA8AAMcCACCtAQAAyQIAMK4BAAAmABCvAQAAyQIAMLABAQCVAgAhtgFAAJcCACG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIcsBAQDGAgAhBQMAAMgEACAFAAC0AwAgDwAAyQQAILYBAADaAgAgywEAANoCACAOAwAAxAIAIAUAAJoCACAPAADHAgAgrQEAAMkCADCuAQAAJgAQrwEAAMkCADCwAQEAAAABtgFAAJcCACG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIcsBAQDGAgAh4gEAAMgCACADAAAAJgAgAQAAJwAwAgAAKAAgDgMAAMQCACAGAADHAgAgDQAAmwIAIK0BAADFAgAwrgEAACoAEK8BAADFAgAwsAEBAJUCACG1AQEAlQIAIbYBQACXAgAhtwFAAJgCACG4AUAAmAIAIckBAQCVAgAhygEBAJUCACHLAQEAxgIAIQUDAADIBAAgBgAAyQQAIA0AALUDACC2AQAA2gIAIMsBAADaAgAgDgMAAMQCACAGAADHAgAgDQAAmwIAIK0BAADFAgAwrgEAACoAEK8BAADFAgAwsAEBAAAAAbUBAQCVAgAhtgFAAJcCACG3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHKAQEAlQIAIcsBAQDGAgAhAwAAACoAIAEAACsAMAIAACwAIA8DAADEAgAgrQEAAMACADCuAQAALgAQrwEAAMACADCwAQEAlQIAIbUBAADDAtsBIrcBQACYAgAhuAFAAJgCACHJAQEAlQIAIdYBAADBAtYBItcBAQCVAgAh2AEQAMICACHZAQEAlQIAIdsBAQCVAgAh3AFAAJcCACECAwAAyAQAINwBAADaAgAgDwMAAMQCACCtAQAAwAIAMK4BAAAuABCvAQAAwAIAMLABAQAAAAG1AQAAwwLbASK3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHWAQAAwQLWASLXAQEAAAAB2AEQAMICACHZAQEAlQIAIdsBAQCVAgAh3AFAAJcCACEDAAAALgAgAQAALwAwAgAAMAAgAQAAAAMAIAEAAAAmACABAAAAKgAgAQAAAC4AIAEAAAABACANBAAAmQIAIAYAAL0CACAPAAC-AgAgFAAAvwIAIK0BAAC8AgAwrgEAADcAEK8BAAC8AgAwsAEBAJUCACG2AUAAlwIAIbcBQACYAgAhuAFAAJgCACHKAQEAlQIAIeEBAQCVAgAhBQQAALMDACAGAADFBAAgDwAAxgQAIBQAAMcEACC2AQAA2gIAIAMAAAA3ACABAAA4ADACAAABACADAAAANwAgAQAAOAAwAgAAAQAgAwAAADcAIAEAADgAMAIAAAEAIAoEAADBBAAgBgAAwgQAIA8AAMMEACAUAADEBAAgsAEBAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAcoBAQAAAAHhAQEAAAABARoAADwAIAawAQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAeEBAQAAAAEBGgAAPgAwARoAAD4AMAoEAACQBAAgBgAAkQQAIA8AAJIEACAUAACTBAAgsAEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHKAQEA3gIAIeEBAQDeAgAhAgAAAAEAIBoAAEEAIAawAQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIcoBAQDeAgAh4QEBAN4CACECAAAANwAgGgAAQwAgAgAAADcAIBoAAEMAIAMAAAABACAhAAA8ACAiAABBACABAAAAAQAgAQAAADcAIAQMAACNBAAgJwAAjwQAICgAAI4EACC2AQAA2gIAIAmtAQAAuwIAMK4BAABKABCvAQAAuwIAMLABAQCGAgAhtgFAAIgCACG3AUAAiQIAIbgBQACJAgAhygEBAIYCACHhAQEAhgIAIQMAAAA3ACABAABJADAmAABKACADAAAANwAgAQAAOAAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAArgMAIBAAAIwEACCwAQEAAAABtQEAAADhAQK3AUAAAAABuAFAAAAAAcgBAQAAAAHJAQEAAAAB3wEAAADfAQIBGgAAUgAgB7ABAQAAAAG1AQAAAOEBArcBQAAAAAG4AUAAAAAByAEBAAAAAckBAQAAAAHfAQAAAN8BAgEaAABUADABGgAAVAAwCQMAAKwDACAQAACLBAAgsAEBAN4CACG1AQAAqgPhASK3AUAA4QIAIbgBQADhAgAhyAEBAN4CACHJAQEA3gIAId8BAACpA98BIgIAAAAFACAaAABXACAHsAEBAN4CACG1AQAAqgPhASK3AUAA4QIAIbgBQADhAgAhyAEBAN4CACHJAQEA3gIAId8BAACpA98BIgIAAAADACAaAABZACACAAAAAwAgGgAAWQAgAwAAAAUAICEAAFIAICIAAFcAIAEAAAAFACABAAAAAwAgAwwAAIgEACAnAACKBAAgKAAAiQQAIAqtAQAAtAIAMK4BAABgABCvAQAAtAIAMLABAQCGAgAhtQEAALYC4QEitwFAAIkCACG4AUAAiQIAIcgBAQCGAgAhyQEBAIYCACHfAQAAtQLfASIDAAAAAwAgAQAAXwAwJgAAYAAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgCwMAAIUEACAGAACGBAAgDQAAhwQAILABAQAAAAG1AQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABARoAAGgAIAiwAQEAAAABtQEBAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAQEaAABqADABGgAAagAwCwMAAPADACAGAADxAwAgDQAA8gMAILABAQDeAgAhtQEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHJAQEA3gIAIcoBAQDeAgAhywEBAPACACECAAAALAAgGgAAbQAgCLABAQDeAgAhtQEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHJAQEA3gIAIcoBAQDeAgAhywEBAPACACECAAAAKgAgGgAAbwAgAgAAACoAIBoAAG8AIAMAAAAsACAhAABoACAiAABtACABAAAALAAgAQAAACoAIAUMAADtAwAgJwAA7wMAICgAAO4DACC2AQAA2gIAIMsBAADaAgAgC60BAACzAgAwrgEAAHYAEK8BAACzAgAwsAEBAIYCACG1AQEAhgIAIbYBQACIAgAhtwFAAIkCACG4AUAAiQIAIckBAQCGAgAhygEBAIYCACHLAQEAngIAIQMAAAAqACABAAB1ADAmAAB2ACAD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AAAAFAAgIQAAqgEAICIAALIBACABAAAAFAAgAQAAABIAIAkMAADbAwAgJwAA3QMAICgAANwDACC2AQAA2gIAIMsBAADaAgAgzQEAANoCACDOAQAA2gIAIM8BAADaAgAg0AEAANoCACAQrQEAAKECADCuAQAAvgEAEK8BAAChAgAwsAEBAIYCACG1AQAAogLTASK2AUAAiAIAIbcBQACJAgAhuAFAAIkCACHLAQEAngIAIcwBAQCGAgAhzQEBAJ4CACHOAQEAngIAIc8BAQCeAgAh0AEBAJ4CACHRAQEAhgIAIdQBAACjAtQBIgMAAAASACABAAC9AQAwJgAAvgEAIAMAAAASACABAAATADACAAAUACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAoDAADYAwAgBQAA2QMAIA8AANoDACCwAQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABARoAAMYBACAHsAEBAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAQEaAADIAQAwARoAAMgBADAKAwAAvgMAIAUAAL8DACAPAADAAwAgsAEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHJAQEA3gIAIcoBAQDeAgAhywEBAPACACECAAAAKAAgGgAAywEAIAewAQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIckBAQDeAgAhygEBAN4CACHLAQEA8AIAIQIAAAAmACAaAADNAQAgAgAAACYAIBoAAM0BACADAAAAKAAgIQAAxgEAICIAAMsBACABAAAAKAAgAQAAACYAIAUMAAC7AwAgJwAAvQMAICgAALwDACC2AQAA2gIAIMsBAADaAgAgCq0BAACdAgAwrgEAANQBABCvAQAAnQIAMLABAQCGAgAhtgFAAIgCACG3AUAAiQIAIbgBQACJAgAhyQEBAIYCACHKAQEAhgIAIcsBAQCeAgAhAwAAACYAIAEAANMBADAmAADUAQAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAKACABAAAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAI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_AUAAAAABwAFAAIoCACEIuQECAAAAAboBAgAAAAS7AQIAAAAEvAECAAAAAb0BAgAAAAG-AQIAAAABvwECAAAAAcABAgCLAgAhCLkBQAAAAAG6AUAAAAAEuwFAAAAABLwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQAAAAAHAAUAAjAIAIQsMAACOAgAgJwAAjwIAICgAAI8CACC5AUAAAAABugFAAAAABbsBQAAAAAW8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAAAABwAFAAI0CACEIuQECAAAAAboBAgAAAAW7AQIAAAAFvAECAAAAAb0BAgAAAAG-AQIAAAABvwECAAAAAcABAgCOAgAhCLkBQAAAAAG6AUAAAAAFuwFAAAAABbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQAAAAAHAAUAAjwIAIQcMAACLAgAgJwAAkQIAICgAAJECACC5AQAAALUBAroBAAAAtQEIuwEAAAC1AQjAAQAAkAK1ASIEuQEAAAC1AQK6AQAAALUBCLsBAAAAtQEIwAEAAJECtQEiDgwAAIsCACAnAACTAgAgKAAAkwIAILkBAQAAAAG6AQEAAAAEuwEBAAAABLwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAkgIAIcEBAQAAAAHCAQEAAAABwwEBAAAAAQu5AQEAAAABugEBAAAABLsBAQAAAAS8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAJMCACHBAQEAAAABwgEBAAAAAcMBAQAAAAEPBAAAmQIAIBEAAJoCACASAACbAgAgEwAAmwIAIK0BAACUAgAwrgEAABgAEK8BAACUAgAwsAEBAJUCACGxAQEAlQIAIbIBAQCVAgAhswEBAJUCACG1AQAAlgK1ASK2AUAAlwIAIbcBQACYAgAhuAFAAJgCACELuQEBAAAAAboBAQAAAAS7AQEAAAAEvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQCTAgAhwQEBAAAAAcIBAQAAAAHDAQEAAAABBLkBAAAAtQECugEAAAC1AQi7AQAAALUBCMABAACRArUBIgi5AUAAAAABugFAAAAABbsBQAAAAAW8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAAAABwAFAAI8CACEIuQFAAAAAAboBQAAAAAS7AUAAAAAEvAFAAAAAAb0BQAAAAAG-AUAAAAABvwFAAAAAAcABQACMAgAhA8QBAAADACDFAQAAAwAgxgEAAAMAIAPEAQAACAAgxQEAAAgAIMYBAAAIACADxAEAABIAIMUBAAASACDGAQAAEgAgB60BAACcAgAwrgEAAOoBABCvAQAAnAIAMLcBQACJAgAhuAFAAIkCACHHAQEAhgIAIcgBAQCGAgAhCq0BAACdAgAwrgEAANQBABCvAQAAnQIAMLABAQCGAgAhtgFAAIgCACG3AUAAiQIAIbgBQACJAgAhyQEBAIYCACHKAQEAhgIAIcsBAQCeAgAhDgwAAI4CACAnAACgAgAgKAAAoAIAILkBAQAAAAG6AQEAAAAFuwEBAAAABbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAnwIAIcEBAQAAAAHCAQEAAAABwwEBAAAAAQ4MAACOAgAgJwAAoAIAICgAAKACACC5AQEAAAABugEBAAAABbsBAQAAAAW8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAJ8CACHBAQEAAAABwgEBAAAAAcMBAQAAAAELuQEBAAAAAboBAQAAAAW7AQEAAAAFvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQCgAgAhwQEBAAAAAcIBAQAAAAHDAQEAAAABEK0BAAChAgAwrgEAAL4BABCvAQAAoQIAMLABAQCGAgAhtQEAAKIC0wEitgFAAIgCACG3AUAAiQIAIbgBQACJAgAhywEBAJ4CACHMAQEAhgIAIc0BAQCeAgAhzgEBAJ4CACHPAQEAngIAIdABAQCeAgAh0QEBAIYCACHUAQAAowLUASIHDAAAiwIAICcAAKcCACAoAACnAgAguQEAAADTAQK6AQAAANMBCLsBAAAA0wEIwAEAAKYC0wEiBwwAAIsCACAnAAClAgAgKAAApQIAILkBAAAA1AECugEAAADUAQi7AQAAANQBCMABAACkAtQBIgcMAACLAgAgJwAApQIAICgAAKUCACC5AQAAANQBAroBAAAA1AEIuwEAAADUAQjAAQAApALUASIEuQEAAADUAQK6AQAAANQBCLsBAAAA1AEIwAEAAKUC1AEiBwwAAIsCACAnAACnAgAgKAAApwIAILkBAAAA0wECugEAAADTAQi7AQAAANMBCMABAACmAtMBIgS5AQAAANMBAroBAAAA0wEIuwEAAADTAQjAAQAApwLTASIOrQEAAKgCADCuAQAAogEAEK8BAACoAgAwsAEBAIYCACG1AQAAqwLbASK3AUAAiQIAIbgBQACJAgAhyQEBAIYCACHWAQAAqQLWASLXAQEAhgIAIdgBEACqAgAh2QEBAIYCACHbAQEAhgIAIdwBQACIAgAhBwwAAIsCACAnAACxAgAgKAAAsQIAILkBAAAA1gECugEAAADWAQi7AQAAANYBCMABAACwAtYBIg0MAACLAgAgJwAArwIAICgAAK8CACBpAACvAgAgagAArwIAILkBEAAAAAG6ARAAAAAEuwEQAAAABLwBEAAAAAG9ARAAAAABvgEQAAAAAb8BEAAAAAHAARAArgIAIQcMAACLAgAgJwAArQIAICgAAK0CACC5AQAAANsBAroBAAAA2wEIuwEAAADbAQjAAQAArALbASIHDAAAiwIAICcAAK0CACAoAACtAgAguQEAAADbAQK6AQAAANsBCLsBAAAA2wEIwAEAAKwC2wEiBLkBAAAA2wECugEAAADbAQi7AQAAANsBCMABAACtAtsBIg0MAACLAgAgJwAArwIAICgAAK8CACBpAACvAgAgagAArwIAILkBEAAAAAG6ARAAAAAEuwEQAAAABLwBEAAAAAG9ARAAAAABvgEQAAAAAb8BEAAAAAHAARAArgIAIQi5ARAAAAABugEQAAAABLsBEAAAAAS8ARAAAAABvQEQAAAAAb4BEAAAAAG_ARAAAAABwAEQAK8CACEHDAAAiwIAICcAALECACAoAACxAgAguQEAAADWAQK6AQAAANYBCLsBAAAA1gEIwAEAALAC1gEiBLkBAAAA1gECugEAAADWAQi7AQAAANYBCMABAACxAtYBIgatAQAAsgIAMK4BAACMAQAQrwEAALICADDHAQEAhgIAIcwBAQCGAgAh3QFAAIkCACELrQEAALMCADCuAQAAdgAQrwEAALMCADCwAQEAhgIAIbUBAQCGAgAhtgFAAIgCACG3AUAAiQIAIbgBQACJAgAhyQEBAIYCACHKAQEAhgIAIcsBAQCeAgAhCq0BAAC0AgAwrgEAAGAAEK8BAAC0AgAwsAEBAIYCACG1AQAAtgLhASK3AUAAiQIAIbgBQACJAgAhyAEBAIYCACHJAQEAhgIAId8BAAC1At8BIgcMAACLAgAgJwAAugIAICgAALoCACC5AQAAAN8BAroBAAAA3wEIuwEAAADfAQjAAQAAuQLfASIHDAAAiwIAICcAALgCACAoAAC4AgAguQEAAADhAQK6AQAAAOEBCLsBAAAA4QEIwAEAALcC4QEiBwwAAIsCACAnAAC4AgAgKAAAuAIAILkBAAAA4QECugEAAADhAQi7AQAAAOEBCMABAAC3AuEBIgS5AQAAAOEBAroBAAAA4QEIuwEAAADhAQjAAQAAuALhASIHDAAAiwIAICcAALoCACAoAAC6AgAguQEAAADfAQK6AQAAAN8BCLsBAAAA3wEIwAEAALkC3wEiBLkBAAAA3wECugEAAADfAQi7AQAAAN8BCMABAAC6At8BIgmtAQAAuwIAMK4BAABKABCvAQAAuwIAMLABAQCGAgAhtgFAAIgCACG3AUAAiQIAIbgBQACJAgAhygEBAIYCACHhAQEAhgIAIQ0EAACZAgAgBgAAvQIAIA8AAL4CACAUAAC_AgAgrQEAALwCADCuAQAANwAQrwEAALwCADCwAQEAlQIAIbYBQACXAgAhtwFAAJgCACG4AUAAmAIAIcoBAQCVAgAh4QEBAJUCACEDxAEAACYAIMUBAAAmACDGAQAAJgAgA8QBAAAqACDFAQAAKgAgxgEAACoAIAPEAQAALgAgxQEAAC4AIMYBAAAuACAPAwAAxAIAIK0BAADAAgAwrgEAAC4AEK8BAADAAgAwsAEBAJUCACG1AQAAwwLbASK3AUAAmAIAIbgBQACYAgAhyQEBAJUCACHWAQAAwQLWASLXAQEAlQIAIdgBEADCAgAh2QEBAJUCACHbAQEAlQIAIdwBQACXAgAhBLkBAAAA1gECugEAAADWAQi7AQAAANYBCMABAACxAtYBIgi5ARAAAAABugEQAAAABLsBEAAAAAS8ARAAAAABvQEQAAAAAb4BEAAAAAG_ARAAAAABwAEQAK8CACEEuQEAAADbAQK6AQAAANsBCLsBAAAA2wEIwAEAAK0C2wEiDwQAAJkCACAGAAC9AgAgDwAAvgIAIBQAAL8CACCtAQAAvAIAMK4BAAA3ABCvAQAAvAIAMLABAQCVAgAhtgFAAJcCACG3AUAAmAIAIbgBQACYAgAhygEBAJUCACHhAQEAlQIAIeYBAAA3ACDnAQAANwAgDgMAAMQCACAGAADHAgAgDQAAmwIAIK0BAADFAgAwrgEAACoAEK8BAADFAgAwsAEBAJUCACG1AQEAlQIAIbYBQACXAgAhtwFAAJgCACG4AUAAmAIAIckBAQCVAgAhygEBAJUCACHLAQEAxgIAIQu5AQEAAAABugEBAAAABbsBAQAAAAW8AQEAAAABvQEBAAAAAb4BAQAAAAG_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_QIAMPABAADtAgAwByEAAIoFACAiAACTBQAg6AEAAIsFACDpAQAAkgUAIOwBAAAYACDtAQAAGAAg7gEAAO0BACAQBwAAggMAIAkAAIMDACAKAACEAwAgCwAAhQMAILABAQAAAAG1AQAAANMBArYBQAAAAAG3AUAAAAABuAFAAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdQBAAAA1AECAgAAABQAICEAAIEDACADAAAAFAAgIQAAgQMAICIAAP8CACABGgAAkQUAMAIAAAAUACAaAAD_AgAgAgAAAO4CACAaAAD-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_BAAgIgAAggUAIOgBAACABQAg6QEAAIEFACDuAQAAKAAgBA4AAJ4DACC3AUAAAAABuAFAAAAAAccBAQAAAAEDIQAA_wQAIOgBAACABQAg7gEAACgAIAcDAACuAwAgsAEBAAAAAbUBAAAA4QECtwFAAAAAAbgBQAAAAAHJAQEAAAAB3wEAAADfAQICAAAABQAgIQAArQMAIAMAAAAFACAhAACtAwAgIgAAqwMAIAEaAAD-BAAwDQMAAMQCACAQAADVAgAgrQEAANcCADCuAQAAAwAQrwEAANcCADCwAQEAAAABtQEAANkC4QEitwFAAJgCACG4AUAAmAIAIcgBAQCVAgAhyQEBAJUCACHfAQAA2ALfASLlAQAA1gIAIAIAAAAFACAaAACrAwAgAgAAAKcDACAaAACoAwAgCq0BAACmAwAwrgEAAKcDABCvAQAApgMAMLABAQCVAgAhtQEAANkC4QEitwFAAJgCACG4AUAAmAIAIcgBAQCVAgAhyQEBAJUCACHfAQAA2ALfASIKrQEAAKYDADCuAQAApwMAEK8BAACmAwAwsAEBAJUCACG1AQAA2QLhASK3AUAAmAIAIbgBQACYAgAhyAEBAJUCACHJAQEAlQIAId8BAADYAt8BIgawAQEA3gIAIbUBAACqA-EBIrcBQADhAgAhuAFAAOECACHJAQEA3gIAId8BAACpA98BIgHrAQAAAN8BAgHrAQAAAOEBAgcDAACsAwAgsAEBAN4CACG1AQAAqgPhASK3AUAA4QIAIbgBQADhAgAhyQEBAN4CACHfAQAAqQPfASIFIQAA-QQAICIAAPwEACDoAQAA-gQAIOkBAAD7BAAg7gEAAAEAIAcDAACuAwAgsAEBAAAAAbUBAAAA4QECtwFAAAAAAbgBQAAAAAHJAQEAAAAB3wEAAADfAQIDIQAA-QQAIOgBAAD6BAAg7gEAAAEAIAQhAACfAwAw6AEAAKADADDqAQAAogMAIO4BAACjAwAwBCEAAJEDADDoAQAAkgMAMOoBAACUAwAg7gEAAJUDADAEIQAAiAMAMOgBAACJAwAw6gEAAIsDACDuAQAA6gIAMAQhAADmAgAw6AEAAOcCADDqAQAA6QIAIO4BAADqAgAwAAAAAAAABSEAAPQEACAiAAD3BAAg6AEAAPUEACDpAQAA9gQAIO4BAADtAQAgAyEAAPQEACDoAQAA9QQAIO4BAADtAQAgAAAABSEAAOgEACAiAADyBAAg6AEAAOkEACDpAQAA8QQAIO4BAAABACALIQAAzwMAMCIAANMDADDoAQAA0AMAMOkBAADRAwAw6gEAANIDACDrAQAAlQMAMOwBAACVAwAw7QEAAJUDADDuAQAAlQMAMO8BAADUAwAw8AEAAJgDADALIQAAwQMAMCIAAMYDADDoAQAAwgMAMOkBAADDAwAw6gEAAMQDACDrAQAAxQMAMOwBAADFAwAw7QEAAMUDADDuAQAAxQMAMO8BAADHAwAw8AEAAMgDADADBwAAzgMAIMwBAQAAAAHdAUAAAAABAgAAAA8AICEAAM0DACADAAAADwAgIQAAzQMAICIAAMsDACABGgAA8AQAMAkHAADNAgAgDgAA0gIAIK0BAADRAgAwrgEAAA0AEK8BAADRAgAwxwEBAJUCACHMAQEAlQIAId0BQACYAgAh4wEAANACACACAAAADwAgGgAAywMAIAIAAADJAwAgGgAAygMAIAatAQAAyAMAMK4BAADJAwAQrwEAAMgDADDHAQEAlQIAIcwBAQCVAgAh3QFAAJgCACEGrQEAAMgDADCuAQAAyQMAEK8BAADIAwAwxwEBAJUCACHMAQEAlQIAId0BQACYAgAhAswBAQDeAgAh3QFAAOECACEDBwAAzAMAIMwBAQDeAgAh3QFAAOECACEFIQAA6wQAICIAAO4EACDoAQAA7AQAIOkBAADtBAAg7gEAACwAIAMHAADOAwAgzAEBAAAAAd0BQAAAAAEDIQAA6wQAIOgBAADsBAAg7gEAACwAIAQQAAC6AwAgtwFAAAAAAbgBQAAAAAHIAQEAAAABAgAAAAoAICEAANcDACADAAAACgAgIQAA1wMAICIAANYDACABGgAA6gQAMAIAAAAKACAaAADWAwAgAgAAAJkDACAaAADVAwAgA7cBQADhAgAhuAFAAOECACHIAQEA3gIAIQQQAAC5AwAgtwFAAOECACG4AUAA4QIAIcgBAQDeAgAhBBAAALoDACC3AUAAAAABuAFAAAAAAcgBAQAAAAEDIQAA6AQAIOgBAADpBAAg7gEAAAEAIAQhAADPAwAw6AEAANADADDqAQAA0gMAIO4BAACVAwAwBCEAAMEDADDoAQAAwgMAMOoBAADEAwAg7gEAAMUDADAAAAAAAAAAAAHrAQAAANYBAgXrARAAAAAB8QEQAAAAAfIBEAAAAAHzARAAAAAB9AEQAAAAAQHrAQAAANsBAgUhAADjBAAgIgAA5gQAIOgBAADkBAAg6QEAAOUEACDuAQAAAQAgAyEAAOMEACDoAQAA5AQAIO4BAAABACAAAAAFIQAA3gQAICIAAOEEACDoAQAA3wQAIOkBAADgBAAg7gEAACgAIAMhAADeBAAg6AEAAN8EACDuAQAAKAAgAAAABSEAANcEACAiAADcBAAg6AEAANgEACDpAQAA2wQAIO4BAAABACALIQAA_AMAMCIAAIAEADDoAQAA_QMAMOkBAAD-AwAw6gEAAP8DACDrAQAAxQMAMOwBAADFAwAw7QEAAMUDADDuAQAAxQMAMO8BAACBBAAw8AEAAMgDADALIQAA8wMAMCIAAPcDADDoAQAA9AMAMOkBAAD1AwAw6gEAAPYDACDrAQAA6gIAMOwBAADqAgAw7QEAAOoCADDuAQAA6gIAMO8BAAD4AwAw8AEAAO0CADAQCAAAhwMAIAkAAIMDACAKAACEAwAgCwAAhQMAILABAQAAAAG1AQAAANMBArYBQAAAAAG3AUAAAAABuAFAAAAAAcsBAQAAAAHNAQEAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdQBAAAA1AECAgAAABQAICEAAPsDACADAAAAFAAgIQAA-wMAICIAAPoDACABGgAA2gQAMAIAAAAUACAaAAD6AwAgAgAAAO4CACAaAAD5AwAgDLABAQDeAgAhtQEAAPEC0wEitgFAAOACACG3AUAA4QIAIbgBQADhAgAhywEBAPACACHNAQEA8AIAIc4BAQDwAgAhzwEBAPACACHQAQEA8AIAIdEBAQDeAgAh1AEAAPIC1AEiEAgAAPUCACAJAAD2AgAgCgAA9wIAIAsAAIADACCwAQEA3gIAIbUBAADxAtMBIrYBQADgAgAhtwFAAOECACG4AUAA4QIAIcsBAQDwAgAhzQEBAPACACHOAQEA8AIAIc8BAQDwAgAh0AEBAPACACHRAQEA3gIAIdQBAADyAtQBIhAIAACHAwAgCQAAgwMAIAoAAIQDACALAACFAwAgsAEBAAAAAbUBAAAA0wECtgFAAAAAAbcBQAAAAAG4AUAAAAABywEBAAAAAc0BAQAAAAHOAQEAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB1AEAAADUAQIDDgAA7AMAIMcBAQAAAAHdAUAAAAABAgAAAA8AICEAAIQEACADAAAADwAgIQAAhAQAICIAAIMEACABGgAA2QQAMAIAAAAPACAaAACDBAAgAgAAAMkDACAaAACCBAAgAscBAQDeAgAh3QFAAOECACEDDgAA6wMAIMcBAQDeAgAh3QFAAOECACEDDgAA7AMAIMcBAQAAAAHdAUAAAAABAyEAANcEACDoAQAA2AQAIO4BAAABACAEIQAA_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_AwAgDwAAwAMAILABAQDeAgAhtgFAAOACACG3AUAA4QIAIbgBQADhAgAhygEBAN4CACHLAQEA8AIAIQgFAADZAwAgDwAA2gMAILABAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAABywEBAAAAAQcQAACMBAAgsAEBAAAAAbUBAAAA4QECtwFAAAAAAbgBQAAAAAHIAQEAAAAB3wEAAADfAQICAAAABQAgIQAAwAQAIAMAAAAFACAhAADABAAgIgAAvwQAIAEaAADOBAAwAgAAAAUAIBoAAL8EACACAAAApwMAIBoAAL4EACAGsAEBAN4CACG1AQAAqgPhASK3AUAA4QIAIbgBQADhAgAhyAEBAN4CACHfAQAAqQPfASIHEAAAiwQAILABAQDeAgAhtQEAAKoD4QEitwFAAOECACG4AUAA4QIAIcgBAQDeAgAh3wEAAKkD3wEiBxAAAIwEACCwAQEAAAABtQEAAADhAQK3AUAAAAABuAFAAAAAAcgBAQAAAAHfAQAAAN8BAgQhAAC4BAAw6AEAALkEADDqAQAAuwQAIO4BAACjAwAwBCEAAKwEADDoAQAArQQAMOoBAACvBAAg7gEAALAEADAEIQAAoAQAMOgBAAChBAAw6gEAAKMEACDuAQAApAQAMAQhAACUBAAw6AEAAJUEADDqAQAAlwQAIO4BAACYBAAwAAAABQQAALMDACAGAADFBAAgDwAAxgQAIBQAAMcEACC2AQAA2gIAIAAFAwAAyAQAIAYAAMkEACANAAC1AwAgtgEAANoCACDLAQAA2gIAIAsHAADKBAAgCAAAywQAIAkAALUDACAKAADMBAAgCwAAzAQAILYBAADaAgAgywEAANoCACDNAQAA2gIAIM4BAADaAgAgzwEAANoCACDQAQAA2gIAIAUEAACzAwAgEQAAtAMAIBIAALUDACATAAC1AwAgtgEAANoCACAFAwAAyAQAIAUAALQDACAPAADJBAAgtgEAANoCACDLAQAA2gIAIAawAQEAAAABtQEAAADhAQK3AUAAAAABuAFAAAAAAcgBAQAAAAHfAQAAAN8BAgawAQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAcsBAQAAAAEHsAEBAAAAAbUBAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAABywEBAAAAAQqwAQEAAAABtQEAAADbAQK3AUAAAAABuAFAAAAAAdYBAAAA1gEC1wEBAAAAAdgBEAAAAAHZAQEAAAAB2wEBAAAAAdwBQAAAAAELEQAAsAMAIBIAALEDACATAACyAwAgsAEBAAAAAbEBAQAAAAGyAQEAAAABswEBAAAAAbUBAAAAtQECtgFAAAAAAbcBQAAAAAG4AUAAAAABAgAAAO0BACAhAADSBAAgAwAAABgAICEAANIEACAiAADWBAAgDQAAABgAIBEAAOMCACASAADkAgAgEwAA5QIAIBoAANYEACCwAQEA3gIAIbEBAQDeAgAhsgEBAN4CACGzAQEA3gIAIbUBAADfArUBIrYBQADgAgAhtwFAAOECACG4AUAA4QIAIQsRAADjAgAgEgAA5AIAIBMAAOUCACCwAQEA3gIAIbEBAQDeAgAhsgEBAN4CACGzAQEA3gIAIbUBAADfArUBIrYBQADgAgAhtwFAAOECACG4AUAA4QIAIQkEAADBBAAgBgAAwgQAIBQAAMQEACCwAQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAeEBAQAAAAECAAAAAQAgIQAA1wQAIALHAQEAAAAB3QFAAAAAAQywAQEAAAABtQEAAADTAQK2AUAAAAABtwFAAAAAAbgBQAAAAAHLAQEAAAABzQEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHUAQAAANQBAgMAAAA3ACAhAADXBAAgIgAA3QQAIAsAAAA3ACAEAACQBAAgBgAAkQQAIBQAAJMEACAaAADdBAAgsAEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHKAQEA3gIAIeEBAQDeAgAhCQQAAJAEACAGAACRBAAgFAAAkwQAILABAQDeAgAhtgFAAOACACG3AUAA4QIAIbgBQADhAgAhygEBAN4CACHhAQEA3gIAIQkDAADYAwAgBQAA2QMAILABAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAECAAAAKAAgIQAA3gQAIAMAAAAmACAhAADeBAAgIgAA4gQAIAsAAAAmACADAAC-AwAgBQAAvwMAIBoAAOIEACCwAQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIckBAQDeAgAhygEBAN4CACHLAQEA8AIAIQkDAAC-AwAgBQAAvwMAILABAQDeAgAhtgFAAOACACG3AUAA4QIAIbgBQADhAgAhyQEBAN4CACHKAQEA3gIAIcsBAQDwAgAhCQQAAMEEACAGAADCBAAgDwAAwwQAILABAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAAB4QEBAAAAAQIAAAABACAhAADjBAAgAwAAADcAICEAAOMEACAiAADnBAAgCwAAADcAIAQAAJAEACAGAACRBAAgDwAAkgQAIBoAAOcEACCwAQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIcoBAQDeAgAh4QEBAN4CACEJBAAAkAQAIAYAAJEEACAPAACSBAAgsAEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHKAQEA3gIAIeEBAQDeAgAhCQQAAMEEACAPAADDBAAgFAAAxAQAILABAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHKAQEAAAAB4QEBAAAAAQIAAAABACAhAADoBAAgA7cBQAAAAAG4AUAAAAAByAEBAAAAAQoDAACFBAAgDQAAhwQAILABAQAAAAG1AQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABAgAAACwAICEAAOsEACADAAAAKgAgIQAA6wQAICIAAO8EACAMAAAAKgAgAwAA8AMAIA0AAPIDACAaAADvBAAgsAEBAN4CACG1AQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIckBAQDeAgAhygEBAN4CACHLAQEA8AIAIQoDAADwAwAgDQAA8gMAILABAQDeAgAhtQEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHJAQEA3gIAIcoBAQDeAgAhywEBAPACACECzAEBAAAAAd0BQAAAAAEDAAAANwAgIQAA6AQAICIAAPMEACALAAAANwAgBAAAkAQAIA8AAJIEACAUAACTBAAgGgAA8wQAILABAQDeAgAhtgFAAOACACG3AUAA4QIAIbgBQADhAgAhygEBAN4CACHhAQEA3gIAIQkEAACQBAAgDwAAkgQAIBQAAJMEACCwAQEA3gIAIbYBQADgAgAhtwFAAOECACG4AUAA4QIAIcoBAQDeAgAh4QEBAN4CACELBAAArwMAIBIAALEDACATAACyAwAgsAEBAAAAAbEBAQAAAAGyAQEAAAABswEBAAAAAbUBAAAAtQECtgFAAAAAAbcBQAAAAAG4AUAAAAABAgAAAO0BACAhAAD0BAAgAwAAABgAICEAAPQEACAiAAD4BAAgDQAAABgAIAQAAOICACASAADkAgAgEwAA5QIAIBoAAPgEACCwAQEA3gIAIbEBAQDeAgAhsgEBAN4CACGzAQEA3gIAIbUBAADfArUBIrYBQADgAgAhtwFAAOECACG4AUAA4QIAIQsEAADiAgAgEgAA5AIAIBMAAOUCACCwAQEA3gIAIbEBAQDeAgAhsgEBAN4CACGzAQEA3gIAIbUBAADfArUBIrYBQADgAgAhtwFAAOECACG4AUAA4QIAIQkGAADCBAAgDwAAwwQAIBQAAMQEACCwAQEAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABygEBAAAAAeEBAQAAAAECAAAAAQAgIQAA-QQAIAMAAAA3ACAhAAD5BAAgIgAA_QQAIAsAAAA3ACAGAACRBAAgDwAAkgQAIBQAAJMEACAaAAD9BAAgsAEBAN4CACG2AUAA4AIAIbcBQADhAgAhuAFAAOECACHKAQEA3gIAIeEBAQDeAgAhCQYAAJEEACAPAACSBAAgFAAAkwQAILABAQDeAgAhtgFAAOACACG3AUAA4QIAIbgBQADhAgAhygEBAN4CACHhAQEA3gIAIQawAQEAAAABtQEAAADhAQK3AUAAAAABuAFAAAAAAckBAQAAAAHfAQAAAN8BAgkDAADYAwAgDwAA2gMAILABAQAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAECAAAAKAAgIQAA_wQAIAMAAAAmACAhAAD_BAAgIgAAgwUAIAsAAAAmACADAAC-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_Dx1AEB5CAR9EDyBFESNGASRHASVIDylLEipMFitNAixOAi1PAi5QAi9RAjBTAjFVDzJWFzNYAjRaDzVbGDZcAjddAjheDzlhGTpiHTtjBzxkBz1lBz5mBz9nB0BpB0FrD0JsHkNuB0RwD0VxH0ZyB0dzB0h0D0l3IEp4JEt5Bkx6Bk17Bk58Bk99BlB_BlGBAQ9SggElU4QBBlSGAQ9VhwEmVogBBleJAQZYigEPWY0BJ1qOAStbjwENXJABDV2RAQ1ekgENX5MBDWCVAQ1hlwEPYpgBLGOaAQ1knAEPZZ0BLWaeAQ1nnwENaKABD2ujAS5spAE0baUBCG6mAQhvpwEIcKgBCHGpAQhyqwEIc60BD3SuATV1swEIdrUBD3e2ATZ4ugEIebsBCHq8AQ97vwE3fMABO33BAQV-wgEFf8MBBYABxAEFgQHFAQWCAccBBYMByQEPhAHKATyFAcwBBYYBzgEPhwHPAT2IAdABBYkB0QEFigHSAQ-LAdUBPowB1gFCjQHXAQSOAdgBBI8B2QEEkAHaAQSRAdsBBJIB3QEEkwHfAQ-UAeABQ5UB4gEElgHkAQ-XAeUBRJgB5gEEmQHnAQSaAegBD5sB6wFFnAHsAUmdAe4BA54B7wEDnwHxAQOgAfIBA6EB8wEDogH1AQOjAfcBD6QB-AFKpQH6AQOmAfwBD6cB_QFLqAH-AQOpAf8BA6oBgAIPqwGDAkysAYQCUA"
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
  if (existingTeam) {
    throw new Error(
      "A team with this name already exists in the organization."
    );
  }
  const team = await prisma.team.create({
    data: {
      name: payload.name,
      description: payload.description,
      organizationId
    }
  });
  return team;
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
    include: {
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