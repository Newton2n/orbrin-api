
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
  "inlineSchema": `model Comment {
  id        String    @id @default(uuid())
  taskId    String    @map("task_id")
  authorId  String    @map("author_id")
  content   String
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("comments")
}

enum Role {
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

  comments Comment[]

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
  comments        Comment[]

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
config.runtimeDataModel = JSON.parse('{"models":{"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"authorId","kind":"scalar","type":"String","dbName":"author_id"},{"name":"content","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"}],"dbName":"comments","schema":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","project","team","projects","_count","user","teamMemberships","createdTasks","assignedTasks","comments","teams","subscriptions","tasks","sprints","parentTask","subTasks","creator","assignee","sprint","task","author","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","data","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","create","update","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","having","_min","_max","Comment.groupBy","Comment.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","_avg","_sum","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","passwordHash","fullName","UserStatus","status","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","planName","expiresAt","goal","SprintStatus","startDate","endDate","assignedAt","Role","role","OrganizationMembershipStatus","slug","taskId","authorId","content","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "wAZhsAEMGAAAkgMAIBkAAJMDACDSAQAAkQMAMNMBAAAYABDUAQAAkQMAMNUBAQAAAAHbAUAA1AIAIdwBQADVAgAh3QFAANUCACGLAgEA0gIAIYwCAQDSAgAhjQIBANICACEBAAAAAQAgDAMAAIsDACAKAACTAwAg0gEAAKADADDTAQAAAwAQ1AEAAKADADDVAQEA0gIAIdoBAACiA4oCItwBQADVAgAh3QFAANUCACHtAQEA0gIAIe4BAQDSAgAhiAIAAKEDiAIiAgMAANQFACAKAADYBQAgDQMAAIsDACAKAACTAwAg0gEAAKADADDTAQAAAwAQ1AEAAKADADDVAQEAAAAB2gEAAKIDigIi3AFAANUCACHdAUAA1QIAIe0BAQDSAgAh7gEBANICACGIAgAAoQOIAiKRAgAAnwMAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQcAAJwDACAKAACTAwAg0gEAAJ4DADDTAQAACAAQ1AEAAJ4DADDcAUAA1QIAId0BQADVAgAh7AEBANICACHtAQEA0gIAIQIHAADaBQAgCgAA2AUAIAoHAACcAwAgCgAAkwMAINIBAACeAwAw0wEAAAgAENQBAACeAwAw3AFAANUCACHdAUAA1QIAIewBAQDSAgAh7QEBANICACGQAgAAnQMAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgCAYAAIYDACAHAACcAwAg0gEAAJsDADDTAQAADQAQ1AEAAJsDADDsAQEA0gIAIfEBAQDSAgAhhgJAANUCACECBgAA0wUAIAcAANoFACAJBgAAhgMAIAcAAJwDACDSAQAAmwMAMNMBAAANABDUAQAAmwMAMOwBAQDSAgAh8QEBANICACGGAkAA1QIAIY8CAACaAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAIACABAAAADQAgFwYAAIYDACAOAADZAgAgEwAAlwMAIBQAANgCACAVAACYAwAgFgAAmAMAIBcAAJkDACDSAQAAlAMAMNMBAAATABDUAQAAlAMAMNUBAQDSAgAh2gEAAJUD-AEi2wFAANQCACHcAUAA1QIAId0BQADVAgAh8AEBAIQDACHxAQEA0gIAIfIBAQCEAwAh8wEBAIQDACH0AQEAhAMAIfUBAQCEAwAh9gEBANICACH5AQAAlgP5ASINBgAA0wUAIA4AAJ4EACATAADXBQAgFAAAnQQAIBUAANgFACAWAADYBQAgFwAA2QUAINsBAACjAwAg8AEAAKMDACDyAQAAowMAIPMBAACjAwAg9AEAAKMDACD1AQAAowMAIBcGAACGAwAgDgAA2QIAIBMAAJcDACAUAADYAgAgFQAAmAMAIBYAAJgDACAXAACZAwAg0gEAAJQDADDTAQAAEwAQ1AEAAJQDADDVAQEAAAAB2gEAAJUD-AEi2wFAANQCACHcAUAA1QIAId0BQADVAgAh8AEBAIQDACHxAQEA0gIAIfIBAQCEAwAh8wEBAIQDACH0AQEAhAMAIfUBAQCEAwAh9gEBANICACH5AQAAlgP5ASIDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAwYAACSAwAgGQAAkwMAINIBAACRAwAw0wEAABgAENQBAACRAwAw1QEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACGLAgEA0gIAIYwCAQDSAgAhjQIBANICACEDGAAA1wUAIBkAANgFACDbAQAAowMAIAMAAAAYACABAAAZADACAAABACABAAAAAwAgAQAAAAgAIAEAAAATACABAAAAEwAgAQAAABgAIA0DAACLAwAgBQAA1wIAIAgAAI4DACDSAQAAkAMAMNMBAAAgABDUAQAAkAMAMNUBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhBQMAANQFACAFAACcBAAgCAAA1gUAINsBAACjAwAg8AEAAKMDACAOAwAAiwMAIAUAANcCACAIAACOAwAg0gEAAJADADDTAQAAIAAQ1AEAAJADADDVAQEAAAAB2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhjgIAAI8DACADAAAAIAAgAQAAIQAwAgAAIgAgDwMAAIsDACAPAACOAwAgEQAA2AIAIBIAAI0DACDSAQAAjAMAMNMBAAAkABDUAQAAjAMAMNUBAQDSAgAh2gEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACHuAQEA0gIAIe8BAQDSAgAh8AEBAIQDACEGAwAA1AUAIA8AANYFACARAACdBAAgEgAA1QUAINsBAACjAwAg8AEAAKMDACAPAwAAiwMAIA8AAI4DACARAADYAgAgEgAAjQMAINIBAACMAwAw0wEAACQAENQBAACMAwAw1QEBAAAAAdoBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhAwAAACQAIAEAACUAMAIAACYAIA8DAACLAwAg0gEAAIcDADDTAQAAKAAQ1AEAAIcDADDVAQEA0gIAIdoBAACKA4ACItwBQADVAgAh3QFAANUCACHuAQEA0gIAIfsBAACIA_sBIvwBAQDSAgAh_QEQAIkDACH-AQEA0gIAIYACAQDSAgAhgQJAANQCACECAwAA1AUAIIECAACjAwAgDwMAAIsDACDSAQAAhwMAMNMBAAAoABDUAQAAhwMAMNUBAQAAAAHaAQAAigOAAiLcAUAA1QIAId0BQADVAgAh7gEBANICACH7AQAAiAP7ASL8AQEAAAAB_QEQAIkDACH-AQEA0gIAIYACAQDSAgAhgQJAANQCACEDAAAAKAAgAQAAKQAwAgAAKgAgAQAAAAMAIAEAAAAgACABAAAAJAAgAQAAACgAIA8GAACGAwAgEQAA2AIAINIBAACDAwAw0wEAADAAENQBAACDAwAw1QEBANICACHaAQAAhQOEAiLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHvAQEA0gIAIfEBAQDSAgAhggIBAIQDACGEAkAA1AIAIYUCQADUAgAhBgYAANMFACARAACdBAAg2wEAAKMDACCCAgAAowMAIIQCAACjAwAghQIAAKMDACAPBgAAhgMAIBEAANgCACDSAQAAgwMAMNMBAAAwABDUAQAAgwMAMNUBAQAAAAHaAQAAhQOEAiLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHvAQEA0gIAIfEBAQDSAgAhggIBAIQDACGEAkAA1AIAIYUCQADUAgAhAwAAADAAIAEAADEAMAIAADIAIAMAAAATACABAAAUADACAAAVACABAAAAEwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAATACABAAAUADACAAAVACABAAAAMAAgAQAAAA0AIAEAAAATACABAAAAEwAgAwAAABMAIAEAABQAMAIAABUAIBAEAADWAgAgCwAA1wIAIAwAANgCACANAADYAgAgDgAA2QIAINIBAADRAgAw0wEAAD0AENQBAADRAgAw1QEBANICACHWAQEA0gIAIdcBAQDSAgAh2AEBANICACHaAQAA0wLaASLbAUAA1AIAIdwBQADVAgAh3QFAANUCACEBAAAAPQAgAQAAAD0AIAEAAAAwACADAAAAGAAgAQAAGQAwAgAAAQAgAQAAABMAIAEAAAAYACABAAAAAQAgAwAAABgAIAEAABkAMAIAAAEAIAMAAAAYACABAAAZADACAAABACADAAAAGAAgAQAAGQAwAgAAAQAgCRgAAL0DACAZAADcAwAg1QEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAYsCAQAAAAGMAgEAAAABjQIBAAAAAQEfAABIACAH1QEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAYsCAQAAAAGMAgEAAAABjQIBAAAAAQEfAABKADABHwAASgAwCRgAALsDACAZAADaAwAg1QEBAKcDACHbAUAAqQMAIdwBQACqAwAh3QFAAKoDACGLAgEApwMAIYwCAQCnAwAhjQIBAKcDACECAAAAAQAgHwAATQAgB9UBAQCnAwAh2wFAAKkDACHcAUAAqgMAId0BQACqAwAhiwIBAKcDACGMAgEApwMAIY0CAQCnAwAhAgAAABgAIB8AAE8AIAIAAAAYACAfAABPACADAAAAAQAgJgAASAAgJwAATQAgAQAAAAEAIAEAAAAYACAECQAA0AUAICwAANIFACAtAADRBQAg2wEAAKMDACAK0gEAAIIDADDTAQAAVgAQ1AEAAIIDADDVAQEAwwIAIdsBQADFAgAh3AFAAMYCACHdAUAAxgIAIYsCAQDDAgAhjAIBAMMCACGNAgEAwwIAIQMAAAAYACABAABVADArAABWACADAAAAGAAgAQAAGQAwAgAAAQAgDQQAANYCACAIAACAAwAgDwAA_wIAIBAAAIEDACDSAQAA_gIAMNMBAABcABDUAQAA_gIAMNUBAQAAAAHbAUAA1AIAIdwBQADVAgAh3QFAANUCACHvAQEA0gIAIYoCAQAAAAEBAAAAWQAgAQAAAFkAIA0EAADWAgAgCAAAgAMAIA8AAP8CACAQAACBAwAg0gEAAP4CADDTAQAAXAAQ1AEAAP4CADDVAQEA0gIAIdsBQADUAgAh3AFAANUCACHdAUAA1QIAIe8BAQDSAgAhigIBANICACEFBAAAmwQAIAgAAM4FACAPAADNBQAgEAAAzwUAINsBAACjAwAgAwAAAFwAIAEAAF0AMAIAAFkAIAMAAABcACABAABdADACAABZACADAAAAXAAgAQAAXQAwAgAAWQAgCgQAAMkFACAIAADLBQAgDwAAygUAIBAAAMwFACDVAQEAAAAB2wFAAAAAAdwBQAAAAAHdAUAAAAAB7wEBAAAAAYoCAQAAAAEBHwAAYQAgBtUBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAHvAQEAAAABigIBAAAAAQEfAABjADABHwAAYwAwCgQAAJgFACAIAACaBQAgDwAAmQUAIBAAAJsFACDVAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe8BAQCnAwAhigIBAKcDACECAAAAWQAgHwAAZgAgBtUBAQCnAwAh2wFAAKkDACHcAUAAqgMAId0BQACqAwAh7wEBAKcDACGKAgEApwMAIQIAAABcACAfAABoACACAAAAXAAgHwAAaAAgAwAAAFkAICYAAGEAICcAAGYAIAEAAABZACABAAAAXAAgBAkAAJUFACAsAACXBQAgLQAAlgUAINsBAACjAwAgCdIBAAD9AgAw0wEAAG8AENQBAAD9AgAw1QEBAMMCACHbAUAAxQIAIdwBQADGAgAh3QFAAMYCACHvAQEAwwIAIYoCAQDDAgAhAwAAAFwAIAEAAG4AMCsAAG8AIAMAAABcACABAABdADACAABZACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAACVBAAgCgAAlAUAINUBAQAAAAHaAQAAAIoCAtwBQAAAAAHdAUAAAAAB7QEBAAAAAe4BAQAAAAGIAgAAAIgCAgEfAAB3ACAH1QEBAAAAAdoBAAAAigIC3AFAAAAAAd0BQAAAAAHtAQEAAAAB7gEBAAAAAYgCAAAAiAICAR8AAHkAMAEfAAB5ADAJAwAAkwQAIAoAAJMFACDVAQEApwMAIdoBAACRBIoCItwBQACqAwAh3QFAAKoDACHtAQEApwMAIe4BAQCnAwAhiAIAAJAEiAIiAgAAAAUAIB8AAHwAIAfVAQEApwMAIdoBAACRBIoCItwBQACqAwAh3QFAAKoDACHtAQEApwMAIe4BAQCnAwAhiAIAAJAEiAIiAgAAAAMAIB8AAH4AIAIAAAADACAfAAB-ACADAAAABQAgJgAAdwAgJwAAfAAgAQAAAAUAIAEAAAADACADCQAAkAUAICwAAJIFACAtAACRBQAgCtIBAAD2AgAw0wEAAIUBABDUAQAA9gIAMNUBAQDDAgAh2gEAAPgCigIi3AFAAMYCACHdAUAAxgIAIe0BAQDDAgAh7gEBAMMCACGIAgAA9wKIAiIDAAAAAwAgAQAAhAEAMCsAAIUBACADAAAAAwAgAQAABAAwAgAABQAgAQAAACYAIAEAAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACAMAwAAjAUAIA8AAI4FACARAACPBQAgEgAAjQUAINUBAQAAAAHaAQEAAAAB2wFAAAAAAdwBQAAAAAHdAUAAAAAB7gEBAAAAAe8BAQAAAAHwAQEAAAABAR8AAI0BACAI1QEBAAAAAdoBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAHuAQEAAAAB7wEBAAAAAfABAQAAAAEBHwAAjwEAMAEfAACPAQAwDAMAAOoEACAPAADsBAAgEQAA7QQAIBIAAOsEACDVAQEApwMAIdoBAQCnAwAh2wFAAKkDACHcAUAAqgMAId0BQACqAwAh7gEBAKcDACHvAQEApwMAIfABAQDIAwAhAgAAACYAIB8AAJIBACAI1QEBAKcDACHaAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe4BAQCnAwAh7wEBAKcDACHwAQEAyAMAIQIAAAAkACAfAACUAQAgAgAAACQAIB8AAJQBACADAAAAJgAgJgAAjQEAICcAAJIBACABAAAAJgAgAQAAACQAIAUJAADnBAAgLAAA6QQAIC0AAOgEACDbAQAAowMAIPABAACjAwAgC9IBAAD1AgAw0wEAAJsBABDUAQAA9QIAMNUBAQDDAgAh2gEBAMMCACHbAUAAxQIAIdwBQADGAgAh3QFAAMYCACHuAQEAwwIAIe8BAQDDAgAh8AEBANwCACEDAAAAJAAgAQAAmgEAMCsAAJsBACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAFBgAAtwQAIAcAAOYEACDsAQEAAAAB8QEBAAAAAYYCQAAAAAEBHwAAowEAIAPsAQEAAAAB8QEBAAAAAYYCQAAAAAEBHwAApQEAMAEfAAClAQAwBQYAALUEACAHAADlBAAg7AEBAKcDACHxAQEApwMAIYYCQACqAwAhAgAAAA8AIB8AAKgBACAD7AEBAKcDACHxAQEApwMAIYYCQACqAwAhAgAAAA0AIB8AAKoBACACAAAADQAgHwAAqgEAIAMAAAAPACAmAACjAQAgJwAAqAEAIAEAAAAPACABAAAADQAgAwkAAOIEACAsAADkBAAgLQAA4wQAIAbSAQAA9AIAMNMBAACxAQAQ1AEAAPQCADDsAQEAwwIAIfEBAQDDAgAhhgJAAMYCACEDAAAADQAgAQAAsAEAMCsAALEBACADAAAADQAgAQAADgAwAgAADwAgAQAAADIAIAEAAAAyACADAAAAMAAgAQAAMQAwAgAAMgAgAwAAADAAIAEAADEAMAIAADIAIAMAAAAwACABAAAxADACAAAyACAMBgAA4AQAIBEAAOEEACDVAQEAAAAB2gEAAACEAgLbAUAAAAAB3AFAAAAAAd0BQAAAAAHvAQEAAAAB8QEBAAAAAYICAQAAAAGEAkAAAAABhQJAAAAAAQEfAAC5AQAgCtUBAQAAAAHaAQAAAIQCAtsBQAAAAAHcAUAAAAAB3QFAAAAAAe8BAQAAAAHxAQEAAAABggIBAAAAAYQCQAAAAAGFAkAAAAABAR8AALsBADABHwAAuwEAMAwGAADVBAAgEQAA1gQAINUBAQCnAwAh2gEAANQEhAIi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh7wEBAKcDACHxAQEApwMAIYICAQDIAwAhhAJAAKkDACGFAkAAqQMAIQIAAAAyACAfAAC-AQAgCtUBAQCnAwAh2gEAANQEhAIi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh7wEBAKcDACHxAQEApwMAIYICAQDIAwAhhAJAAKkDACGFAkAAqQMAIQIAAAAwACAfAADAAQAgAgAAADAAIB8AAMABACADAAAAMgAgJgAAuQEAICcAAL4BACABAAAAMgAgAQAAADAAIAcJAADRBAAgLAAA0wQAIC0AANIEACDbAQAAowMAIIICAACjAwAghAIAAKMDACCFAgAAowMAIA3SAQAA8AIAMNMBAADHAQAQ1AEAAPACADDVAQEAwwIAIdoBAADxAoQCItsBQADFAgAh3AFAAMYCACHdAUAAxgIAIe8BAQDDAgAh8QEBAMMCACGCAgEA3AIAIYQCQADFAgAhhQJAAMUCACEDAAAAMAAgAQAAxgEAMCsAAMcBACADAAAAMAAgAQAAMQAwAgAAMgAgAQAAACoAIAEAAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACAMAwAA0AQAINUBAQAAAAHaAQAAAIACAtwBQAAAAAHdAUAAAAAB7gEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BEAAAAAH-AQEAAAABgAIBAAAAAYECQAAAAAEBHwAAzwEAIAvVAQEAAAAB2gEAAACAAgLcAUAAAAAB3QFAAAAAAe4BAQAAAAH7AQAAAPsBAvwBAQAAAAH9ARAAAAAB_gEBAAAAAYACAQAAAAGBAkAAAAABAR8AANEBADABHwAA0QEAMAwDAADPBAAg1QEBAKcDACHaAQAAzgSAAiLcAUAAqgMAId0BQACqAwAh7gEBAKcDACH7AQAAzAT7ASL8AQEApwMAIf0BEADNBAAh_gEBAKcDACGAAgEApwMAIYECQACpAwAhAgAAACoAIB8AANQBACAL1QEBAKcDACHaAQAAzgSAAiLcAUAAqgMAId0BQACqAwAh7gEBAKcDACH7AQAAzAT7ASL8AQEApwMAIf0BEADNBAAh_gEBAKcDACGAAgEApwMAIYECQACpAwAhAgAAACgAIB8AANYBACACAAAAKAAgHwAA1gEAIAMAAAAqACAmAADPAQAgJwAA1AEAIAEAAAAqACABAAAAKAAgBgkAAMcEACAsAADKBAAgLQAAyQQAII4BAADIBAAgjwEAAMsEACCBAgAAowMAIA7SAQAA5gIAMNMBAADdAQAQ1AEAAOYCADDVAQEAwwIAIdoBAADpAoACItwBQADGAgAh3QFAAMYCACHuAQEAwwIAIfsBAADnAvsBIvwBAQDDAgAh_QEQAOgCACH-AQEAwwIAIYACAQDDAgAhgQJAAMUCACEDAAAAKAAgAQAA3AEAMCsAAN0BACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAABUAIAEAAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACAUBgAA5wMAIA4AAOwDACATAADuAwAgFAAA6AMAIBUAAOkDACAWAADqAwAgFwAA6wMAINUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgEfAADlAQAgDdUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgEfAADnAQAwAR8AAOcBADABAAAAEwAgAQAAAD0AIAEAAAA9ACABAAAAMAAgFAYAAMwDACAOAADRAwAgEwAAzQMAIBQAAM4DACAVAADPAwAgFgAA5QMAIBcAANADACDVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfMBAQDIAwAh9AEBAMgDACH1AQEAyAMAIfYBAQCnAwAh-QEAAMoD-QEiAgAAABUAIB8AAO4BACAN1QEBAKcDACHaAQAAyQP4ASLbAUAAqQMAIdwBQACqAwAh3QFAAKoDACHwAQEAyAMAIfEBAQCnAwAh8gEBAMgDACHzAQEAyAMAIfQBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_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-QEAAOEC-QEiBwkAAMgCACAsAADlAgAgLQAA5QIAIN4BAAAA-AEC3wEAAAD4AQjgAQAAAPgBCOUBAADkAvgBIgcJAADIAgAgLAAA4wIAIC0AAOMCACDeAQAAAPkBAt8BAAAA-QEI4AEAAAD5AQjlAQAA4gL5ASIHCQAAyAIAICwAAOMCACAtAADjAgAg3gEAAAD5AQLfAQAAAPkBCOABAAAA-QEI5QEAAOIC-QEiBN4BAAAA-QEC3wEAAAD5AQjgAQAAAPkBCOUBAADjAvkBIgcJAADIAgAgLAAA5QIAIC0AAOUCACDeAQAAAPgBAt8BAAAA-AEI4AEAAAD4AQjlAQAA5AL4ASIE3gEAAAD4AQLfAQAAAPgBCOABAAAA-AEI5QEAAOUC-AEiDtIBAADmAgAw0wEAAN0BABDUAQAA5gIAMNUBAQDDAgAh2gEAAOkCgAIi3AFAAMYCACHdAUAAxgIAIe4BAQDDAgAh-wEAAOcC-wEi_AEBAMMCACH9ARAA6AIAIf4BAQDDAgAhgAIBAMMCACGBAkAAxQIAIQcJAADIAgAgLAAA7wIAIC0AAO8CACDeAQAAAPsBAt8BAAAA-wEI4AEAAAD7AQjlAQAA7gL7ASINCQAAyAIAICwAAO0CACAtAADtAgAgjgEAAO0CACCPAQAA7QIAIN4BEAAAAAHfARAAAAAE4AEQAAAABOEBEAAAAAHiARAAAAAB4wEQAAAAAeQBEAAAAAHlARAA7AIAIQcJAADIAgAgLAAA6wIAIC0AAOsCACDeAQAAAIACAt8BAAAAgAII4AEAAACAAgjlAQAA6gKAAiIHCQAAyAIAICwAAOsCACAtAADrAgAg3gEAAACAAgLfAQAAAIACCOABAAAAgAII5QEAAOoCgAIiBN4BAAAAgAIC3wEAAACAAgjgAQAAAIACCOUBAADrAoACIg0JAADIAgAgLAAA7QIAIC0AAO0CACCOAQAA7QIAII8BAADtAgAg3gEQAAAAAd8BEAAAAATgARAAAAAE4QEQAAAAAeIBEAAAAAHjARAAAAAB5AEQAAAAAeUBEADsAgAhCN4BEAAAAAHfARAAAAAE4AEQAAAABOEBEAAAAAHiARAAAAAB4wEQAAAAAeQBEAAAAAHlARAA7QIAIQcJAADIAgAgLAAA7wIAIC0AAO8CACDeAQAAAPsBAt8BAAAA-wEI4AEAAAD7AQjlAQAA7gL7ASIE3gEAAAD7AQLfAQAAAPsBCOABAAAA-wEI5QEAAO8C-wEiDdIBAADwAgAw0wEAAMcBABDUAQAA8AIAMNUBAQDDAgAh2gEAAPEChAIi2wFAAMUCACHcAUAAxgIAId0BQADGAgAh7wEBAMMCACHxAQEAwwIAIYICAQDcAgAhhAJAAMUCACGFAkAAxQIAIQcJAADIAgAgLAAA8wIAIC0AAPMCACDeAQAAAIQCAt8BAAAAhAII4AEAAACEAgjlAQAA8gKEAiIHCQAAyAIAICwAAPMCACAtAADzAgAg3gEAAACEAgLfAQAAAIQCCOABAAAAhAII5QEAAPIChAIiBN4BAAAAhAIC3wEAAACEAgjgAQAAAIQCCOUBAADzAoQCIgbSAQAA9AIAMNMBAACxAQAQ1AEAAPQCADDsAQEAwwIAIfEBAQDDAgAhhgJAAMYCACEL0gEAAPUCADDTAQAAmwEAENQBAAD1AgAw1QEBAMMCACHaAQEAwwIAIdsBQADFAgAh3AFAAMYCACHdAUAAxgIAIe4BAQDDAgAh7wEBAMMCACHwAQEA3AIAIQrSAQAA9gIAMNMBAACFAQAQ1AEAAPYCADDVAQEAwwIAIdoBAAD4AooCItwBQADGAgAh3QFAAMYCACHtAQEAwwIAIe4BAQDDAgAhiAIAAPcCiAIiBwkAAMgCACAsAAD8AgAgLQAA_AIAIN4BAAAAiAIC3wEAAACIAgjgAQAAAIgCCOUBAAD7AogCIgcJAADIAgAgLAAA-gIAIC0AAPoCACDeAQAAAIoCAt8BAAAAigII4AEAAACKAgjlAQAA-QKKAiIHCQAAyAIAICwAAPoCACAtAAD6AgAg3gEAAACKAgLfAQAAAIoCCOABAAAAigII5QEAAPkCigIiBN4BAAAAigIC3wEAAACKAgjgAQAAAIoCCOUBAAD6AooCIgcJAADIAgAgLAAA_AIAIC0AAPwCACDeAQAAAIgCAt8BAAAAiAII4AEAAACIAgjlAQAA-wKIAiIE3gEAAACIAgLfAQAAAIgCCOABAAAAiAII5QEAAPwCiAIiCdIBAAD9AgAw0wEAAG8AENQBAAD9AgAw1QEBAMMCACHbAUAAxQIAIdwBQADGAgAh3QFAAMYCACHvAQEAwwIAIYoCAQDDAgAhDQQAANYCACAIAACAAwAgDwAA_wIAIBAAAIEDACDSAQAA_gIAMNMBAABcABDUAQAA_gIAMNUBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7wEBANICACGKAgEA0gIAIQPpAQAAIAAg6gEAACAAIOsBAAAgACAD6QEAACQAIOoBAAAkACDrAQAAJAAgA-kBAAAoACDqAQAAKAAg6wEAACgAIArSAQAAggMAMNMBAABWABDUAQAAggMAMNUBAQDDAgAh2wFAAMUCACHcAUAAxgIAId0BQADGAgAhiwIBAMMCACGMAgEAwwIAIY0CAQDDAgAhDwYAAIYDACARAADYAgAg0gEAAIMDADDTAQAAMAAQ1AEAAIMDADDVAQEA0gIAIdoBAACFA4QCItsBQADUAgAh3AFAANUCACHdAUAA1QIAIe8BAQDSAgAh8QEBANICACGCAgEAhAMAIYQCQADUAgAhhQJAANQCACEL3gEBAAAAAd8BAQAAAAXgAQEAAAAF4QEBAAAAAeIBAQAAAAHjAQEAAAAB5AEBAAAAAeUBAQDeAgAh5gEBAAAAAecBAQAAAAHoAQEAAAABBN4BAAAAhAIC3wEAAACEAgjgAQAAAIQCCOUBAADzAoQCIhEDAACLAwAgDwAAjgMAIBEAANgCACASAACNAwAg0gEAAIwDADDTAQAAJAAQ1AEAAIwDADDVAQEA0gIAIdoBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhkgIAACQAIJMCAAAkACAPAwAAiwMAINIBAACHAwAw0wEAACgAENQBAACHAwAw1QEBANICACHaAQAAigOAAiLcAUAA1QIAId0BQADVAgAh7gEBANICACH7AQAAiAP7ASL8AQEA0gIAIf0BEACJAwAh_gEBANICACGAAgEA0gIAIYECQADUAgAhBN4BAAAA-wEC3wEAAAD7AQjgAQAAAPsBCOUBAADvAvsBIgjeARAAAAAB3wEQAAAABOABEAAAAAThARAAAAAB4gEQAAAAAeMBEAAAAAHkARAAAAAB5QEQAO0CACEE3gEAAACAAgLfAQAAAIACCOABAAAAgAII5QEAAOsCgAIiDwQAANYCACAIAACAAwAgDwAA_wIAIBAAAIEDACDSAQAA_gIAMNMBAABcABDUAQAA_gIAMNUBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7wEBANICACGKAgEA0gIAIZICAABcACCTAgAAXAAgDwMAAIsDACAPAACOAwAgEQAA2AIAIBIAAI0DACDSAQAAjAMAMNMBAAAkABDUAQAAjAMAMNUBAQDSAgAh2gEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACHuAQEA0gIAIe8BAQDSAgAh8AEBAIQDACED6QEAADAAIOoBAAAwACDrAQAAMAAgA-kBAAANACDqAQAADQAg6wEAAA0AIALuAQEAAAAB7wEBAAAAAQ0DAACLAwAgBQAA1wIAIAgAAI4DACDSAQAAkAMAMNMBAAAgABDUAQAAkAMAMNUBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhDBgAAJIDACAZAACTAwAg0gEAAJEDADDTAQAAGAAQ1AEAAJEDADDVAQEA0gIAIdsBQADUAgAh3AFAANUCACHdAUAA1QIAIYsCAQDSAgAhjAIBANICACGNAgEA0gIAIRkGAACGAwAgDgAA2QIAIBMAAJcDACAUAADYAgAgFQAAmAMAIBYAAJgDACAXAACZAwAg0gEAAJQDADDTAQAAEwAQ1AEAAJQDADDVAQEA0gIAIdoBAACVA_gBItsBQADUAgAh3AFAANUCACHdAUAA1QIAIfABAQCEAwAh8QEBANICACHyAQEAhAMAIfMBAQCEAwAh9AEBAIQDACH1AQEAhAMAIfYBAQDSAgAh-QEAAJYD-QEikgIAABMAIJMCAAATACASBAAA1gIAIAsAANcCACAMAADYAgAgDQAA2AIAIA4AANkCACDSAQAA0QIAMNMBAAA9ABDUAQAA0QIAMNUBAQDSAgAh1gEBANICACHXAQEA0gIAIdgBAQDSAgAh2gEAANMC2gEi2wFAANQCACHcAUAA1QIAId0BQADVAgAhkgIAAD0AIJMCAAA9ACAXBgAAhgMAIA4AANkCACATAACXAwAgFAAA2AIAIBUAAJgDACAWAACYAwAgFwAAmQMAINIBAACUAwAw0wEAABMAENQBAACUAwAw1QEBANICACHaAQAAlQP4ASLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHwAQEAhAMAIfEBAQDSAgAh8gEBAIQDACHzAQEAhAMAIfQBAQCEAwAh9QEBAIQDACH2AQEA0gIAIfkBAACWA_kBIgTeAQAAAPgBAt8BAAAA-AEI4AEAAAD4AQjlAQAA5QL4ASIE3gEAAAD5AQLfAQAAAPkBCOABAAAA-QEI5QEAAOMC-QEiGQYAAIYDACAOAADZAgAgEwAAlwMAIBQAANgCACAVAACYAwAgFgAAmAMAIBcAAJkDACDSAQAAlAMAMNMBAAATABDUAQAAlAMAMNUBAQDSAgAh2gEAAJUD-AEi2wFAANQCACHcAUAA1QIAId0BQADVAgAh8AEBAIQDACHxAQEA0gIAIfIBAQCEAwAh8wEBAIQDACH0AQEAhAMAIfUBAQCEAwAh9gEBANICACH5AQAAlgP5ASKSAgAAEwAgkwIAABMAIBIEAADWAgAgCwAA1wIAIAwAANgCACANAADYAgAgDgAA2QIAINIBAADRAgAw0wEAAD0AENQBAADRAgAw1QEBANICACHWAQEA0gIAIdcBAQDSAgAh2AEBANICACHaAQAA0wLaASLbAUAA1AIAIdwBQADVAgAh3QFAANUCACGSAgAAPQAgkwIAAD0AIBEGAACGAwAgEQAA2AIAINIBAACDAwAw0wEAADAAENQBAACDAwAw1QEBANICACHaAQAAhQOEAiLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHvAQEA0gIAIfEBAQDSAgAhggIBAIQDACGEAkAA1AIAIYUCQADUAgAhkgIAADAAIJMCAAAwACAC7AEBAAAAAfEBAQAAAAEIBgAAhgMAIAcAAJwDACDSAQAAmwMAMNMBAAANABDUAQAAmwMAMOwBAQDSAgAh8QEBANICACGGAkAA1QIAIQ8DAACLAwAgBQAA1wIAIAgAAI4DACDSAQAAkAMAMNMBAAAgABDUAQAAkAMAMNUBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhkgIAACAAIJMCAAAgACAC7AEBAAAAAe0BAQAAAAEJBwAAnAMAIAoAAJMDACDSAQAAngMAMNMBAAAIABDUAQAAngMAMNwBQADVAgAh3QFAANUCACHsAQEA0gIAIe0BAQDSAgAhAu0BAQAAAAHuAQEAAAABDAMAAIsDACAKAACTAwAg0gEAAKADADDTAQAAAwAQ1AEAAKADADDVAQEA0gIAIdoBAACiA4oCItwBQADVAgAh3QFAANUCACHtAQEA0gIAIe4BAQDSAgAhiAIAAKEDiAIiBN4BAAAAiAIC3wEAAACIAgjgAQAAAIgCCOUBAAD8AogCIgTeAQAAAIoCAt8BAAAAigII4AEAAACKAgjlAQAA-gKKAiIAAAAAAZcCAQAAAAEBlwIAAADaAQIBlwJAAAAAAQGXAkAAAAABCyYAAIYEADAnAACLBAAwlAIAAIcEADCVAgAAiAQAMJYCAACJBAAglwIAAIoEADCYAgAAigQAMJkCAACKBAAwmgIAAIoEADCbAgAAjAQAMJwCAACNBAAwCyYAAPgDADAnAAD9AwAwlAIAAPkDADCVAgAA-gMAMJYCAAD7AwAglwIAAPwDADCYAgAA_AMAMJkCAAD8AwAwmgIAAPwDADCbAgAA_gMAMJwCAAD_AwAwCyYAAO8DADAnAADzAwAwlAIAAPADADCVAgAA8QMAMJYCAADyAwAglwIAAMIDADCYAgAAwgMAMJkCAADCAwAwmgIAAMIDADCbAgAA9AMAMJwCAADFAwAwCyYAAL4DADAnAADDAwAwlAIAAL8DADCVAgAAwAMAMJYCAADBAwAglwIAAMIDADCYAgAAwgMAMJkCAADCAwAwmgIAAMIDADCbAgAAxAMAMJwCAADFAwAwCyYAALADADAnAAC1AwAwlAIAALEDADCVAgAAsgMAMJYCAACzAwAglwIAALQDADCYAgAAtAMAMJkCAAC0AwAwmgIAALQDADCbAgAAtgMAMJwCAAC3AwAwBxgAAL0DACDVAQEAAAAB2wFAAAAAAdwBQAAAAAHdAUAAAAABiwIBAAAAAY0CAQAAAAECAAAAAQAgJgAAvAMAIAMAAAABACAmAAC8AwAgJwAAugMAIAEfAADABgAwDBgAAJIDACAZAACTAwAg0gEAAJEDADDTAQAAGAAQ1AEAAJEDADDVAQEAAAAB2wFAANQCACHcAUAA1QIAId0BQADVAgAhiwIBANICACGMAgEA0gIAIY0CAQDSAgAhAgAAAAEAIB8AALoDACACAAAAuAMAIB8AALkDACAK0gEAALcDADDTAQAAuAMAENQBAAC3AwAw1QEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACGLAgEA0gIAIYwCAQDSAgAhjQIBANICACEK0gEAALcDADDTAQAAuAMAENQBAAC3AwAw1QEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACGLAgEA0gIAIYwCAQDSAgAhjQIBANICACEG1QEBAKcDACHbAUAAqQMAIdwBQACqAwAh3QFAAKoDACGLAgEApwMAIY0CAQCnAwAhBxgAALsDACDVAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIYsCAQCnAwAhjQIBAKcDACEFJgAAuwYAICcAAL4GACCUAgAAvAYAIJUCAAC9BgAgmgIAABUAIAcYAAC9AwAg1QEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAYsCAQAAAAGNAgEAAAABAyYAALsGACCUAgAAvAYAIJoCAAAVACASBgAA5wMAIA4AAOwDACATAADuAwAgFAAA6AMAIBUAAOkDACAXAADrAwAg1QEBAAAAAdoBAAAA-AEC2wFAAAAAAdwBQAAAAAHdAUAAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH2AQEAAAAB-QEAAAD5AQICAAAAFQAgJgAA7QMAIAMAAAAVACAmAADtAwAgJwAAywMAIAEfAAC6BgAwFwYAAIYDACAOAADZAgAgEwAAlwMAIBQAANgCACAVAACYAwAgFgAAmAMAIBcAAJkDACDSAQAAlAMAMNMBAAATABDUAQAAlAMAMNUBAQAAAAHaAQAAlQP4ASLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHwAQEAhAMAIfEBAQDSAgAh8gEBAIQDACHzAQEAhAMAIfQBAQCEAwAh9QEBAIQDACH2AQEA0gIAIfkBAACWA_kBIgIAAAAVACAfAADLAwAgAgAAAMYDACAfAADHAwAgENIBAADFAwAw0wEAAMYDABDUAQAAxQMAMNUBAQDSAgAh2gEAAJUD-AEi2wFAANQCACHcAUAA1QIAId0BQADVAgAh8AEBAIQDACHxAQEA0gIAIfIBAQCEAwAh8wEBAIQDACH0AQEAhAMAIfUBAQCEAwAh9gEBANICACH5AQAAlgP5ASIQ0gEAAMUDADDTAQAAxgMAENQBAADFAwAw1QEBANICACHaAQAAlQP4ASLbAUAA1AIAIdwBQADVAgAh3QFAANUCACHwAQEAhAMAIfEBAQDSAgAh8gEBAIQDACHzAQEAhAMAIfQBAQCEAwAh9QEBAIQDACH2AQEA0gIAIfkBAACWA_kBIgzVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfMBAQDIAwAh9AEBAMgDACH2AQEApwMAIfkBAADKA_kBIgGXAgEAAAABAZcCAAAA-AECAZcCAAAA-QECEgYAAMwDACAOAADRAwAgEwAAzQMAIBQAAM4DACAVAADPAwAgFwAA0AMAINUBAQCnAwAh2gEAAMkD-AEi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh8AEBAMgDACHxAQEApwMAIfIBAQDIAwAh8wEBAMgDACH0AQEAyAMAIfYBAQCnAwAh-QEAAMoD-QEiBSYAAKIGACAnAAC4BgAglAIAAKMGACCVAgAAtwYAIJoCAAAmACAHJgAAmgYAICcAALUGACCUAgAAmwYAIJUCAAC0BgAgmAIAABMAIJkCAAATACCaAgAAFQAgCyYAAN0DADAnAADhAwAwlAIAAN4DADCVAgAA3wMAMJYCAADgAwAglwIAAMIDADCYAgAAwgMAMJkCAADCAwAwmgIAAMIDADCbAgAA4gMAMJwCAADFAwAwByYAAKAGACAnAACyBgAglAIAAKEGACCVAgAAsQYAIJgCAAA9ACCZAgAAPQAgmgIAAKoCACAHJgAAnAYAICcAAK8GACCUAgAAnQYAIJUCAACuBgAgmAIAADAAIJkCAAAwACCaAgAAMgAgCyYAANIDADAnAADWAwAwlAIAANMDADCVAgAA1AMAMJYCAADVAwAglwIAALQDADCYAgAAtAMAMJkCAAC0AwAwmgIAALQDADCbAgAA1wMAMJwCAAC3AwAwBxkAANwDACDVAQEAAAAB2wFAAAAAAdwBQAAAAAHdAUAAAAABjAIBAAAAAY0CAQAAAAECAAAAAQAgJgAA2wMAIAMAAAABACAmAADbAwAgJwAA2QMAIAEfAACtBgAwAgAAAAEAIB8AANkDACACAAAAuAMAIB8AANgDACAG1QEBAKcDACHbAUAAqQMAIdwBQACqAwAh3QFAAKoDACGMAgEApwMAIY0CAQCnAwAhBxkAANoDACDVAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIYwCAQCnAwAhjQIBAKcDACEFJgAAqAYAICcAAKsGACCUAgAAqQYAIJUCAACqBgAgmgIAAKoCACAHGQAA3AMAINUBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAGMAgEAAAABjQIBAAAAAQMmAACoBgAglAIAAKkGACCaAgAAqgIAIBIGAADnAwAgDgAA7AMAIBQAAOgDACAVAADpAwAgFgAA6gMAIBcAAOsDACDVAQEAAAAB2gEAAAD4AQLbAUAAAAAB3AFAAAAAAd0BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgIAAAAVACAmAADmAwAgAwAAABUAICYAAOYDACAnAADkAwAgAR8AAKcGADACAAAAFQAgHwAA5AMAIAIAAADGAwAgHwAA4wMAIAzVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfQBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIhIGAADMAwAgDgAA0QMAIBQAAM4DACAVAADPAwAgFgAA5QMAIBcAANADACDVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfQBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIgcmAACeBgAgJwAApQYAIJQCAACfBgAglQIAAKQGACCYAgAAPQAgmQIAAD0AIJoCAACqAgAgEgYAAOcDACAOAADsAwAgFAAA6AMAIBUAAOkDACAWAADqAwAgFwAA6wMAINUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfkBAAAA-QECAyYAAKIGACCUAgAAowYAIJoCAAAmACAEJgAA3QMAMJQCAADeAwAwlgIAAOADACCaAgAAwgMAMAMmAACgBgAglAIAAKEGACCaAgAAqgIAIAMmAACeBgAglAIAAJ8GACCaAgAAqgIAIAMmAACcBgAglAIAAJ0GACCaAgAAMgAgBCYAANIDADCUAgAA0wMAMJYCAADVAwAgmgIAALQDADASBgAA5wMAIA4AAOwDACATAADuAwAgFAAA6AMAIBUAAOkDACAXAADrAwAg1QEBAAAAAdoBAAAA-AEC2wFAAAAAAdwBQAAAAAHdAUAAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH2AQEAAAAB-QEAAAD5AQIDJgAAmgYAIJQCAACbBgAgmgIAABUAIBIGAADnAwAgDgAA7AMAIBMAAO4DACAUAADoAwAgFgAA6gMAIBcAAOsDACDVAQEAAAAB2gEAAAD4AQLbAUAAAAAB3AFAAAAAAd0BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgIAAAAVACAmAAD3AwAgAwAAABUAICYAAPcDACAnAAD2AwAgAR8AAJkGADACAAAAFQAgHwAA9gMAIAIAAADGAwAgHwAA9QMAIAzVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfMBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIhIGAADMAwAgDgAA0QMAIBMAAM0DACAUAADOAwAgFgAA5QMAIBcAANADACDVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfMBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIhIGAADnAwAgDgAA7AMAIBMAAO4DACAUAADoAwAgFgAA6gMAIBcAAOsDACDVAQEAAAAB2gEAAAD4AQLbAUAAAAAB3AFAAAAAAd0BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgQHAACFBAAg3AFAAAAAAd0BQAAAAAHsAQEAAAABAgAAAAoAICYAAIQEACADAAAACgAgJgAAhAQAICcAAIIEACABHwAAmAYAMAoHAACcAwAgCgAAkwMAINIBAACeAwAw0wEAAAgAENQBAACeAwAw3AFAANUCACHdAUAA1QIAIewBAQDSAgAh7QEBANICACGQAgAAnQMAIAIAAAAKACAfAACCBAAgAgAAAIAEACAfAACBBAAgB9IBAAD_AwAw0wEAAIAEABDUAQAA_wMAMNwBQADVAgAh3QFAANUCACHsAQEA0gIAIe0BAQDSAgAhB9IBAAD_AwAw0wEAAIAEABDUAQAA_wMAMNwBQADVAgAh3QFAANUCACHsAQEA0gIAIe0BAQDSAgAhA9wBQACqAwAh3QFAAKoDACHsAQEApwMAIQQHAACDBAAg3AFAAKoDACHdAUAAqgMAIewBAQCnAwAhBSYAAJMGACAnAACWBgAglAIAAJQGACCVAgAAlQYAIJoCAAAiACAEBwAAhQQAINwBQAAAAAHdAUAAAAAB7AEBAAAAAQMmAACTBgAglAIAAJQGACCaAgAAIgAgBwMAAJUEACDVAQEAAAAB2gEAAACKAgLcAUAAAAAB3QFAAAAAAe4BAQAAAAGIAgAAAIgCAgIAAAAFACAmAACUBAAgAwAAAAUAICYAAJQEACAnAACSBAAgAR8AAJIGADANAwAAiwMAIAoAAJMDACDSAQAAoAMAMNMBAAADABDUAQAAoAMAMNUBAQAAAAHaAQAAogOKAiLcAUAA1QIAId0BQADVAgAh7QEBANICACHuAQEA0gIAIYgCAAChA4gCIpECAACfAwAgAgAAAAUAIB8AAJIEACACAAAAjgQAIB8AAI8EACAK0gEAAI0EADDTAQAAjgQAENQBAACNBAAw1QEBANICACHaAQAAogOKAiLcAUAA1QIAId0BQADVAgAh7QEBANICACHuAQEA0gIAIYgCAAChA4gCIgrSAQAAjQQAMNMBAACOBAAQ1AEAAI0EADDVAQEA0gIAIdoBAACiA4oCItwBQADVAgAh3QFAANUCACHtAQEA0gIAIe4BAQDSAgAhiAIAAKEDiAIiBtUBAQCnAwAh2gEAAJEEigIi3AFAAKoDACHdAUAAqgMAIe4BAQCnAwAhiAIAAJAEiAIiAZcCAAAAiAICAZcCAAAAigICBwMAAJMEACDVAQEApwMAIdoBAACRBIoCItwBQACqAwAh3QFAAKoDACHuAQEApwMAIYgCAACQBIgCIgUmAACNBgAgJwAAkAYAIJQCAACOBgAglQIAAI8GACCaAgAAWQAgBwMAAJUEACDVAQEAAAAB2gEAAACKAgLcAUAAAAAB3QFAAAAAAe4BAQAAAAGIAgAAAIgCAgMmAACNBgAglAIAAI4GACCaAgAAWQAgBCYAAIYEADCUAgAAhwQAMJYCAACJBAAgmgIAAIoEADAEJgAA-AMAMJQCAAD5AwAwlgIAAPsDACCaAgAA_AMAMAQmAADvAwAwlAIAAPADADCWAgAA8gMAIJoCAADCAwAwBCYAAL4DADCUAgAAvwMAMJYCAADBAwAgmgIAAMIDADAEJgAAsAMAMJQCAACxAwAwlgIAALMDACCaAgAAtAMAMAAAAAAAAAAFJgAAiAYAICcAAIsGACCUAgAAiQYAIJUCAACKBgAgmgIAAKoCACADJgAAiAYAIJQCAACJBgAgmgIAAKoCACAAAAAFJgAA_AUAICcAAIYGACCUAgAA_QUAIJUCAACFBgAgmgIAAFkAIAsmAAC4BAAwJwAAvAQAMJQCAAC5BAAwlQIAALoEADCWAgAAuwQAIJcCAAD8AwAwmAIAAPwDADCZAgAA_AMAMJoCAAD8AwAwmwIAAL0EADCcAgAA_wMAMAsmAACqBAAwJwAArwQAMJQCAACrBAAwlQIAAKwEADCWAgAArQQAIJcCAACuBAAwmAIAAK4EADCZAgAArgQAMJoCAACuBAAwmwIAALAEADCcAgAAsQQAMAMGAAC3BAAg8QEBAAAAAYYCQAAAAAECAAAADwAgJgAAtgQAIAMAAAAPACAmAAC2BAAgJwAAtAQAIAEfAACEBgAwCQYAAIYDACAHAACcAwAg0gEAAJsDADDTAQAADQAQ1AEAAJsDADDsAQEA0gIAIfEBAQDSAgAhhgJAANUCACGPAgAAmgMAIAIAAAAPACAfAAC0BAAgAgAAALIEACAfAACzBAAgBtIBAACxBAAw0wEAALIEABDUAQAAsQQAMOwBAQDSAgAh8QEBANICACGGAkAA1QIAIQbSAQAAsQQAMNMBAACyBAAQ1AEAALEEADDsAQEA0gIAIfEBAQDSAgAhhgJAANUCACEC8QEBAKcDACGGAkAAqgMAIQMGAAC1BAAg8QEBAKcDACGGAkAAqgMAIQUmAAD_BQAgJwAAggYAIJQCAACABgAglQIAAIEGACCaAgAAJgAgAwYAALcEACDxAQEAAAABhgJAAAAAAQMmAAD_BQAglAIAAIAGACCaAgAAJgAgBAoAAKMEACDcAUAAAAAB3QFAAAAAAe0BAQAAAAECAAAACgAgJgAAwAQAIAMAAAAKACAmAADABAAgJwAAvwQAIAEfAAD-BQAwAgAAAAoAIB8AAL8EACACAAAAgAQAIB8AAL4EACAD3AFAAKoDACHdAUAAqgMAIe0BAQCnAwAhBAoAAKIEACDcAUAAqgMAId0BQACqAwAh7QEBAKcDACEECgAAowQAINwBQAAAAAHdAUAAAAAB7QEBAAAAAQMmAAD8BQAglAIAAP0FACCaAgAAWQAgBCYAALgEADCUAgAAuQQAMJYCAAC7BAAgmgIAAPwDADAEJgAAqgQAMJQCAACrBAAwlgIAAK0EACCaAgAArgQAMAAAAAAAAAAAAZcCAAAA-wECBZcCEAAAAAGdAhAAAAABngIQAAAAAZ8CEAAAAAGgAhAAAAABAZcCAAAAgAICBSYAAPcFACAnAAD6BQAglAIAAPgFACCVAgAA-QUAIJoCAABZACADJgAA9wUAIJQCAAD4BQAgmgIAAFkAIAAAAAGXAgAAAIQCAgUmAADxBQAgJwAA9QUAIJQCAADyBQAglQIAAPQFACCaAgAAJgAgCyYAANcEADAnAADbBAAwlAIAANgEADCVAgAA2QQAMJYCAADaBAAglwIAAMIDADCYAgAAwgMAMJkCAADCAwAwmgIAAMIDADCbAgAA3AQAMJwCAADFAwAwEgYAAOcDACAOAADsAwAgEwAA7gMAIBQAAOgDACAVAADpAwAgFgAA6gMAINUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfkBAAAA-QECAgAAABUAICYAAN8EACADAAAAFQAgJgAA3wQAICcAAN4EACABHwAA8wUAMAIAAAAVACAfAADeBAAgAgAAAMYDACAfAADdBAAgDNUBAQCnAwAh2gEAAMkD-AEi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh8AEBAMgDACHxAQEApwMAIfMBAQDIAwAh9AEBAMgDACH1AQEAyAMAIfYBAQCnAwAh-QEAAMoD-QEiEgYAAMwDACAOAADRAwAgEwAAzQMAIBQAAM4DACAVAADPAwAgFgAA5QMAINUBAQCnAwAh2gEAAMkD-AEi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh8AEBAMgDACHxAQEApwMAIfMBAQDIAwAh9AEBAMgDACH1AQEAyAMAIfYBAQCnAwAh-QEAAMoD-QEiEgYAAOcDACAOAADsAwAgEwAA7gMAIBQAAOgDACAVAADpAwAgFgAA6gMAINUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfkBAAAA-QECAyYAAPEFACCUAgAA8gUAIJoCAAAmACAEJgAA1wQAMJQCAADYBAAwlgIAANoEACCaAgAAwgMAMAAAAAUmAADsBQAgJwAA7wUAIJQCAADtBQAglQIAAO4FACCaAgAAIgAgAyYAAOwFACCUAgAA7QUAIJoCAAAiACAAAAAFJgAA5AUAICcAAOoFACCUAgAA5QUAIJUCAADpBQAgmgIAAFkAIAsmAACABQAwJwAAhQUAMJQCAACBBQAwlQIAAIIFADCWAgAAgwUAIJcCAACEBQAwmAIAAIQFADCZAgAAhAUAMJoCAACEBQAwmwIAAIYFADCcAgAAhwUAMAsmAAD3BAAwJwAA-wQAMJQCAAD4BAAwlQIAAPkEADCWAgAA-gQAIJcCAACuBAAwmAIAAK4EADCZAgAArgQAMJoCAACuBAAwmwIAAPwEADCcAgAAsQQAMAsmAADuBAAwJwAA8gQAMJQCAADvBAAwlQIAAPAEADCWAgAA8QQAIJcCAADCAwAwmAIAAMIDADCZAgAAwgMAMJoCAADCAwAwmwIAAPMEADCcAgAAxQMAMBIOAADsAwAgEwAA7gMAIBQAAOgDACAVAADpAwAgFgAA6gMAIBcAAOsDACDVAQEAAAAB2gEAAAD4AQLbAUAAAAAB3AFAAAAAAd0BQAAAAAHwAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgIAAAAVACAmAAD2BAAgAwAAABUAICYAAPYEACAnAAD1BAAgAR8AAOgFADACAAAAFQAgHwAA9QQAIAIAAADGAwAgHwAA9AQAIAzVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8gEBAMgDACHzAQEAyAMAIfQBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIhIOAADRAwAgEwAAzQMAIBQAAM4DACAVAADPAwAgFgAA5QMAIBcAANADACDVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8gEBAMgDACHzAQEAyAMAIfQBAQDIAwAh9QEBAMgDACH2AQEApwMAIfkBAADKA_kBIhIOAADsAwAgEwAA7gMAIBQAAOgDACAVAADpAwAgFgAA6gMAIBcAAOsDACDVAQEAAAAB2gEAAAD4AQLbAUAAAAAB3AFAAAAAAd0BQAAAAAHwAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgMHAADmBAAg7AEBAAAAAYYCQAAAAAECAAAADwAgJgAA_wQAIAMAAAAPACAmAAD_BAAgJwAA_gQAIAEfAADnBQAwAgAAAA8AIB8AAP4EACACAAAAsgQAIB8AAP0EACAC7AEBAKcDACGGAkAAqgMAIQMHAADlBAAg7AEBAKcDACGGAkAAqgMAIQMHAADmBAAg7AEBAAAAAYYCQAAAAAEKEQAA4QQAINUBAQAAAAHaAQAAAIQCAtsBQAAAAAHcAUAAAAAB3QFAAAAAAe8BAQAAAAGCAgEAAAABhAJAAAAAAYUCQAAAAAECAAAAMgAgJgAAiwUAIAMAAAAyACAmAACLBQAgJwAAigUAIAEfAADmBQAwDwYAAIYDACARAADYAgAg0gEAAIMDADDTAQAAMAAQ1AEAAIMDADDVAQEAAAAB2gEAAIUDhAIi2wFAANQCACHcAUAA1QIAId0BQADVAgAh7wEBANICACHxAQEA0gIAIYICAQCEAwAhhAJAANQCACGFAkAA1AIAIQIAAAAyACAfAACKBQAgAgAAAIgFACAfAACJBQAgDdIBAACHBQAw0wEAAIgFABDUAQAAhwUAMNUBAQDSAgAh2gEAAIUDhAIi2wFAANQCACHcAUAA1QIAId0BQADVAgAh7wEBANICACHxAQEA0gIAIYICAQCEAwAhhAJAANQCACGFAkAA1AIAIQ3SAQAAhwUAMNMBAACIBQAQ1AEAAIcFADDVAQEA0gIAIdoBAACFA4QCItsBQADUAgAh3AFAANUCACHdAUAA1QIAIe8BAQDSAgAh8QEBANICACGCAgEAhAMAIYQCQADUAgAhhQJAANQCACEJ1QEBAKcDACHaAQAA1ASEAiLbAUAAqQMAIdwBQACqAwAh3QFAAKoDACHvAQEApwMAIYICAQDIAwAhhAJAAKkDACGFAkAAqQMAIQoRAADWBAAg1QEBAKcDACHaAQAA1ASEAiLbAUAAqQMAIdwBQACqAwAh3QFAAKoDACHvAQEApwMAIYICAQDIAwAhhAJAAKkDACGFAkAAqQMAIQoRAADhBAAg1QEBAAAAAdoBAAAAhAIC2wFAAAAAAdwBQAAAAAHdAUAAAAAB7wEBAAAAAYICAQAAAAGEAkAAAAABhQJAAAAAAQMmAADkBQAglAIAAOUFACCaAgAAWQAgBCYAAIAFADCUAgAAgQUAMJYCAACDBQAgmgIAAIQFADAEJgAA9wQAMJQCAAD4BAAwlgIAAPoEACCaAgAArgQAMAQmAADuBAAwlAIAAO8EADCWAgAA8QQAIJoCAADCAwAwAAAABSYAAN8FACAnAADiBQAglAIAAOAFACCVAgAA4QUAIJoCAACqAgAgAyYAAN8FACCUAgAA4AUAIJoCAACqAgAgAAAACyYAAMAFADAnAADEBQAwlAIAAMEFADCVAgAAwgUAMJYCAADDBQAglwIAAIoEADCYAgAAigQAMJkCAACKBAAwmgIAAIoEADCbAgAAxQUAMJwCAACNBAAwCyYAALQFADAnAAC5BQAwlAIAALUFADCVAgAAtgUAMJYCAAC3BQAglwIAALgFADCYAgAAuAUAMJkCAAC4BQAwmgIAALgFADCbAgAAugUAMJwCAAC7BQAwCyYAAKgFADAnAACtBQAwlAIAAKkFADCVAgAAqgUAMJYCAACrBQAglwIAAKwFADCYAgAArAUAMJkCAACsBQAwmgIAAKwFADCbAgAArgUAMJwCAACvBQAwCyYAAJwFADAnAAChBQAwlAIAAJ0FADCVAgAAngUAMJYCAACfBQAglwIAAKAFADCYAgAAoAUAMJkCAACgBQAwmgIAAKAFADCbAgAAogUAMJwCAACjBQAwCtUBAQAAAAHaAQAAAIACAtwBQAAAAAHdAUAAAAAB-wEAAAD7AQL8AQEAAAAB_QEQAAAAAf4BAQAAAAGAAgEAAAABgQJAAAAAAQIAAAAqACAmAACnBQAgAwAAACoAICYAAKcFACAnAACmBQAgAR8AAN4FADAPAwAAiwMAINIBAACHAwAw0wEAACgAENQBAACHAwAw1QEBAAAAAdoBAACKA4ACItwBQADVAgAh3QFAANUCACHuAQEA0gIAIfsBAACIA_sBIvwBAQAAAAH9ARAAiQMAIf4BAQDSAgAhgAIBANICACGBAkAA1AIAIQIAAAAqACAfAACmBQAgAgAAAKQFACAfAAClBQAgDtIBAACjBQAw0wEAAKQFABDUAQAAowUAMNUBAQDSAgAh2gEAAIoDgAIi3AFAANUCACHdAUAA1QIAIe4BAQDSAgAh-wEAAIgD-wEi_AEBANICACH9ARAAiQMAIf4BAQDSAgAhgAIBANICACGBAkAA1AIAIQ7SAQAAowUAMNMBAACkBQAQ1AEAAKMFADDVAQEA0gIAIdoBAACKA4ACItwBQADVAgAh3QFAANUCACHuAQEA0gIAIfsBAACIA_sBIvwBAQDSAgAh_QEQAIkDACH-AQEA0gIAIYACAQDSAgAhgQJAANQCACEK1QEBAKcDACHaAQAAzgSAAiLcAUAAqgMAId0BQACqAwAh-wEAAMwE-wEi_AEBAKcDACH9ARAAzQQAIf4BAQCnAwAhgAIBAKcDACGBAkAAqQMAIQrVAQEApwMAIdoBAADOBIACItwBQACqAwAh3QFAAKoDACH7AQAAzAT7ASL8AQEApwMAIf0BEADNBAAh_gEBAKcDACGAAgEApwMAIYECQACpAwAhCtUBAQAAAAHaAQAAAIACAtwBQAAAAAHdAUAAAAAB-wEAAAD7AQL8AQEAAAAB_QEQAAAAAf4BAQAAAAGAAgEAAAABgQJAAAAAAQoPAACOBQAgEQAAjwUAIBIAAI0FACDVAQEAAAAB2gEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAe8BAQAAAAHwAQEAAAABAgAAACYAICYAALMFACADAAAAJgAgJgAAswUAICcAALIFACABHwAA3QUAMA8DAACLAwAgDwAAjgMAIBEAANgCACASAACNAwAg0gEAAIwDADDTAQAAJAAQ1AEAAIwDADDVAQEAAAAB2gEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACHuAQEA0gIAIe8BAQDSAgAh8AEBAIQDACECAAAAJgAgHwAAsgUAIAIAAACwBQAgHwAAsQUAIAvSAQAArwUAMNMBAACwBQAQ1AEAAK8FADDVAQEA0gIAIdoBAQDSAgAh2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhC9IBAACvBQAw0wEAALAFABDUAQAArwUAMNUBAQDSAgAh2gEBANICACHbAUAA1AIAIdwBQADVAgAh3QFAANUCACHuAQEA0gIAIe8BAQDSAgAh8AEBAIQDACEH1QEBAKcDACHaAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe8BAQCnAwAh8AEBAMgDACEKDwAA7AQAIBEAAO0EACASAADrBAAg1QEBAKcDACHaAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe8BAQCnAwAh8AEBAMgDACEKDwAAjgUAIBEAAI8FACASAACNBQAg1QEBAAAAAdoBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAHvAQEAAAAB8AEBAAAAAQgFAADCBAAgCAAAwwQAINUBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAHvAQEAAAAB8AEBAAAAAQIAAAAiACAmAAC_BQAgAwAAACIAICYAAL8FACAnAAC-BQAgAR8AANwFADAOAwAAiwMAIAUAANcCACAIAACOAwAg0gEAAJADADDTAQAAIAAQ1AEAAJADADDVAQEAAAAB2wFAANQCACHcAUAA1QIAId0BQADVAgAh7gEBANICACHvAQEA0gIAIfABAQCEAwAhjgIAAI8DACACAAAAIgAgHwAAvgUAIAIAAAC8BQAgHwAAvQUAIArSAQAAuwUAMNMBAAC8BQAQ1AEAALsFADDVAQEA0gIAIdsBQADUAgAh3AFAANUCACHdAUAA1QIAIe4BAQDSAgAh7wEBANICACHwAQEAhAMAIQrSAQAAuwUAMNMBAAC8BQAQ1AEAALsFADDVAQEA0gIAIdsBQADUAgAh3AFAANUCACHdAUAA1QIAIe4BAQDSAgAh7wEBANICACHwAQEAhAMAIQbVAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe8BAQCnAwAh8AEBAMgDACEIBQAAqAQAIAgAAKkEACDVAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe8BAQCnAwAh8AEBAMgDACEIBQAAwgQAIAgAAMMEACDVAQEAAAAB2wFAAAAAAdwBQAAAAAHdAUAAAAAB7wEBAAAAAfABAQAAAAEHCgAAlAUAINUBAQAAAAHaAQAAAIoCAtwBQAAAAAHdAUAAAAAB7QEBAAAAAYgCAAAAiAICAgAAAAUAICYAAMgFACADAAAABQAgJgAAyAUAICcAAMcFACABHwAA2wUAMAIAAAAFACAfAADHBQAgAgAAAI4EACAfAADGBQAgBtUBAQCnAwAh2gEAAJEEigIi3AFAAKoDACHdAUAAqgMAIe0BAQCnAwAhiAIAAJAEiAIiBwoAAJMFACDVAQEApwMAIdoBAACRBIoCItwBQACqAwAh3QFAAKoDACHtAQEApwMAIYgCAACQBIgCIgcKAACUBQAg1QEBAAAAAdoBAAAAigIC3AFAAAAAAd0BQAAAAAHtAQEAAAABiAIAAACIAgIEJgAAwAUAMJQCAADBBQAwlgIAAMMFACCaAgAAigQAMAQmAAC0BQAwlAIAALUFADCWAgAAtwUAIJoCAAC4BQAwBCYAAKgFADCUAgAAqQUAMJYCAACrBQAgmgIAAKwFADAEJgAAnAUAMJQCAACdBQAwlgIAAJ8FACCaAgAAoAUAMAAAAAAAAAYDAADUBQAgDwAA1gUAIBEAAJ0EACASAADVBQAg2wEAAKMDACDwAQAAowMAIAUEAACbBAAgCAAAzgUAIA8AAM0FACAQAADPBQAg2wEAAKMDACAAAA0GAADTBQAgDgAAngQAIBMAANcFACAUAACdBAAgFQAA2AUAIBYAANgFACAXAADZBQAg2wEAAKMDACDwAQAAowMAIPIBAACjAwAg8wEAAKMDACD0AQAAowMAIPUBAACjAwAgBgQAAJsEACALAACcBAAgDAAAnQQAIA0AAJ0EACAOAACeBAAg2wEAAKMDACAGBgAA0wUAIBEAAJ0EACDbAQAAowMAIIICAACjAwAghAIAAKMDACCFAgAAowMAIAUDAADUBQAgBQAAnAQAIAgAANYFACDbAQAAowMAIPABAACjAwAgBtUBAQAAAAHaAQAAAIoCAtwBQAAAAAHdAUAAAAAB7QEBAAAAAYgCAAAAiAICBtUBAQAAAAHbAUAAAAAB3AFAAAAAAd0BQAAAAAHvAQEAAAAB8AEBAAAAAQfVAQEAAAAB2gEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAe8BAQAAAAHwAQEAAAABCtUBAQAAAAHaAQAAAIACAtwBQAAAAAHdAUAAAAAB-wEAAAD7AQL8AQEAAAAB_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_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_kBIgMAAAAkACAmAACiBgAgJwAAuQYAIA0AAAAkACADAADqBAAgDwAA7AQAIBIAAOsEACAfAAC5BgAg1QEBAKcDACHaAQEApwMAIdsBQACpAwAh3AFAAKoDACHdAUAAqgMAIe4BAQCnAwAh7wEBAKcDACHwAQEAyAMAIQsDAADqBAAgDwAA7AQAIBIAAOsEACDVAQEApwMAIdoBAQCnAwAh2wFAAKkDACHcAUAAqgMAId0BQACqAwAh7gEBAKcDACHvAQEApwMAIfABAQDIAwAhDNUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9gEBAAAAAfkBAAAA-QECEwYAAOcDACATAADuAwAgFAAA6AMAIBUAAOkDACAWAADqAwAgFwAA6wMAINUBAQAAAAHaAQAAAPgBAtsBQAAAAAHcAUAAAAAB3QFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH5AQAAAPkBAgIAAAAVACAmAAC7BgAgAwAAABMAICYAALsGACAnAAC_BgAgFQAAABMAIAYAAMwDACATAADNAwAgFAAAzgMAIBUAAM8DACAWAADlAwAgFwAA0AMAIB8AAL8GACDVAQEApwMAIdoBAADJA_gBItsBQACpAwAh3AFAAKoDACHdAUAAqgMAIfABAQDIAwAh8QEBAKcDACHyAQEAyAMAIfMBAQDIAwAh9AEBAMgDACH1AQEAyAMAIfYBAQCnAwAh-QEAAMoD-QEiEwYAAMwDACATAADNAwAgFAAAzgMAIBUAAM8DACAWAADlAwAgFwAA0AMAINUBAQCnAwAh2gEAAMkD-AEi2wFAAKkDACHcAUAAqgMAId0BQACqAwAh8AEBAMgDACHxAQEApwMAIfIBAQDIAwAh8wEBAMgDACH0AQEAyAMAIfUBAQDIAwAh9gEBAKcDACH5AQAAygP5ASIG1QEBAAAAAdsBQAAAAAHcAUAAAAAB3QFAAAAAAYsCAQAAAAGNAgEAAAABAhgAAhkABggGAAMJABEOQQETOwIUPAIVPgYWPwYXQA4FAwAECQAQDzYJETcCEjMOBQQGBQgnAwkADQ8jCBArDAIDAAQKAAYGBAcFCQALCwsHDBYCDRcCDhoBAgcACAoABgQDAAQFDAcIEAkJAAoCBgADBwAIAgURAAgSAAUEGwALHAAMHQANHgAOHwABAwAEBAQsAAguAA8tABAvAAMGAAMJAA8RNAIBETUAAw85ABE6ABI4AAIOQwAUQgAAAhgAAhkABgIYAAIZAAYDCQAWLAAXLQAYAAAAAwkAFiwAFy0AGAAAAwkAHSwAHi0AHwAAAAMJAB0sAB4tAB8CAwAECgAGAgMABAoABgMJACQsACUtACYAAAADCQAkLAAlLQAmAQMABAEDAAQDCQArLAAsLQAtAAAAAwkAKywALC0ALQIGAAMHAAgCBgADBwAIAwkAMiwAMy0ANAAAAAMJADIsADMtADQBBgADAQYAAwMJADksADotADsAAAADCQA5LAA6LQA7AQMABAEDAAQFCQBALABDLQBEjgEAQY8BAEIAAAAAAAUJAEAsAEMtAESOAQBBjwEAQgUGAAMT6gECFesBBhbsAQYX7QEOBQYAAxPzAQIV9AEGFvUBBhf2AQ4DCQBJLABKLQBLAAAAAwkASSwASi0ASwEDAAQBAwAEAwkAUCwAUS0AUgAAAAMJAFAsAFEtAFICBwAICgAGAgcACAoABgMJAFcsAFgtAFkAAAADCQBXLABYLQBZAAADCQBeLABfLQBgAAAAAwkAXiwAXy0AYBoCARtEARxFAR1GAR5HASBJASFLEiJMEyNOASRQEiVRFChSASlTASpUEi5XFS9YGTBaBDFbBDJeBDNfBDRgBDViBDZkEjdlGjhnBDlpEjpqGztrBDxsBD1tEj5wHD9xIEByBUFzBUJ0BUN1BUR2BUV4BUZ6Ekd7IUh9BUl_EkqAASJLgQEFTIIBBU2DARJOhgEjT4cBJ1CIAQNRiQEDUooBA1OLAQNUjAEDVY4BA1aQARJXkQEoWJMBA1mVARJalgEpW5cBA1yYAQNdmQESXpwBKl-dAS5gngEJYZ8BCWKgAQljoQEJZKIBCWWkAQlmpgESZ6cBL2ipAQlpqwESaqwBMGutAQlsrgEJba8BEm6yATFvswE1cLQBDnG1AQ5ytgEOc7cBDnS4AQ51ugEOdrwBEne9ATZ4vwEOecEBEnrCATd7wwEOfMQBDn3FARJ-yAE4f8kBPIABygEMgQHLAQyCAcwBDIMBzQEMhAHOAQyFAdABDIYB0gEShwHTAT2IAdUBDIkB1wESigHYAT6LAdkBDIwB2gEMjQHbARKQAd4BP5EB3wFFkgHgAQKTAeEBApQB4gEClQHjAQKWAeQBApcB5gECmAHoARKZAekBRpoB7wECmwHxARKcAfIBR50B9wECngH4AQKfAfkBEqAB_AFIoQH9AUyiAf4BCKMB_wEIpAGAAgilAYECCKYBggIIpwGEAgioAYYCEqkBhwJNqgGJAgirAYsCEqwBjAJOrQGNAgiuAY4CCK8BjwISsAGSAk-xAZMCU7IBlAIHswGVAge0AZYCB7UBlwIHtgGYAge3AZoCB7gBnAISuQGdAlS6AZ8CB7sBoQISvAGiAlW9AaMCB74BpAIHvwGlAhLAAagCVsEBqQJawgGrAgbDAawCBsQBrgIGxQGvAgbGAbACBscBsgIGyAG0AhLJAbUCW8oBtwIGywG5AhLMAboCXM0BuwIGzgG8AgbPAb0CEtABwAJd0QHBAmE"
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
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
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
  Comment: "Comment",
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
var CommentScalarFieldEnum = {
  id: "id",
  taskId: "taskId",
  authorId: "authorId",
  content: "content",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
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

// src/app/module/comment/comment.route.ts
import { Router as Router6 } from "express";

// src/app/module/comment/comment.service.ts
var createComment = async (organizationId, userId, taskId, payload) => {
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
  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      taskId,
      authorId: userId
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
  return comment;
};
var getCommentsByTask = async (organizationId, taskId) => {
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
  const comments = await prisma.comment.findMany({
    where: {
      taskId,
      deletedAt: null
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return comments;
};
var updateComment = async (organizationId, userId, commentId, payload) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      task: {
        project: {
          organizationId,
          deletedAt: null
        },
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.authorId !== userId) {
    throw new Error("Unauthorized to update this comment");
  }
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: payload.content },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
  return updatedComment;
};
var deleteComment = async (organizationId, userId, userRole, commentId) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      task: {
        project: {
          organizationId,
          deletedAt: null
        },
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.authorId !== userId && userRole !== "ADMIN" && userRole !== "MANAGER") {
    throw new Error("Unauthorized to delete this comment");
  }
  const deletedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedComment;
};
var commentService = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment
};

// src/app/module/comment/comment.controller.ts
import { StatusCodes as StatusCodes7 } from "http-status-codes";
var createComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { taskId } = req.params;
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await commentService.createComment(
      organizationId,
      userId,
      taskId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.CREATED,
      message: "Comment added successfully",
      data: result
    });
  }
);
var getCommentsByTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await commentService.getCommentsByTask(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comments retrieved successfully",
      data: result
    });
  }
);
var updateComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { commentId } = req.params;
    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }
    const result = await commentService.updateComment(
      organizationId,
      userId,
      commentId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comment updated successfully",
      data: result
    });
  }
);
var deleteComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { commentId } = req.params;
    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }
    const result = await commentService.deleteComment(
      organizationId,
      userId,
      userRole,
      commentId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comment deleted successfully",
      data: result
    });
  }
);
var commentController = {
  createComment: createComment2,
  getCommentsByTask: getCommentsByTask2,
  updateComment: updateComment2,
  deleteComment: deleteComment2
};

// src/app/module/comment/comment.schema.ts
import { z as z6 } from "zod";
var createCommentSchema = z6.object({
  body: z6.object({
    content: z6.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var updateCommentSchema = z6.object({
  body: z6.object({
    content: z6.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var commentValidation = {
  createCommentSchema,
  updateCommentSchema
};

// src/app/module/comment/comment.route.ts
var router6 = Router6();
router6.post(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(commentValidation.createCommentSchema),
  commentController.createComment
);
router6.get(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  commentController.getCommentsByTask
);
router6.patch(
  "/:commentId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(commentValidation.updateCommentSchema),
  commentController.updateComment
);
router6.delete(
  "/:commentId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  commentController.deleteComment
);
var commentRoutes = router6;

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
app.use("/api/v1/comments", commentRoutes);
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